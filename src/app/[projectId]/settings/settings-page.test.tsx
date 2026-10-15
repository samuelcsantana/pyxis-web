import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectSettings } from '@/domain/project-settings';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { MockProjectPeopleService } from '@/services/project-people/mock-project-people-service';
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
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => `/${DEMO_STORE.id}/settings`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/project-people/project-people-service.factory', () => ({
  createProjectPeopleService: () => new MockProjectPeopleService(),
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
    expect(screen.getByText(/How Demo Store is set up, its keys/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Keys' })).toHaveTextContent('pyxis_pk_');
    expect(
      within(screen.getByRole('region', { name: 'Project' })).getByRole('textbox', {
        name: 'Name',
      }),
    ).toHaveValue(DEMO_STORE.name);
  });

  it.each([
    ['someone the owner added', 'member', /Only the owner of its account changes the project/],
    ['the operator', null, /Project settings change through the command line/],
  ] as const)('tells %s who changes the project', async (_, role, subtitle) => {
    state.settings = async (projectId) => ({
      ...(await new MockProjectsService().settings(projectId)),
      role,
    });

    renderWithMessages(await renderSettings());

    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Project' })).queryByRole('textbox'),
    ).not.toBeInTheDocument();
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

  it('gives the demo settings their live demo address as the canonical one', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const metadata = await generateMetadata({ params: Promise.resolve({ projectId: STORE.id }) });

    expect(metadata.alternates?.canonical).toBe(
      `https://demo.pyxis-analytics.dev/${STORE.id}/settings`,
    );
  });

  it('gives the settings of a dashboard with a real API no canonical address', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const metadata = await generateMetadata({ params: Promise.resolve({ projectId: STORE.id }) });

    expect(metadata.alternates).toBeUndefined();
  });
});
