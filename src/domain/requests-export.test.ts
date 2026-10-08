import { describe, expect, it } from 'vitest';
import type { RouteReport } from './requests';
import { requestsCsvTable } from './requests-export';

const ROUTE: RouteReport = {
  method: 'POST',
  route: '/orders',
  total: 42,
  failed: 3,
  statuses: [
    { status: 201, count: 39 },
    { status: 409, count: 2 },
    { status: 0, count: 1 },
  ],
  medianDurationMs: 180,
  screens: [{ path: '/checkout', failed: 3 }],
  recentFailures: [],
};

describe('requestsCsvTable', () => {
  it('writes each written route with its requests, failures, median and statuses', () => {
    expect(requestsCsvTable([ROUTE], 'writes')).toEqual({
      columns: ['method', 'route', 'requests', 'failed', 'median_duration_ms', 'statuses'],
      rows: [['POST', '/orders', 42, 3, 180, '201 × 39; 409 × 2; No response × 1']],
    });
  });

  it('writes each read route with its failed reads only', () => {
    const read: RouteReport = {
      ...ROUTE,
      method: 'GET',
      route: '/orders/:id',
      total: 5,
      failed: 5,
      statuses: [{ status: 404, count: 5 }],
    };

    expect(requestsCsvTable([read], 'reads')).toEqual({
      columns: ['method', 'route', 'failed_reads', 'median_duration_ms', 'statuses'],
      rows: [['GET', '/orders/:id', 5, 180, '404 × 5']],
    });
  });
});
