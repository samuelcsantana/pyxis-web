import { addDays, daysBetween } from '@/domain/period';
import { type RequestsReport, requestsResponseSchema, type RequestsWire } from '@/domain/requests';
import type { DateRange } from '../date-range';
import { noise } from '../demo/demo-series';

interface DemoFailure {
  readonly daysBeforeEnd: number;
  readonly minuteOfDay: number;
  readonly status: number;
  readonly errorCode: string | null;
  readonly sessionId?: string;
}

interface DemoRoute {
  readonly method: string;
  readonly route: string;
  readonly perDay: number;
  readonly statuses: readonly (readonly [status: number, share: number])[];
  readonly medianDurationMs: number;
  readonly screens: readonly (readonly [path: string, share: number])[];
  readonly failures: readonly DemoFailure[];
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
    failures: [
      {
        daysBeforeEnd: 0,
        minuteOfDay: 1121,
        status: 409,
        errorCode: 'order_number_in_use',
        sessionId: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01',
      },
      { daysBeforeEnd: 1, minuteOfDay: 662, status: 400, errorCode: 'invalid_quantity' },
      { daysBeforeEnd: 2, minuteOfDay: 960, status: 409, errorCode: null },
    ],
  },
  {
    method: 'PATCH',
    route: '/orders/:id',
    perDay: 14,
    statuses: [[400, 0.005]],
    medianDurationMs: 141,
    screens: [['/orders/:id', 1]],
    failures: [{ daysBeforeEnd: 4, minuteOfDay: 620, status: 400, errorCode: 'invalid_status' }],
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
    failures: [
      { daysBeforeEnd: 0, minuteOfDay: 571, status: 429, errorCode: 'too_many_requests' },
      { daysBeforeEnd: 1, minuteOfDay: 1215, status: 400, errorCode: 'invalid_email' },
    ],
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
    failures: [
      { daysBeforeEnd: 3, minuteOfDay: 720, status: 500, errorCode: 'internal_error' },
      { daysBeforeEnd: 3, minuteOfDay: 705, status: 0, errorCode: null },
    ],
  },
  {
    method: 'PATCH',
    route: '/users/me',
    perDay: 3,
    statuses: [],
    medianDurationMs: 120,
    screens: [],
    failures: [],
  },
  {
    method: 'DELETE',
    route: '/orders/:id',
    perDay: 2,
    statuses: [],
    medianDurationMs: 97,
    screens: [],
    failures: [],
  },
];

const SUCCESS_STATUS: Readonly<Record<string, number>> = { POST: 201, DELETE: 204 };
const DEFAULT_SUCCESS_STATUS = 200;
const MINUTES_PER_HOUR = 60;

function demoSessionId(seed: string): string {
  const hex = Array.from({ length: 4 }, (_, index) =>
    Math.floor(noise(seed, index + 1) * 0xffffffff)
      .toString(16)
      .padStart(8, '0'),
  ).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function occurredAt(range: DateRange, failure: DemoFailure): string {
  const date = addDays(range.to, -failure.daysBeforeEnd);
  const hours = String(Math.floor(failure.minuteOfDay / MINUTES_PER_HOUR)).padStart(2, '0');
  const minutes = String(failure.minuteOfDay % MINUTES_PER_HOUR).padStart(2, '0');
  return `${date}T${hours}:${minutes}:00.000Z`;
}

function demoRoute(route: DemoRoute, range: DateRange, days: number) {
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
    recent_failures: route.failures
      .filter((failure) => failure.daysBeforeEnd < days)
      .map((failure) => ({
        occurred_at: occurredAt(range, failure),
        status: failure.status,
        error_code: failure.errorCode,
        session_id:
          failure.sessionId ?? demoSessionId(`${route.route}${String(failure.minuteOfDay)}`),
      })),
  };
}

export function demoRequestsWire(range: DateRange, screen: string | null): RequestsWire {
  const days = daysBetween(range.from, range.to);
  return {
    routes: DEMO_ROUTES.filter(
      (route) => screen === null || route.screens.some(([path]) => path === screen),
    )
      .map((route) => demoRoute(route, range, days))
      .toSorted((left, right) => right.failed - left.failed),
  };
}

export function demoRequestsReport(range: DateRange, screen: string | null): RequestsReport {
  return requestsResponseSchema.parse(demoRequestsWire(range, screen));
}
