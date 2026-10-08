import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { MockRequestsService } from '@/services/requests/mock-requests-service';
import type { IRequestsService } from '@/services/requests/requests-service.interface';
import { loadRouteDays } from './actions';

const state = vi.hoisted<{ admin: unknown; routeDays: IRequestsService['routeDays'] }>(() => ({
  admin: undefined,
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
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/requests/requests-service.factory', () => ({
  createRequestsService: (): Pick<IRequestsService, 'routeDays'> => ({
    routeDays: (projectId, range, kind, screen, route) =>
      state.routeDays(projectId, range, kind, screen, route),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [{ id: 'demo', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
};
const WRITES = { from: '2026-09-29', to: '2026-10-05', kind: 'writes', screen: null };
const NOW = new Date('2026-10-06T02:30:00.000Z');

beforeEach(() => {
  state.admin = ADMIN;
  state.routeDays = (projectId, range, kind, screen, route) =>
    new MockRequestsService().routeDays(projectId, range, kind, screen, route);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

describe('loadRouteDays', () => {
  it('reads the days of one route in the scope of the screen and shapes them', async () => {
    const routeDays = vi.fn<IRequestsService['routeDays']>(
      (projectId, range, kind, screen, route) =>
        new MockRequestsService().routeDays(projectId, range, kind, screen, route),
    );
    state.routeDays = routeDays;

    const view = await loadRouteDays('demo', { ...WRITES, screen: '/orders' }, 'POST /orders');

    expect(routeDays).toHaveBeenCalledWith(
      'demo',
      { from: '2026-09-29', to: '2026-10-05' },
      'writes',
      '/orders',
      'POST /orders',
    );
    expect(view?.rows.length).toBeGreaterThan(0);
    expect(view?.rows[0]?.median).toMatch(/ ms$/);
  });

  it('reads the days of a failed read', async () => {
    const view = await loadRouteDays('demo', { ...WRITES, kind: 'reads' }, 'GET /products');

    expect(view?.rows.length).toBeGreaterThan(0);
    expect(view?.rows.every((row) => row.total === row.failed)).toBe(true);
  });

  it('answers nothing when the API does not know the days of a route', async () => {
    state.routeDays = () => Promise.resolve(null);
    expect(await loadRouteDays('demo', WRITES, 'POST /orders')).toBeNull();

    state.routeDays = () => Promise.reject(new ApiRequestError('/v1/projects/demo/requests', 400));
    expect(await loadRouteDays('demo', WRITES, 'POST /orders')).toBeNull();
  });

  it('lets another API failure through', async () => {
    state.routeDays = () => Promise.reject(new ApiRequestError('/v1/projects/demo/requests', 503));

    await expect(loadRouteDays('demo', WRITES, 'POST /orders')).rejects.toThrow(
      'The Pyxis API answered 503',
    );
  });

  it.each([
    ['a route without its method', WRITES, '/orders'],
    ['an unknown kind', { ...WRITES, kind: 'pages' }, 'POST /orders'],
    ['a screen that is not a path', { ...WRITES, screen: 'orders' }, 'POST /orders'],
    ['a date that is not one', { ...WRITES, from: 'yesterday' }, 'POST /orders'],
  ])('refuses %s', async (_label, scope, route) => {
    await expect(loadRouteDays('demo', scope, route)).rejects.toThrow(
      'The days of a route need a valid range, kind, screen and route.',
    );
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(loadRouteDays('p-other', WRITES, 'POST /orders')).rejects.toThrow('not-found');
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.routeDays = () => Promise.reject(new UnauthenticatedError());

    await expect(loadRouteDays('demo', WRITES, 'POST /orders')).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
