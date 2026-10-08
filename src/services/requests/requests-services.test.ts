import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoTimelineReport } from '../timeline/demo-timeline';
import {
  demoFailedReadsWire,
  demoRequestsWire,
  demoRouteRequestsWire,
  statusClassOf,
} from './demo-requests';
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
    const fetchMock = answering(demoRequestsWire(STORE, RANGE, null, NOW, null));

    const report = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).requests('p 1', RANGE, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/requests?from=2026-09-22&to=2026-10-05`,
    );
    expect(report.routes[0]?.route).toBe(
      demoRequestsWire(STORE, RANGE, null, NOW, null).routes[0]?.route,
    );
  });

  it('adds the screen filter when there is one', async () => {
    const fetchMock = answering(demoRequestsWire(STORE, RANGE, '/sign-up', NOW, null));

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
    const fetchMock = answering(demoFailedReadsWire(STORE, RANGE, '/products', NOW, null));

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

  it('asks the days of one route with its kind and screen, and reads them', async () => {
    const fetchMock = answering(
      demoRouteRequestsWire(STORE, RANGE, 'reads', '/products', 'GET /products', NOW),
    );

    const days = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).routeDays('p1', RANGE, 'reads', '/products', 'GET /products');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p1/requests?from=2026-09-22&to=2026-10-05&screen=%2Fproducts&kind=reads&route=GET+%2Fproducts`,
    );
    expect(days).toHaveLength(14);
  });

  it('reads no days from an API that does not send them', async () => {
    answering(demoRequestsWire(STORE, RANGE, null, NOW, null));

    const days = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).routeDays('p1', RANGE, 'writes', null, 'POST /orders');

    expect(days).toBeNull();
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

  it('lists the routes, the most failing first, each adding up', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);

    expect(report.routes).toHaveLength(DEMO_STORE.routes.length);
    expect(report.routes.map((route) => route.failed)).toEqual(
      report.routes.map((route) => route.failed).toSorted((left, right) => right - left),
    );
    for (const route of report.routes) {
      expect(route.statuses.reduce((sum, entry) => sum + entry.count, 0)).toBe(route.total);
      expect(route.screens.reduce((sum, screen) => sum + screen.failed, 0)).toBe(route.failed);
    }
    const orders = report.routes.find((route) => route.route === '/orders');
    expect(orders?.statuses[0]?.status).toBe(201);
    expect(report.routes.find((route) => route.method === 'DELETE')?.statuses[0]?.status).toBe(204);
  });

  it('lists at most five latest failures of a route, newest first, inside the period', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);

    for (const route of report.routes) {
      const times = route.recentFailures.map((failure) => failure.occurredAt);
      expect(times.length).toBeLessThanOrEqual(Math.min(5, route.failed));
      expect(times).toEqual(times.toSorted().toReversed());
      expect(times.every((time) => time >= '2026-09-22' && time < '2026-10-06T03:00')).toBe(true);
    }
  });

  it('opens the demo visit of every latest failure, at the same time', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, null);
    const failures = report.routes.flatMap((route) =>
      route.recentFailures.map((failure) => ({ ...failure, route: route.route })),
    );

    expect(failures.length).toBeGreaterThan(0);
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

  it('keeps only the routes called from the filtered screen', async () => {
    const report = await new MockRequestsService().requests(STORE, RANGE, '/sign-up');

    expect(report.routes.map((route) => route.route).toSorted()).toEqual([
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

  it('lists the failed reads, every read a failure that opens its visit', async () => {
    const report = await new MockRequestsService().failedReads(STORE, RANGE, null);

    expect(report.routes.map((route) => `${route.method} ${route.route}`).toSorted()).toEqual([
      'GET /orders/:id',
      'GET /products',
    ]);
    for (const route of report.routes) {
      expect(route.failed).toBe(route.total);
      expect(route.statuses.reduce((sum, entry) => sum + entry.count, 0)).toBe(route.failed);
      expect(route.statuses.every((entry) => entry.status === 0 || entry.status >= 400)).toBe(true);
      expect(route.screens.reduce((sum, screen) => sum + screen.failed, 0)).toBe(route.failed);
      expect(route.recentFailures.length).toBeGreaterThan(0);
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

  const sumOf = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0);

  it.each([null, '/orders'])(
    'counts the writes of one route day by day, adding up to its row (screen %s)',
    async (screen) => {
      const report = await new MockRequestsService().requests(STORE, RANGE, screen);
      const orders = report.routes.find((route) => route.route === '/orders');
      const days = await new MockRequestsService().routeDays(
        STORE,
        RANGE,
        'writes',
        screen,
        'POST /orders',
      );

      expect(days).toHaveLength(14);
      expect(sumOf((days ?? []).map((day) => day.total))).toBe(orders?.total);
      expect(sumOf((days ?? []).map((day) => day.failed))).toBe(orders?.failed);
    },
  );

  it('gives a day with calls the durations of its route, and a quiet day none', async () => {
    const days = await new MockRequestsService().routeDays(
      STORE,
      RANGE,
      'writes',
      null,
      'POST /orders',
    );
    const busy = days?.find((day) => day.total > 0);

    expect(busy?.medianDurationMs).toBeGreaterThan(0);
    expect(busy?.p95DurationMs).toBeGreaterThan(busy?.medianDurationMs ?? 0);

    const quiet = await new MockRequestsService().routeDays(
      STORE,
      RANGE,
      'writes',
      '/settings',
      'POST /orders',
    );
    expect(quiet?.every((day) => day.total === 0 && day.medianDurationMs === null)).toBe(true);
  });

  it('counts the failed reads of one route day by day, every call a failure', async () => {
    const report = await new MockRequestsService().failedReads(STORE, RANGE, null);
    const products = report.routes.find((route) => route.route === '/products');
    const days = await new MockRequestsService().routeDays(
      STORE,
      RANGE,
      'reads',
      null,
      'GET /products',
    );

    expect(sumOf((days ?? []).map((day) => day.failed))).toBe(products?.failed);
    expect(days?.every((day) => day.total === day.failed)).toBe(true);
  });

  it.each([
    ['writes', 'DELETE /nowhere'],
    ['reads', 'GET /nowhere'],
  ] as const)('answers quiet days for a %s route the demo does not have', async (kind, route) => {
    const days = await new MockRequestsService().routeDays(STORE, RANGE, kind, null, route);

    expect(days).toHaveLength(14);
    expect(days?.every((day) => day.total === 0)).toBe(true);
  });
});

describe('the demo request health', () => {
  const sumOf = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0);

  it('counts every write of every day by status class, adding up to the routes', () => {
    const wire = demoRequestsWire(STORE, RANGE, null, NOW, null);
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
    const wire = demoFailedReadsWire(DEMO_STORE.id, RANGE, null, NOW, null);
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
    const wire = demoRequestsWire(STORE, RANGE, null, NOW, null);

    expect(
      wire.routes.every((route) => (route.p95_duration_ms ?? 0) > route.median_duration_ms),
    ).toBe(true);
  });

  it('times one route day by day when asked for it, empty days without durations', () => {
    const route = { method: 'POST', route: '/payouts' };
    const wire = demoRequestsWire(STORE, RANGE, null, NOW, route);
    const days = wire.route_days ?? [];
    const payouts = wire.routes.find((candidate) => candidate.route === '/payouts');

    expect(days).toHaveLength(14);
    expect(sumOf(days.map((day) => day.total))).toBe(payouts?.total);
    expect(sumOf(days.map((day) => day.failed))).toBe(payouts?.failed);
    for (const day of days) {
      expect(day.median_duration_ms === null).toBe(day.total === 0);
    }
    expect(demoFailedReadsWire(STORE, RANGE, null, NOW, route).route_days).toHaveLength(14);
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
