import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InstallGuide } from '@/components/install/install-guide';
import type { Admin } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import InstallPage, { generateMetadata } from './page';

const SETTINGS: ProjectSettings = {
  id: 'p-store',
  accountId: 'a1',
  role: 'owner',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
  allowedOrigins: ['https://store.example.com'],
  createdAt: '2026-11-20T12:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: 'pyxis_pk_store', createdAt: '2026-11-20T12:00:00.000Z' }],
  secretKeys: [],
  deletionHeldAt: null,
};

const state = vi.hoisted<{ settings: () => Promise<ProjectSettings> }>(() => ({
  settings: () => Promise.reject(new Error('settings not set')),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({
        email: 'owner@demo-store.example',
        projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
      }),
    settings: () => state.settings(),
  }),
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
  useRouter: () => ({ refresh: vi.fn() }),
}));

const PARAMS = { params: Promise.resolve({ projectId: 'p-store' }) };

describe('InstallPage', () => {
  beforeEach(() => {
    state.settings = () => Promise.resolve(SETTINGS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the snippets with the key and the API it talks to', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getByRole('heading', { level: 1, name: 'Install' })).toBeInTheDocument();
    expect(
      screen.getByText(
        /init\(\{ key: 'pyxis_pk_store', endpoint: 'https:\/\/api\.pyxis\.example\.com' \}\);$/m,
      ),
    ).toBeInTheDocument();
  });

  it('points the demo at the hosted API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getAllByText(/https:\/\/api\.pyxis-analytics\.dev/).length).toBeGreaterThan(0);
  });

  it('is titled after the step and the project', async () => {
    await expect(generateMetadata(PARAMS)).resolves.toEqual({ title: 'Install · Demo Store' });
  });
});

describe('InstallGuide', () => {
  it('waits for the first event from the allowed origin', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const second = screen.getByRole('region', { name: '2. Open a page of your site' });
    expect(second).toHaveTextContent('Page views from https://store.example.com show up here');
    expect(within(second).getByRole('status')).toHaveTextContent('Waiting for the first event…');
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(3);
  });

  it('opens the dashboard once the first event arrived', () => {
    render(
      <InstallGuide
        settings={{
          ...SETTINGS,
          firstEventAt: '2026-11-20T12:01:00.000Z',
          lastEventAt: '2026-11-20T12:01:00.000Z',
        }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('The first event arrived.');
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
  });

  it('writes no key and no origin when the project has none', () => {
    render(
      <InstallGuide
        settings={{ ...SETTINGS, publicKeys: [], allowedOrigins: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    expect(screen.getAllByText(/key: ''/).length).toBeGreaterThan(0);
  });
});
