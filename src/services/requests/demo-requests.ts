import { daysBetween, todayIn } from '@/domain/period';
import { type RequestsReport, requestsResponseSchema, type RequestsWire } from '@/domain/requests';
import type { DateRange } from '../date-range';
import { type DemoFailedRequest, demoFailedRequests } from '../demo/demo-visits';

interface DemoRoute {
  readonly method: string;
  readonly route: string;
  readonly perDay: number;
  readonly statuses: readonly (readonly [status: number, share: number])[];
  readonly medianDurationMs: number;
  readonly screens: readonly (readonly [path: string, share: number])[];
}

const DEMO_ROUTES: readonly DemoRoute[] = [
  {
    method: 'POST',
    route: '/orders',
    perDay: 43,
    statuses: [
      [409, 0.0125],
      [400, 0.0062],
    ],
    medianDurationMs: 164,
    screens: [
      ['/orders', 0.875],
      ['/orders/new', 0.125],
    ],
  },
  {
    method: 'PATCH',
    route: '/orders/:id',
    perDay: 14,
    statuses: [[400, 0.005]],
    medianDurationMs: 141,
    screens: [['/orders/:id', 1]],
  },
  {
    method: 'POST',
    route: '/auth/sign-up',
    perDay: 9,
    statuses: [
      [400, 0.041],
      [429, 0.019],
    ],
    medianDurationMs: 233,
    screens: [['/sign-up', 1]],
  },
  {
    method: 'POST',
    route: '/payouts',
    perDay: 2,
    statuses: [
      [422, 0.1],
      [500, 0.025],
      [0, 0.025],
    ],
    medianDurationMs: 412,
    screens: [['/payouts', 1]],
  },
  {
    method: 'PATCH',
    route: '/users/me',
    perDay: 3,
    statuses: [],
    medianDurationMs: 120,
    screens: [],
  },
  {
    method: 'DELETE',
    route: '/orders/:id',
    perDay: 2,
    statuses: [],
    medianDurationMs: 97,
    screens: [],
  },
];

const SUCCESS_STATUS: Readonly<Record<string, number>> = { POST: 201, DELETE: 204 };
const DEFAULT_SUCCESS_STATUS = 200;

function withinRange(failure: DemoFailedRequest, range: DateRange, timeZone: string): boolean {
  const day = todayIn(timeZone, new Date(failure.occurredAt));
  return range.from <= day && day <= range.to;
}

function demoRoute(route: DemoRoute, days: number, failures: readonly DemoFailedRequest[]) {
  const total = route.perDay * days;
  const failing = route.statuses.map(([status, share]) => ({
    status,
    count: Math.max(1, Math.round(total * share)),
  }));
  const failed = failing.reduce((sum, entry) => sum + entry.count, 0);
  const success = SUCCESS_STATUS[route.method] ?? DEFAULT_SUCCESS_STATUS;
  return {
    method: route.method,
    route: route.route,
    total,
    failed,
    statuses: [{ status: success, count: total - failed }, ...failing],
    median_duration_ms: route.medianDurationMs,
    screens: route.screens.map(([path, share]) => ({
      path,
      failed: Math.max(1, Math.round(failed * share)),
    })),
    recent_failures: failures
      .filter((failure) => failure.method === route.method && failure.route === route.route)
      .toSorted((newer, older) => older.occurredAt.localeCompare(newer.occurredAt))
      .map((failure) => ({
        occurred_at: failure.occurredAt,
        status: failure.status,
        error_code: failure.errorCode,
        session_id: failure.sessionId,
      })),
  };
}

export function demoRequestsWire(
  range: DateRange,
  screen: string | null,
  now: Date,
  timeZone: string,
): RequestsWire {
  const days = daysBetween(range.from, range.to);
  const failures = demoFailedRequests(now).filter((failure) =>
    withinRange(failure, range, timeZone),
  );
  return {
    routes: DEMO_ROUTES.filter(
      (route) => screen === null || route.screens.some(([path]) => path === screen),
    )
      .map((route) => demoRoute(route, days, failures))
      .toSorted((left, right) => right.failed - left.failed),
  };
}

export function demoRequestsReport(
  range: DateRange,
  screen: string | null,
  now: Date,
  timeZone: string,
): RequestsReport {
  return requestsResponseSchema.parse(demoRequestsWire(range, screen, now, timeZone));
}
