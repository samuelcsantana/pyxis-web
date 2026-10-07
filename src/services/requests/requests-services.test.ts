import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestsReport } from '@/domain/requests';
import { ApiReader } from '../api-reader';
import { demoTimelineReport } from '../timeline/demo-timeline';
import { demoRequestsReport, demoRequestsWire } from './demo-requests';
import { HttpRequestsService } from './http-requests-service';
import { MockRequestsService } from './mock-requests-service';
import { createRequestsService } from './requests-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const STORE_TIME_ZONE = 'America/Sao_Paulo';
const STORE = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

function answering(body: unknown) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response(JSON.stringify(body))));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpRequestsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the routes for the range', async () => {
    const fetchMock = answering(demoRequestsWire(RANGE, null, NOW, STORE_TIME_ZONE));

    const report = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).requests('p 1', RANGE, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/requests?from=2026-09-22&to=2026-10-05`,
    );
    expect(report.routes[0]?.route).toBe('/orders');
  });

  it('adds the screen filter when there is one', async () => {
    const fetchMock = answering(demoRequestsWire(RANGE, '/sign-up', NOW, STORE_TIME_ZONE));

    await new HttpRequestsService(new ApiReader(API, () => Promise.resolve('token'))).requests(
      'p1',
      RANGE,
      '/sign-up',
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p1/requests?from=2026-09-22&to=2026-10-05&screen=%2Fsign-up`,
    );
  });
});

describe('MockRequestsService', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function failuresOf(report: RequestsReport, route: string) {
    return report.routes
      .find((candidate) => candidate.route === route)
      ?.recentFailures.map((failure) => `${String(failure.status)} ${failure.occurredAt}`);
  }

  it('lists the routes, the most failing first, each adding up', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);

    expect(report.routes).toHaveLength(6);
    expect(report.routes.map((route) => route.failed)).toEqual(
      report.routes.map((route) => route.failed).toSorted((left, right) => right - left),
    );
    for (const route of report.routes) {
      expect(route.statuses.reduce((sum, entry) => sum + entry.count, 0)).toBe(route.total);
    }
    const orders = report.routes.find((route) => route.route === '/orders');
    expect(orders?.statuses[0]?.status).toBe(201);
    expect(report.routes.find((route) => route.method === 'DELETE')?.statuses[0]?.status).toBe(204);
    expect(report.routes.find((route) => route.method === 'PATCH')?.statuses[0]?.status).toBe(200);
  });

  it('lists the latest failures of a route, newest first', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);

    expect(failuresOf(report, '/orders')).toEqual([
      '409 2026-10-05T21:41:05.000Z',
      '400 2026-10-04T11:02:01.000Z',
      '409 2026-10-03T15:59:52.000Z',
    ]);
    expect(failuresOf(report, '/payouts')).toEqual([
      '500 2026-10-02T12:00:00.000Z',
      '0 2026-10-02T11:44:56.000Z',
    ]);
    expect(failuresOf(report, '/users/me')).toEqual([]);
  });

  it('opens a demo visit from every latest failure, at the same time', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);
    const failures = report.routes.flatMap((route) =>
      route.recentFailures.map((failure) => ({ ...failure, route: route.route })),
    );

    expect(failures).toHaveLength(8);
    for (const failure of failures) {
      const { visits } = demoTimelineReport({ kind: 'visit', id: failure.sessionId }, NOW);
      const failedRequest = visits
        .flatMap((visit) => visit.events)
        .find((event) => event.name === 'api_request' && event.occurredAt === failure.occurredAt);
      expect(failedRequest?.properties).toMatchObject({
        route: failure.route,
        status: failure.status,
      });
    }
  });

  it('keeps only the failures of the period, by the day of the project', async () => {
    const lastDay = { from: '2026-10-05', to: '2026-10-05' };
    const store = await new MockRequestsService().requests(STORE, lastDay, null);
    const unknown = await new MockRequestsService().requests('unknown', lastDay, null);
    const tokyo = demoRequestsReport(lastDay, null, NOW, 'Asia/Tokyo');

    expect(failuresOf(store, '/orders')).toEqual(['409 2026-10-05T21:41:05.000Z']);
    expect(failuresOf(store, '/payouts')).toEqual([]);
    expect(failuresOf(unknown, '/orders')).toEqual(['409 2026-10-05T21:41:05.000Z']);
    expect(failuresOf(tokyo, '/orders')).toEqual([]);
  });

  it('leaves out the failures after the period', async () => {
    const report = await new MockRequestsService().requests(
      STORE,
      { from: '2026-09-22', to: '2026-10-02' },
      null,
    );

    expect(failuresOf(report, '/orders')).toEqual([]);
    expect(failuresOf(report, '/payouts')).toHaveLength(2);
  });

  it('keeps only the routes called from the filtered screen', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, '/sign-up');

    expect(report.routes.map((route) => route.route)).toEqual(['/auth/sign-up']);
  });
});

describe('createRequestsService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createRequestsService()).toBeInstanceOf(HttpRequestsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createRequestsService()).toBeInstanceOf(MockRequestsService);
  });
});
