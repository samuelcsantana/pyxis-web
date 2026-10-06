import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import ProjectError from './error';
import ProjectLayout from './layout';
import ProjectLoading from './loading';
import OverviewPage from './overview/page';

const state = vi.hoisted<{ admin: unknown; failure: Error | undefined }>(() => ({
  admin: undefined,
  failure: undefined,
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/p-store/overview',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () =>
      state.failure === undefined ? Promise.resolve(state.admin) : Promise.reject(state.failure),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

beforeEach(() => {
  state.admin = ADMIN;
  state.failure = undefined;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ProjectLayout', () => {
  it('frames the screen with the sidebar and the demo banner in demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    render(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent('Demo data');
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('shows no demo banner with a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    render(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(
      ProjectLayout({ children: null, params: Promise.resolve({ projectId: 'p-other' }) }),
    ).rejects.toThrow('not-found');
  });
});

describe('OverviewPage', () => {
  it('shows the period in the project time zone and the project settings', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));

    render(
      await OverviewPage({
        params: Promise.resolve({ projectId: 'p-store' }),
        searchParams: Promise.resolve({ range: '7d' }),
      }),
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Sep 29 – Oct 5, 2026')).toBeInTheDocument();
    expect(screen.getByText('signup_completed')).toBeInTheDocument();
  });
});

describe('loading and error states', () => {
  it('shows a skeleton while the project loads', () => {
    render(<ProjectLoading />);

    expect(screen.getByRole('region', { name: 'Loading the project' })).toBeInTheDocument();
  });

  it('offers a retry and the error id when the screen fails', () => {
    const retry = vi.fn();
    const error = Object.assign(new Error('boom'), { digest: 'abc123' });
    render(<ProjectError error={error} retry={retry} />);

    screen.getByRole('button', { name: 'Try again' }).click();

    expect(screen.getByText('error id abc123')).toBeInTheDocument();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('shows no error id when there is none', () => {
    render(<ProjectError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.queryByText(/error id/)).not.toBeInTheDocument();
  });
});
