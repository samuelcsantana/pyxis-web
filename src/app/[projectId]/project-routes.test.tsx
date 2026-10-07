import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { OverviewReport } from '@/domain/overview';
import { MockOverviewService } from '@/services/overview/mock-overview-service';
import type { IOverviewService } from '@/services/overview/overview-service.interface';
import ProjectError from './error';
import ProjectLayout from './layout';
import ProjectLoading from './loading';
import OverviewPage from './overview/page';

const state = vi.hoisted<{
  admin: unknown;
  failure: Error | undefined;
  overview: IOverviewService['overview'];
}>(() => ({
  admin: undefined,
  failure: undefined,
  overview: () => Promise.reject(new Error('overview not set')),
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

vi.mock('@/services/overview/overview-service.factory', () => ({
  createOverviewService: (): IOverviewService => ({
    overview: (projectId, range) => state.overview(projectId, range),
  }),
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
  state.overview = (projectId, range) => new MockOverviewService().overview(projectId, range);
});

const LATE_EVENING_IN_SAO_PAULO = new Date('2026-10-06T02:30:00.000Z');

function renderOverview(search: Record<string, string> = { range: '7d' }) {
  return OverviewPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

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
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(LATE_EVENING_IN_SAO_PAULO);
  });

  it('asks the overview of the period in the project time zone', async () => {
    const overview = vi.fn<IOverviewService['overview']>((projectId, range) =>
      new MockOverviewService().overview(projectId, range),
    );
    state.overview = overview;

    render(await renderOverview());

    expect(overview).toHaveBeenCalledWith('p-store', { from: '2026-09-29', to: '2026-10-05' });
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Sep 29 – Oct 5, 2026')).toBeInTheDocument();
  });

  it('shows the figures, the daily chart and the top pages and events', async () => {
    render(await renderOverview());

    for (const name of ['Visits', 'Identified users', 'Conversions', 'Write error rate']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getAllByText('vs. previous 7 days')).toHaveLength(1);
    expect(screen.getByText('Page views and named events, last 7 days')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Top pages' })).toHaveTextContent('/calculator');
    expect(screen.getByRole('region', { name: 'Top events' })).toHaveTextContent(
      'Calculator result shown',
    );
  });

  it('links the top pages and events to their visits in the same period', async () => {
    render(await renderOverview({ from: '2026-09-01', to: '2026-09-30' }));

    expect(
      screen.getByRole('link', { name: 'See the visits that opened /calculator' }),
    ).toHaveAttribute('href', '/p-store/visits?from=2026-09-01&to=2026-09-30&path=%2Fcalculator');
    expect(
      screen.getByRole('link', { name: 'See the visits that had Calculator result shown' }),
    ).toHaveAttribute(
      'href',
      '/p-store/visits?from=2026-09-01&to=2026-09-30&event=calculator_result_shown',
    );
  });

  it('shows how to install the SDK when nothing arrived in the period', async () => {
    const empty = await new MockOverviewService().overview('p-store', {
      from: '2026-10-05',
      to: '2026-10-05',
    });
    state.overview = (): Promise<OverviewReport> =>
      Promise.resolve({
        ...empty,
        days: empty.days.map((day) => ({ ...day, pageViews: 0, events: 0 })),
      });

    render(await renderOverview({ range: 'today' }));

    expect(
      screen.getByRole('heading', { name: 'No events in this period yet' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Visits' })).not.toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.overview = () => Promise.reject(new UnauthenticatedError());

    await expect(renderOverview()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('answers not found when the API knows no such project', async () => {
    state.overview = () => Promise.reject(new ApiNotFoundError('/v1/projects/p-store/overview'));

    await expect(renderOverview()).rejects.toThrow('not-found');
  });

  it('lets any other failure reach the error screen', async () => {
    state.overview = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/overview', 503));

    await expect(renderOverview()).rejects.toThrow(ApiRequestError);
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
    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
  });

  it('shows no error id when there is none', () => {
    render(<ProjectError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.queryByText(/error id/)).not.toBeInTheDocument();
  });
});
