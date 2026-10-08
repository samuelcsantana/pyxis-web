import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestsReport } from '@/domain/requests';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoTimelineReport } from '../timeline/demo-timeline';
import { demoFailedReadsWire, demoRequestsWire, statusClassOf } from './demo-requests';
import { HttpRequestsService } from './http-requests-service';
import { MockRequestsService } from './mock-requests-service';
import { createRequestsService } from './requests-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };
const NOW = new Date('2026-10-06T02:30:00.000Z');
const STORE = DEMO_STORE.id;

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
    const fetchMock = answering(demoRequestsWire(STORE, RANGE, null, NOW));

    const report = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).requests('p 1', RANGE, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/requests?from=2026-09-22&to=2026-10-05`,
    );
    expect(report.routes[0]?.route).toBe('/orders');
  });

  it('adds the screen filter when there is one', async () => {
    const fetchMock = answering(demoRequestsWire(STORE, RANGE, '/sign-up', NOW));

    await new HttpRequestsService(new ApiReader(API, () => Promise.resolve('token'))).requests(
      'p1',
      RANGE,
      '/sign-up',
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p1/requests?from=2026-09-22&to=2026-10-05&screen=%2Fsign-up`,
    );
  });

  it('asks the failed reads with kind=reads, and the writes without a kind', async () => {
    const fetchMock = answering(demoFailedReadsWire(STORE, RANGE, '/products'));

    const report = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).failedReads('p1', RANGE, '/products');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p1/requests?from=2026-09-22&to=2026-10-05&screen=%2Fproducts&kind=reads`,
    );
    expect(report.routes.map((route) => `${route.method} ${route.route}`)).toEqual([
      'GET /products',
    ]);
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

    expect(report.routes).toHaveLength(8);
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

    expect(failures).toHaveLength(9);
    for (const failure of failures) {
      const { visits } = demoTimelineReport(STORE, { kind: 'visit', id: failure.sessionId }, NOW);
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

    expect(failuresOf(store, '/orders')).toEqual(['409 2026-10-05T21:41:05.000Z']);
    expect(failuresOf(store, '/payouts')).toEqual([]);
    expect(failuresOf(unknown, '/orders')).toEqual(['409 2026-10-05T21:41:05.000Z']);
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

    expect(report.routes.map((route) => route.route)).toEqual([
      '/auth/sign-up',
      '/auth/verify-code',
    ]);
  });

  it('splits the writes of a route over the screens it is called from', async () => {
    const service = new MockRequestsService();
    const ordersOf = async (screen: string | null) =>
      (await service.requests(STORE, RANGE, screen)).routes.find(
        (route) => route.method === 'POST' && route.route === '/orders',
      );

    const all = await ordersOf(null);
    const list = await ordersOf('/orders');
    const form = await ordersOf('/orders/new');

    expect((list?.total ?? 0) + (form?.total ?? 0)).toBe(all?.total);
    expect((list?.failed ?? 0) + (form?.failed ?? 0)).toBe(all?.failed);
    expect(form?.screens).toEqual([{ path: '/orders/new', failed: form?.failed }]);
  });

  it('counts the failures of older days, which have no demo visit to open', async () => {
    const report = await new MockRequestsService().requests(
      STORE,
      { from: '2026-09-01', to: '2026-09-20' },
      null,
    );

    expect(report.routes.reduce((sum, route) => sum + route.failed, 0)).toBeGreaterThan(0);
    expect(report.routes.flatMap((route) => route.recentFailures)).toEqual([]);
    for (const route of report.routes) {
      expect(route.screens.reduce((sum, screen) => sum + screen.failed, 0)).toBe(route.failed);
    }
  });

  it('lists the failed reads, the most failing first, every read a failure', async () => {
    const report = await new MockRequestsService().failedReads(STORE, RANGE, null);

    expect(report.routes.map((route) => `${route.method} ${route.route}`)).toEqual([
      'GET /orders/:id',
      'GET /products',
    ]);
    for (const route of report.routes) {
      expect(route.failed).toBe(route.total);
      expect(route.statuses.reduce((sum, entry) => sum + entry.count, 0)).toBe(route.failed);
      expect(route.statuses.every((entry) => entry.status === 0 || entry.status >= 400)).toBe(true);
      expect(route.screens.reduce((sum, screen) => sum + screen.failed, 0)).toBe(route.failed);
      expect(route.recentFailures).toEqual([]);
    }
  });

  it('splits the failed reads of a route over its screens, and drops a route left empty', async () => {
    const service = new MockRequestsService();
    const productsOf = async (screen: string | null) =>
      (await service.failedReads(STORE, RANGE, screen)).routes.find(
        (route) => route.route === '/products',
      );

    const all = await productsOf(null);
    const list = await productsOf('/products');
    const form = await productsOf('/orders/new');
    const elsewhere = await service.failedReads(STORE, RANGE, '/settings');

    expect((list?.failed ?? 0) + (form?.failed ?? 0)).toBe(all?.failed);
    expect(form?.screens).toEqual([{ path: '/orders/new', failed: form?.failed }]);
    expect(elsewhere.routes).toEqual([]);
  });

  it('lists the routes of the project it is asked about', async () => {
    const report = await new MockRequestsService().requests(DEMO_DOCS.id, RANGE, null);

    expect(report.routes.map((route) => route.route).toSorted()).toEqual([
      '/feedback',
      '/newsletter',
    ]);
    const reads = await new MockRequestsService().failedReads(DEMO_DOCS.id, RANGE, null);
    expect(reads.routes.map((route) => route.route)).toEqual(['/search']);
  });
});

describe('the demo request health', () => {
  const sumOf = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0);

  it('counts every write of every day by status class, adding up to the routes', () => {
    const wire = demoRequestsWire(STORE, RANGE, null, NOW);
    const days = wire.days ?? [];
    const failed = sumOf(
      days.map(({ by_status_class: day }) => day.client_error + day.server_error + day.no_response),
    );

    expect(days.map((day) => day.date)).toHaveLength(14);
    expect(sumOf(days.map((day) => day.by_status_class.success)) + failed).toBe(
      sumOf(wire.routes.map((route) => route.total)),
    );
    expect(failed).toBe(sumOf(wire.routes.map((route) => route.failed)));
    expect(wire.route_days).toBeNull();
  });

  it('counts the failed reads of every day by status class, with no success', () => {
    const wire = demoFailedReadsWire(DEMO_STORE.id, RANGE, null);
    const days = wire.days ?? [];

    expect(days.every((day) => day.by_status_class.success === 0)).toBe(true);
    expect(
      sumOf(
        days.map(
          ({ by_status_class: day }) => day.client_error + day.server_error + day.no_response,
        ),
      ),
    ).toBeGreaterThan(0);
  });

  it('gives each route a p95 above its median', () => {
    const wire = demoRequestsWire(STORE, RANGE, null, NOW);

    expect(
      wire.routes.every((route) => (route.p95_duration_ms ?? 0) > route.median_duration_ms),
    ).toBe(true);
  });

  it('names the class of every status', () => {
    expect([201, 404, 503, 0].map(statusClassOf)).toEqual([
      'success',
      'client_error',
      'server_error',
      'no_response',
    ]);
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
