import { type RequestKind, type RequestsReport, type RequestsWire } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord } from '../demo/demo-records';
import { itemAt } from '../demo/demo-random';
import {
  byKeys,
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  groupOf,
  isFailedRead,
  isFailedStatus,
  isWrite,
  roundedPercentile,
} from '../demo/demo-scope';
import { demoDays } from '../demo/demo-series';
import type { DemoRequest } from '../demo/demo-visits';

export const TOP_ROUTES = 50;
export const RECENT_FAILURES_PER_ROUTE = 5;
const NO_RESPONSE_STATUS = 0;
const FIRST_CLIENT_ERROR_STATUS = 400;
const FIRST_SERVER_ERROR_STATUS = 500;
const MEDIAN = 0.5;
const P95 = 0.95;
const KEY_SEPARATOR = ' ';

type DayWire = NonNullable<RequestsWire['days']>[number];
type StatusClass = keyof DayWire['by_status_class'];

export interface DemoRouteKey {
  readonly method: string;
  readonly route: string;
}

interface Call {
  readonly event: DemoEventRecord;
  readonly request: DemoRequest;
  readonly session: string;
}

const COUNTED: Readonly<Record<RequestKind, (event: DemoEventRecord) => boolean>> = {
  writes: isWrite,
  reads: isFailedRead,
};

export function statusClassOf(status: number): StatusClass {
  if (status === NO_RESPONSE_STATUS) {
    return 'no_response';
  }
  if (status >= FIRST_SERVER_ERROR_STATUS) {
    return 'server_error';
  }
  return status >= FIRST_CLIENT_ERROR_STATUS ? 'client_error' : 'success';
}

function callsOf(
  projectId: string,
  range: DateRange,
  kind: RequestKind,
  screen: string | null,
  now: Date,
): readonly Call[] {
  const counted = COUNTED[kind];
  return demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now)).flatMap((visit) =>
    visit.events.flatMap((event) =>
      event.request !== null && counted(event) && (screen === null || event.path === screen)
        ? [{ event, request: event.request, session: visit.sessionId }]
        : [],
    ),
  );
}

function routeKey({ request }: Call): string {
  return `${request.method}${KEY_SEPARATOR}${request.route}`;
}

function failed(call: Call): boolean {
  return isFailedStatus(call.request.status);
}

function durations(calls: readonly Call[]) {
  const values = calls.map((call) => call.request.durationMs);
  return {
    median: roundedPercentile(values, MEDIAN),
    p95: roundedPercentile(values, P95),
  };
}

function routeWire(calls: readonly Call[]) {
  const { request } = itemAt(calls, 0);
  const { median, p95 } = durations(calls);
  return {
    method: request.method,
    route: request.route,
    total: calls.length,
    failed: countWhere(calls, failed),
    statuses: [...groupedBy(calls, (call) => String(call.request.status))]
      .map(([, group]) => ({ status: itemAt(group, 0).request.status, count: group.length }))
      .toSorted(byKeys((status) => [status.status])),
    median_duration_ms: Number(median),
    p95_duration_ms: Number(p95),
    screens: [...groupedBy(calls, (call) => call.event.path)]
      .map(([path, group]) => ({ path, failed: countWhere(group, failed) }))
      .toSorted(byKeys((screen) => [-screen.failed, screen.path])),
    recent_failures: calls
      .filter(failed)
      .toSorted(byKeys((call) => [-call.event.at]))
      .slice(0, RECENT_FAILURES_PER_ROUTE)
      .map((call) => ({
        occurred_at: new Date(call.event.at).toISOString(),
        status: call.request.status,
        error_code: call.request.errorCode ?? null,
        session_id: call.session,
      })),
  };
}

function statusClasses(calls: readonly Call[]): DayWire['by_status_class'] {
  return {
    success: countWhere(calls, (call) => statusClassOf(call.request.status) === 'success'),
    client_error: countWhere(
      calls,
      (call) => statusClassOf(call.request.status) === 'client_error',
    ),
    server_error: countWhere(
      calls,
      (call) => statusClassOf(call.request.status) === 'server_error',
    ),
    no_response: countWhere(calls, (call) => statusClassOf(call.request.status) === 'no_response'),
  };
}

function routeDays(calls: readonly Call[], range: DateRange, route: DemoRouteKey) {
  const ofRoute = calls.filter(
    (call) => call.request.method === route.method && call.request.route === route.route,
  );
  const byDate = groupedBy(ofRoute, (call) => call.event.date);
  return demoDays(range).map((date) => {
    const day = groupOf(byDate, date);
    const { median, p95 } = durations(day);
    return {
      date,
      total: day.length,
      failed: countWhere(day, failed),
      median_duration_ms: median,
      p95_duration_ms: p95,
    };
  });
}

function requestsWire(
  calls: readonly Call[],
  kind: RequestKind,
  range: DateRange,
  route: DemoRouteKey | null,
): RequestsWire {
  const byDate = groupedBy(calls, (call) => call.event.date);
  return {
    kind,
    routes: [...groupedBy(calls, routeKey).values()]
      .map(routeWire)
      .toSorted(byKeys((wire) => [-wire.failed, -wire.total, wire.method, wire.route]))
      .slice(0, TOP_ROUTES),
    days: demoDays(range).map((date) => ({
      date,
      by_status_class: statusClasses(groupOf(byDate, date)),
    })),
    route_days: route === null ? null : routeDays(calls, range, route),
  };
}

export function demoRequestsWire(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
  route: DemoRouteKey | null,
): RequestsWire {
  return requestsWire(callsOf(projectId, range, 'writes', screen, now), 'writes', range, route);
}

export function demoFailedReadsWire(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
  route: DemoRouteKey | null,
): RequestsWire {
  return requestsWire(callsOf(projectId, range, 'reads', screen, now), 'reads', range, route);
}

function routeKeyOf(route: string): DemoRouteKey {
  const separator = route.indexOf(KEY_SEPARATOR);
  return { method: route.slice(0, separator), route: route.slice(separator + 1) };
}

export function demoRouteRequestsWire(
  projectId: string,
  range: DateRange,
  kind: RequestKind,
  screen: string | null,
  route: string,
  now: Date,
): RequestsWire {
  return requestsWire(callsOf(projectId, range, kind, screen, now), kind, range, routeKeyOf(route));
}

export function demoRequestsReport(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
  route: DemoRouteKey | null,
): RequestsReport {
  return requestsResponseSchema.parse(demoRequestsWire(projectId, range, screen, now, route));
}

export function demoFailedReadsReport(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
  route: DemoRouteKey | null,
): RequestsReport {
  return requestsResponseSchema.parse(demoFailedReadsWire(projectId, range, screen, now, route));
}
