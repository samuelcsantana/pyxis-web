import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { ArrivalsReport } from '@/domain/arrivals';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { arrivalsHref } from '@/lib/arrivals-href';
import type { IArrivalsService } from '@/services/arrivals/arrivals-service.interface';
import { GET } from './route';

const state = vi.hoisted<{ arrivals: IArrivalsService['arrivals'] }>(() => ({
  arrivals: () => Promise.reject(new Error('arrivals not set')),
}));

vi.mock('next/headers', () => ({
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

vi.mock('@/services/arrivals/arrivals-service.factory', () => ({
  createArrivalsService: (): IArrivalsService => ({
    arrivals: (projectId, range, since) => state.arrivals(projectId, range, since),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@example.com',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(ADMIN) }),
}));

const REPORT: ArrivalsReport = {
  asOf: Date.parse('2026-10-06T15:00:00Z'),
  activeVisits: 3,
  visits: { times: [Date.parse('2026-10-06T14:59:00Z')], more: false },
  conversions: null,
  namedEvents: { times: [], more: false },
  failedRequests: { times: [], more: false },
};
const SINCE = '2026-10-06T14:00:00.000Z';

function ask(query: string, projectId = 'p-store') {
  return GET(
    new NextRequest(
      `https://pyxis.example.com${arrivalsHref(projectId, new URLSearchParams(query))}`,
    ),
    { params: Promise.resolve({ projectId }) },
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/arrivals', () => {
  it('answers what arrived in the period since the moment, never cached', async () => {
    const arrivals = vi.fn<IArrivalsService['arrivals']>(() => Promise.resolve(REPORT));
    state.arrivals = arrivals;

    const response = await ask(`range=7d&since=${SINCE}`);

    expect(arrivals).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-30', to: '2026-10-06' },
      new Date(SINCE),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(await response.json()).toEqual(REPORT);
  });

  it('accepts a moment written with an offset', async () => {
    const arrivals = vi.fn<IArrivalsService['arrivals']>(() => Promise.resolve(REPORT));
    state.arrivals = arrivals;

    await ask('since=2026-10-06T11:00:00-03:00');

    expect(arrivals.mock.calls[0]?.[2]).toEqual(new Date(SINCE));
  });

  it.each(['', 'since=yesterday', 'since=2026-10-06'])(
    'refuses a missing or malformed moment (%s)',
    async (query) => {
      const response = await ask(query);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'invalid_since' });
    },
  );

  it.each([
    [new UnauthenticatedError(), 401, 'unauthenticated'],
    [new ApiNotFoundError('/v1/projects/p-store/arrivals'), 404, 'not_found'],
    [new ApiRequestError('/v1/projects/p-store/arrivals', 429), 429, 'rate_limited'],
  ])('answers %s as JSON with its status, never a redirect', async (error, status, code) => {
    state.arrivals = () => Promise.reject(error);

    const response = await ask(`since=${SINCE}`);

    expect(response.status).toBe(status);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(await response.json()).toEqual({ error: code });
  });

  it('lets any other failure through', async () => {
    state.arrivals = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/arrivals', 500));

    await expect(ask(`since=${SINCE}`)).rejects.toThrow('answered 500');
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(ask(`since=${SINCE}`, 'p-other')).rejects.toThrow('not-found');
  });
});
