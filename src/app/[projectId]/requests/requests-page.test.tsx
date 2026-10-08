import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { RequestsReport } from '@/domain/requests';
import { MockRequestsService } from '@/services/requests/mock-requests-service';
import type { IRequestsService } from '@/services/requests/requests-service.interface';
import RequestsPage from './page';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const state = vi.hoisted<{
  admin: unknown;
  requests: IRequestsService['requests'];
  failedReads: IRequestsService['failedReads'];
  routeDays: IRequestsService['routeDays'];
}>(() => ({
  admin: undefined,
  requests: () => Promise.reject(new Error('requests not set')),
  failedReads: () => Promise.reject(new Error('failed reads not set')),
  routeDays: () => Promise.reject(new Error('route days not set')),
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
  usePathname: () => '/p-store/requests',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/requests/requests-service.factory', () => ({
  createRequestsService: (): IRequestsService => ({
    requests: (projectId, range, screenPath) => state.requests(projectId, range, screenPath),
    failedReads: (projectId, range, screenPath) => state.failedReads(projectId, range, screenPath),
    routeDays: (projectId, range, kind, screenPath, route) =>
      state.routeDays(projectId, range, kind, screenPath, route),
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

function renderRequests(search: Record<string, string> = { range: '7d' }) {
  return RequestsPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.requests = (projectId, range, screenPath) =>
    new MockRequestsService().requests(projectId, range, screenPath);
  state.failedReads = (projectId, range, screenPath) =>
    new MockRequestsService().failedReads(projectId, range, screenPath);
  state.routeDays = (projectId, range, kind, screenPath, route) =>
    new MockRequestsService().routeDays(projectId, range, kind, screenPath, route);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('RequestsPage', () => {
  it('asks the writes of the period and shows the figures and every route', async () => {
    const requests = vi.fn<IRequestsService['requests']>((projectId, range, screenPath) =>
      new MockRequestsService().requests(projectId, range, screenPath),
    );
    state.requests = requests;

    renderWithMessages(await renderRequests());

    expect(requests).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      null,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Requests' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Write error rate' })).toHaveTextContent(/failed:/);
    expect(screen.getByRole('group', { name: 'Slowest route' })).toHaveTextContent(
      'median of POST /payouts',
    );
    expect(within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row')).toHaveLength(
      9,
    );
    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&show=failing',
    );
    const tabs = screen.getByRole('navigation', { name: 'Request kind' });
    expect(within(tabs).getByRole('link', { name: 'Writes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(tabs).getByRole('link', { name: 'Failed reads' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&kind=reads',
    );
    expect(screen.getByText(/Failed reads have their own tab/)).toBeInTheDocument();
    expect(
      screen.getByText('Every write that failed, by what went wrong, last 7 days'),
    ).toBeInTheDocument();
  });

  it('charts the failed reads per day, and nothing per day for an API that has no days', async () => {
    renderWithMessages(await renderRequests({ range: '7d', kind: 'reads' }));
    expect(
      screen.getByText('Every read that failed, by what went wrong, last 7 days'),
    ).toBeInTheDocument();
    cleanup();

    state.requests = (projectId, range, screenPath) =>
      new MockRequestsService()
        .requests(projectId, range, screenPath)
        .then((report) => ({ ...report, days: [] }));
    renderWithMessages(await renderRequests());

    expect(screen.queryByText('Failures per day')).not.toBeInTheDocument();
  });

  it('shows the failed reads by count, without a rate, and keeps the tab in every link', async () => {
    const failedReads = vi.fn<IRequestsService['failedReads']>((projectId, range, screenPath) =>
      new MockRequestsService().failedReads(projectId, range, screenPath),
    );
    state.failedReads = failedReads;
    state.requests = () => Promise.reject(new Error('the writes were asked'));

    renderWithMessages(await renderRequests({ range: '30d', kind: 'reads', show: 'failing' }));

    expect(failedReads).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      null,
    );
    expect(screen.getByText('The reads Demo Store made that failed')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Failed reads' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Routes failing' })).toHaveTextContent(
      'Most: GET /orders/:id',
    );
    expect(screen.queryByRole('region', { name: 'Write error rate' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Show' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Failed' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('navigation', { name: 'Request kind' })).getByRole('link', {
        name: 'Failed reads',
      }),
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&kind=reads',
    );
    expect(screen.getByRole('link', { name: 'Writes' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d',
    );
    expect(screen.getByText(/so reads have no error rate/)).toBeInTheDocument();
  });

  it('keeps the screen filter when it switches between writes and failed reads', async () => {
    renderWithMessages(await renderRequests({ range: '30d', kind: 'reads', screen: '/products' }));

    expect(screen.getByRole('link', { name: 'Writes' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d&screen=%2Fproducts',
    );
    expect(screen.getByRole('link', { name: 'Clear the screen filter' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d&kind=reads',
    );
  });

  it('says what an API older than the failed reads cannot show', async () => {
    state.failedReads = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/requests', 400));

    renderWithMessages(await renderRequests({ kind: 'reads' }));

    expect(
      screen.getByRole('heading', { level: 2, name: 'Failed reads need a newer Pyxis API' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Routes' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Writes' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d',
    );
  });

  it('lets any other failure of the failed reads through', async () => {
    state.failedReads = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/requests', 503));
    await expect(renderRequests({ kind: 'reads' })).rejects.toThrow('answered 503');

    state.failedReads = () => Promise.reject(new UnauthenticatedError());
    await expect(renderRequests({ kind: 'reads' })).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('keeps only the failing routes and the screen filter, in every link', async () => {
    const requests = vi.fn<IRequestsService['requests']>((projectId, range, screenPath) =>
      new MockRequestsService().requests(projectId, range, screenPath),
    );
    state.requests = requests;

    renderWithMessages(await renderRequests({ range: '30d', show: 'failing', screen: '/orders' }));

    expect(requests).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      '/orders',
    );
    expect(within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row')).toHaveLength(
      2,
    );
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&show=failing&screen=%2Forders',
    );
    expect(screen.getByRole('link', { name: 'All routes' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d&screen=%2Forders',
    );
    expect(screen.getByRole('link', { name: 'Clear the screen filter' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=30d&show=failing',
    );
  });

  it('offers the routes it shows as a CSV file, filters kept', async () => {
    renderWithMessages(await renderRequests({ range: '30d', show: 'failing', screen: '/orders' }));

    expect(screen.getByRole('link', { name: 'Writes as CSV' })).toHaveAttribute(
      'href',
      '/p-store/requests/export?range=30d&show=failing&screen=%2Forders',
    );
  });

  it('offers the failed reads as their own CSV file', async () => {
    renderWithMessages(await renderRequests({ range: '7d', kind: 'reads' }));

    expect(screen.getByRole('link', { name: 'Failed reads as CSV' })).toHaveAttribute(
      'href',
      '/p-store/requests/export?range=7d&kind=reads',
    );
  });

  it('says what is missing for each filter', async () => {
    state.requests = (): Promise<RequestsReport> =>
      Promise.resolve({ routes: [], days: [], routeDays: null });

    const { unmount } = renderWithMessages(await renderRequests());
    expect(
      screen.getByText('No writes in this period. Calls sent with trackRequest() show up here.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Slowest route' })).toHaveTextContent('—');
    unmount();

    const failing = renderWithMessages(await renderRequests({ show: 'failing' }));
    expect(screen.getByText('No route failed in this period.')).toBeInTheDocument();
    failing.unmount();

    const fromScreen = renderWithMessages(await renderRequests({ screen: '/settings' }));
    expect(screen.getByText('No writes from /settings in this period.')).toBeInTheDocument();
    fromScreen.unmount();

    state.failedReads = (): Promise<RequestsReport> =>
      Promise.resolve({ routes: [], days: [], routeDays: null });
    const reads = renderWithMessages(await renderRequests({ kind: 'reads' }));
    expect(
      screen.getByText(
        'No read failed in this period. GET calls sent with trackRequest() show up here when they fail.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Failed reads' })).toHaveTextContent(
      'No read failed in this period',
    );
    reads.unmount();

    renderWithMessages(await renderRequests({ kind: 'reads', screen: '/settings' }));
    expect(screen.getByText('No failed reads from /settings in this period.')).toBeInTheDocument();
  });

  it('loads the days of an opened route in the period, tab and screen of the page', async () => {
    const routeDays = vi.fn<IRequestsService['routeDays']>(
      (projectId, range, kind, screenPath, route) =>
        new MockRequestsService().routeDays(projectId, range, kind, screenPath, route),
    );
    state.routeDays = routeDays;
    renderWithMessages(await renderRequests({ range: '7d', kind: 'reads', screen: '/products' }));

    fireEvent.click(screen.getByRole('button', { name: 'GET /products, show details' }));

    const days = await screen.findByRole('table', { name: 'Day by day' });
    expect(routeDays).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      'reads',
      '/products',
      'GET /products',
    );
    expect(within(days).queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.requests = () => Promise.reject(new UnauthenticatedError());

    await expect(renderRequests()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
