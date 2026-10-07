import { describe, expect, it } from 'vitest';
import {
  errorRateFigure,
  failingOnlyOf,
  failureCounts,
  formatDuration,
  type RequestsWire,
  type RouteReport,
  routeRows,
  screenFilterOf,
  slowestRouteFigure,
  statusLabel,
  statusTone,
  visibleRoutes,
  writesFigure,
} from './requests';
import { requestsResponseSchema } from './requests.schema';

const WIRE: RequestsWire = {
  routes: [
    {
      method: 'POST',
      route: '/orders',
      total: 1284,
      failed: 24,
      statuses: [
        { status: 201, count: 1260 },
        { status: 409, count: 16 },
        { status: 500, count: 6 },
        { status: 0, count: 2 },
      ],
      median_duration_ms: 164,
      screens: [{ path: '/orders/new', failed: 21 }],
      recent_failures: [
        {
          occurred_at: '2026-10-05T21:41:00.000Z',
          status: 409,
          error_code: 'order_number_in_use',
          session_id: '3c07a1b2-0000-4000-8000-000000000001',
        },
      ],
    },
    {
      method: 'PATCH',
      route: '/users/me',
      total: 88,
      failed: 0,
      statuses: [{ status: 200, count: 88 }],
      median_duration_ms: 120,
      screens: [],
      recent_failures: [],
    },
  ],
};

const ROUTES = requestsResponseSchema.parse(WIRE).routes;
const [ORDERS, ME] = ROUTES as [RouteReport, RouteReport];

describe('requestsResponseSchema', () => {
  it('maps the wire names to the dashboard ones', () => {
    expect(ORDERS.medianDurationMs).toBe(164);
    expect(ORDERS.recentFailures[0]?.errorCode).toBe('order_number_in_use');
    expect(ME.screens).toEqual([]);
  });

  it('reads a report that names its kind as well as one from an API that does not', () => {
    expect(requestsResponseSchema.parse({ ...WIRE, kind: 'reads' }).routes).toEqual(ROUTES);
    expect(() => requestsResponseSchema.parse({ ...WIRE, kind: 'pages' })).toThrow();
  });
});

describe('URL filters', () => {
  it('read "failing only" from show=failing and nothing else', () => {
    expect(failingOnlyOf({ show: 'failing' })).toBe(true);
    expect(failingOnlyOf({ show: 'all' })).toBe(false);
    expect(failingOnlyOf({})).toBe(false);
  });

  it('accept a screen filter that is a path the API would accept', () => {
    expect(screenFilterOf({ screen: '/orders/:id' })).toBe('/orders/:id');
    expect(screenFilterOf({ screen: 'orders' })).toBeNull();
    expect(screenFilterOf({ screen: `/${'x'.repeat(256)}` })).toBeNull();
    expect(screenFilterOf({ screen: ['/a', '/b'] })).toBeNull();
    expect(screenFilterOf({})).toBeNull();
  });
});

describe('statuses', () => {
  it('tone a status as success, client error or server error, no response with the servers', () => {
    expect(statusTone(201)).toBe('success');
    expect(statusTone(302)).toBe('success');
    expect(statusTone(409)).toBe('client');
    expect(statusTone(503)).toBe('server');
    expect(statusTone(0)).toBe('server');
    expect(statusLabel(0)).toBe('No response');
    expect(statusLabel(409)).toBe('409');
  });

  it('count every failure by kind', () => {
    expect(failureCounts(ROUTES)).toEqual({
      total: 1372,
      failed: 24,
      client: 16,
      server: 6,
      noResponse: 2,
    });
  });
});

describe('figures', () => {
  it('count the writes', () => {
    expect(writesFigure(ROUTES)).toEqual({
      value: '1,372',
      note: 'POST, PUT, PATCH and DELETE calls from the browser',
    });
  });

  it('break the error rate down by kind of failure', () => {
    expect(errorRateFigure(ROUTES)).toEqual({
      value: '1.7%',
      note: '24 failed: 16 client errors (4xx), 6 server errors (5xx), 2 with no response',
    });
  });

  it('name only the kinds of failure that happened, in the singular when there is one', () => {
    const route = { ...ORDERS, failed: 1, statuses: [{ status: 400, count: 1 }] };

    expect(errorRateFigure([route]).note).toBe('1 failed: 1 client error (4xx)');
    expect(errorRateFigure([{ ...route, statuses: [{ status: 502, count: 1 }] }]).note).toBe(
      '1 failed: 1 server error (5xx)',
    );
  });

  it('says there were no failures, and shows a dash without writes', () => {
    expect(errorRateFigure([ME])).toEqual({ value: '0%', note: 'No failures in 88 writes' });
    expect(errorRateFigure([]).value).toBe('—');
  });

  it('names the route with the slowest median', () => {
    expect(slowestRouteFigure(ROUTES)).toEqual({
      value: '164 ms',
      note: 'median of POST /orders',
    });
    expect(slowestRouteFigure([ME, ORDERS]).note).toBe('median of POST /orders');
    expect(slowestRouteFigure([])).toEqual({ value: '—', note: 'No writes in this period' });
  });

  it('formats a duration in milliseconds', () => {
    expect(formatDuration(1234)).toBe('1,234 ms');
  });
});

describe('routeRows', () => {
  it('gives each route its shares, status chips, screens and recent failures', () => {
    const [orders, me] = routeRows(ROUTES, 'America/Sao_Paulo');

    expect(orders).toEqual({
      key: 'POST /orders',
      method: 'POST',
      route: '/orders',
      total: '1,284',
      successShare: '98.1%',
      errorShare: '1.9%',
      successWidth: '98.1%',
      hasFailures: true,
      statuses: [
        { label: '201 × 1,260', tone: 'success' },
        { label: '409 × 16', tone: 'client' },
        { label: '500 × 6', tone: 'server' },
        { label: 'No response × 2', tone: 'server' },
      ],
      median: '164 ms',
      summary: '1,284 requests · 1.9% errors · median 164 ms',
      screens: [{ path: '/orders/new', failed: '21 failed' }],
      failures: [
        {
          key: '2026-10-05T21:41:00.000Z-0',
          when: 'Oct 5, 18:41',
          status: '409',
          tone: 'client',
          errorCode: 'order_number_in_use',
          visit: '3c07a1b2',
          sessionId: '3c07a1b2-0000-4000-8000-000000000001',
        },
      ],
    });
    expect(me?.hasFailures).toBe(false);
    expect(me?.errorShare).toBe('0%');
  });

  it('keeps every route, or only the failing ones', () => {
    expect(visibleRoutes(ROUTES, false)).toHaveLength(2);
    expect(visibleRoutes(ROUTES, true)).toEqual([ORDERS]);
  });
});
