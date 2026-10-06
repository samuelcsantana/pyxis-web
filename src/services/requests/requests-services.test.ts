import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { demoRequestsWire } from './demo-requests';
import { HttpRequestsService } from './http-requests-service';
import { MockRequestsService } from './mock-requests-service';
import { createRequestsService } from './requests-service.factory';

const API = 'https://api.pyxis.example.com';
const RANGE = { from: '2026-09-22', to: '2026-10-05' };

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
    const fetchMock = answering(demoRequestsWire(RANGE, null));

    const report = await new HttpRequestsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).requests('p 1', RANGE, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p%201/requests?from=2026-09-22&to=2026-10-05`,
    );
    expect(report.routes[0]?.route).toBe('/orders');
  });

  it('adds the screen filter when there is one', async () => {
    const fetchMock = answering(demoRequestsWire(RANGE, '/sign-up'));

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
  it('lists the routes, the most failing first, each adding up', async () => {
    const report = await new MockRequestsService().requests('demo', RANGE, null);

    expect(report.routes).toHaveLength(6);
    expect(report.routes.map((route) => route.failed)).toEqual(
      report.routes.map((route) => route.failed).toSorted((left, right) => right - left),
    );
    for (const route of report.routes) {
      expect(route.statuses.reduce((sum, entry) => sum + entry.count, 0)).toBe(route.total);
    }
    const orders = report.routes.find((route) => route.route === '/orders');
    expect(orders?.recentFailures[0]?.occurredAt).toBe('2026-10-05T18:41:00.000Z');
    expect(orders?.statuses[0]?.status).toBe(201);
    expect(report.routes.find((route) => route.method === 'DELETE')?.statuses[0]?.status).toBe(204);
    expect(report.routes.find((route) => route.method === 'PATCH')?.statuses[0]?.status).toBe(200);
  });

  it('keeps only the routes called from the filtered screen', async () => {
    const report = await new MockRequestsService().requests('demo', RANGE, '/sign-up');

    expect(report.routes.map((route) => route.route)).toEqual(['/auth/sign-up']);
  });

  it('drops the failures older than a one-day period', async () => {
    const report = await new MockRequestsService().requests(
      'demo',
      { from: '2026-10-05', to: '2026-10-05' },
      null,
    );

    expect(report.routes.find((route) => route.route === '/payouts')?.recentFailures).toEqual([]);
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
