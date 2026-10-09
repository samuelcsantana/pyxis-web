import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectSettings } from '@/domain/project-settings';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import SettingsPage, { generateMetadata } from './page';

const state = vi.hoisted<{
  admin: unknown;
  settings: (projectId: string) => Promise<ProjectSettings>;
}>(() => ({
  admin: undefined,
  settings: () => Promise.reject(new Error('settings not set')),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => `/${DEMO_STORE.id}/settings`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
    settings: (projectId: string) => state.settings(projectId),
  }),
}));

const STORE = {
  id: DEMO_STORE.id,
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const ADMIN: Admin = { email: 'owner@demo-store.example', projects: [STORE] };

function renderSettings(projectId = DEMO_STORE.id) {
  return SettingsPage({ params: Promise.resolve({ projectId }) });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.settings = (projectId) => new MockProjectsService().settings(projectId);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('SettingsPage', () => {
  it('asks the settings of the project and shows them under the Settings title', async () => {
    const settings = vi.fn((projectId: string) => new MockProjectsService().settings(projectId));
    state.settings = settings;

    renderWithMessages(await renderSettings());

    expect(settings).toHaveBeenCalledWith(DEMO_STORE.id);
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText(/How Demo Store is set up/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Keys' })).toHaveTextContent('pyxis_pk_');
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.settings = () => Promise.reject(new UnauthenticatedError());

    await expect(renderSettings()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(renderSettings('p-unknown')).rejects.toThrow('not-found');
  });

  it('titles the page with the screen and the project', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ projectId: STORE.id }) });

    expect(metadata.title).toBe('Settings · Demo Store');
  });
});
