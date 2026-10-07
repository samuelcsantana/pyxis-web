import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { RequestsReport } from '@/domain/requests';
import { MockRequestsService } from '@/services/requests/mock-requests-service';
import type { IRequestsService } from '@/services/requests/requests-service.interface';
import RequestsPage from './page';

const state = vi.hoisted<{
  admin: unknown;
  requests: IRequestsService['requests'];
  failedReads: IRequestsService['failedReads'];
}>(() => ({
  admin: undefined,
  requests: () => Promise.reject(new Error('requests not set')),
  failedReads: () => Promise.reject(new Error('failed reads not set')),
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
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('RequestsPage', () => {
  it('asks the writes of the period and shows the figures and every route', async () => {
    const requests = vi.fn<IRequestsService['requests']>((projectId, range, screenPath) =>
      new MockRequestsService().requests(projectId, range, screenPath),
    );
    state.requests = requests;

    render(await renderRequests());

    expect(requests).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      null,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Requests' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Error rate' })).toHaveTextContent(/failed:/);
    expect(screen.getByRole('region', { name: 'Slowest route' })).toHaveTextContent(
      'median of POST /payouts',
    );
    expect(within(screen.getByRole('table', { name: 'Routes' })).getAllByRole('row')).toHaveLength(
      9,
    );
    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'href',
      '/p-store/requests?range=7d&show=failing',
    );
  });

  it('keeps only the failing routes and the screen filter, in every link', async () => {
    const requests = vi.fn<IRequestsService['requests']>((projectId, range, screenPath) =>
      new MockRequestsService().requests(projectId, range, screenPath),
    );
    state.requests = requests;

    render(await renderRequests({ range: '30d', show: 'failing', screen: '/orders' }));

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

  it('says what is missing for each filter', async () => {
    state.requests = (): Promise<RequestsReport> => Promise.resolve({ routes: [] });

    const { unmount } = render(await renderRequests());
    expect(
      screen.getByText('No writes in this period. Calls sent with trackRequest() show up here.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Slowest route' })).toHaveTextContent('—');
    unmount();

    const failing = render(await renderRequests({ show: 'failing' }));
    expect(screen.getByText('No route failed in this period.')).toBeInTheDocument();
    failing.unmount();

    render(await renderRequests({ screen: '/settings' }));
    expect(screen.getByText('No writes from /settings in this period.')).toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.requests = () => Promise.reject(new UnauthenticatedError());

    await expect(renderRequests()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
