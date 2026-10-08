import {
  FAILED_READS,
  type RequestKind,
  type RequestsReport,
  type RequestsWire,
} from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { DateRange } from '../date-range';
import type { DemoFailedRead, DemoProject, DemoRoute } from '../demo/demo-catalog';
import {
  type DemoFailure,
  demoFailedReadsOn,
  demoFailures,
  demoSuccessfulWritesOn,
} from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { apportion, demoDays } from '../demo/demo-series';

export const RECENT_FAILURES_PER_ROUTE = 5;
const P95_TO_MEDIAN_DURATION = 2.6;
const NO_RESPONSE_STATUS = 0;
const FIRST_CLIENT_ERROR_STATUS = 400;
const FIRST_SERVER_ERROR_STATUS = 500;

type DayWire = NonNullable<RequestsWire['days']>[number];
type StatusClass = keyof DayWire['by_status_class'];

const NO_REQUESTS: DayWire['by_status_class'] = {
  success: 0,
  client_error: 0,
  server_error: 0,
  no_response: 0,
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

function p95Of(medianDurationMs: number): number {
  return Math.round(medianDurationMs * P95_TO_MEDIAN_DURATION);
}

function onScreen(
  count: number,
  screens: readonly (readonly [path: string, share: number])[],
  screen: string | null,
): number {
  if (screen === null) {
    return count;
  }
  return apportion(count, screens, ([, share]) => share)
    .filter(({ item: [path] }) => path === screen)
    .reduce((sum, { count: onPath }) => sum + onPath, 0);
}

function successfulWritesOn(
  project: DemoProject,
  route: DemoRoute,
  date: string,
  screen: string | null,
): number {
  return onScreen(demoSuccessfulWritesOn(project, route, date), route.screens, screen);
}

function successfulWrites(
  project: DemoProject,
  route: DemoRoute,
  range: DateRange,
  screen: string | null,
): number {
  return demoDays(range).reduce(
    (sum, date) => sum + successfulWritesOn(project, route, date, screen),
    0,
  );
}

function addByClass(
  counts: DayWire['by_status_class'],
  status: number,
  count: number,
): DayWire['by_status_class'] {
  const statusClass = statusClassOf(status);
  return { ...counts, [statusClass]: counts[statusClass] + count };
}

function writeDays(
  project: DemoProject,
  range: DateRange,
  screen: string | null,
  failures: readonly DemoFailure[],
): DayWire[] {
  return demoDays(range).map((date) => ({
    date,
    by_status_class: failures
      .filter((failure) => failure.date === date)
      .reduce((counts, failure) => addByClass(counts, failure.status, failure.count), {
        ...NO_REQUESTS,
        success: project.routes.reduce(
          (sum, route) => sum + successfulWritesOn(project, route, date, screen),
          0,
        ),
      }),
  }));
}

function countsBy<Key extends string | number>(
  failures: readonly DemoFailure[],
  keyOf: (failure: DemoFailure) => Key,
): ReadonlyMap<Key, number> {
  return failures.reduce(
    (counts, failure) =>
      new Map(counts).set(keyOf(failure), (counts.get(keyOf(failure)) ?? 0) + failure.count),
    new Map<Key, number>(),
  );
}

function routeWire(route: DemoRoute, successes: number, failures: readonly DemoFailure[]) {
  const failed = failures.reduce((sum, failure) => sum + failure.count, 0);
  return {
    method: route.method,
    route: route.route,
    total: successes + failed,
    failed,
    statuses: [
      { status: route.successStatus, count: successes },
      ...[...countsBy(failures, (failure) => failure.status)]
        .map(([status, count]) => ({ status, count }))
        .toSorted((first, second) => first.status - second.status),
    ],
    median_duration_ms: route.medianDurationMs,
    p95_duration_ms: p95Of(route.medianDurationMs),
    screens: [...countsBy(failures, (failure) => failure.path)]
      .map(([path, count]) => ({ path, failed: count }))
      .toSorted((first, second) => second.failed - first.failed),
    recent_failures: failures
      .flatMap((failure) => (failure.request === null ? [] : [failure.request]))
      .toSorted((newer, older) => older.occurredAt.localeCompare(newer.occurredAt))
      .slice(0, RECENT_FAILURES_PER_ROUTE)
      .map((failure) => ({
        occurred_at: failure.occurredAt,
        status: failure.status,
        error_code: failure.errorCode,
        session_id: failure.sessionId,
      })),
  };
}

export function demoRequestsWire(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
): RequestsWire {
  const project = demoProjectOf(projectId);
  const failures = demoFailures(project, range, now).filter(
    (failure) => screen === null || failure.path === screen,
  );
  return {
    kind: 'writes',
    routes: project.routes
      .map((route) =>
        routeWire(
          route,
          successfulWrites(project, route, range, screen),
          failures.filter(
            (failure) => failure.method === route.method && failure.route === route.route,
          ),
        ),
      )
      .filter((route) => route.total > 0)
      .toSorted((first, second) => second.failed - first.failed || second.total - first.total),
    days: writeDays(project, range, screen, failures),
    route_days: null,
  };
}

function failedReadsOn(
  project: DemoProject,
  read: DemoFailedRead,
  date: string,
  screen: string | null,
): number {
  return onScreen(demoFailedReadsOn(project, read, date), read.screens, screen);
}

function readDays(project: DemoProject, range: DateRange, screen: string | null): DayWire[] {
  return demoDays(range).map((date) => ({
    date,
    by_status_class: project.failedReads.reduce(
      (counts, read) =>
        apportion(
          failedReadsOn(project, read, date, screen),
          read.statuses,
          ([, share]) => share,
        ).reduce((sum, { item: [status], count }) => addByClass(sum, status, count), counts),
      NO_REQUESTS,
    ),
  }));
}

function failedReadWire(
  project: DemoProject,
  read: DemoFailedRead,
  range: DateRange,
  screen: string | null,
) {
  const failures = demoDays(range).reduce(
    (sum, date) => sum + demoFailedReadsOn(project, read, date),
    0,
  );
  const screens = apportion(failures, read.screens, ([, share]) => share)
    .map(({ item: [path], count }) => ({ path, failed: count }))
    .filter((entry) => entry.failed > 0 && (screen === null || entry.path === screen))
    .toSorted((first, second) => second.failed - first.failed);
  const failed = screens.reduce((sum, entry) => sum + entry.failed, 0);
  return {
    method: 'GET',
    route: read.route,
    total: failed,
    failed,
    statuses: apportion(failed, read.statuses, ([, share]) => share)
      .map(({ item: [status], count }) => ({ status, count }))
      .filter((entry) => entry.count > 0)
      .toSorted((first, second) => first.status - second.status),
    median_duration_ms: read.medianDurationMs,
    p95_duration_ms: p95Of(read.medianDurationMs),
    screens,
    recent_failures: [],
  };
}

export function demoFailedReadsWire(
  projectId: string,
  range: DateRange,
  screen: string | null,
): RequestsWire {
  const project = demoProjectOf(projectId);
  return {
    kind: 'reads',
    routes: project.failedReads
      .map((read) => failedReadWire(project, read, range, screen))
      .filter((route) => route.failed > 0)
      .toSorted((first, second) => second.failed - first.failed),
    days: readDays(project, range, screen),
    route_days: null,
  };
}

type RouteDayWire = NonNullable<RequestsWire['route_days']>[number];

function quietDay(date: string): RouteDayWire {
  return { date, total: 0, failed: 0, median_duration_ms: null, p95_duration_ms: null };
}

function routeDayWire(
  date: string,
  total: number,
  failed: number,
  medianDurationMs: number,
): RouteDayWire {
  return total === 0
    ? quietDay(date)
    : {
        date,
        total,
        failed,
        median_duration_ms: medianDurationMs,
        p95_duration_ms: p95Of(medianDurationMs),
      };
}

function routeKey(method: string, route: string): string {
  return `${method} ${route}`;
}

function writeRouteDays(
  project: DemoProject,
  range: DateRange,
  screen: string | null,
  key: string,
  now: Date,
): RouteDayWire[] {
  const route = project.routes.find(
    (candidate) => routeKey(candidate.method, candidate.route) === key,
  );
  if (route === undefined) {
    return demoDays(range).map(quietDay);
  }
  const failures = demoFailures(project, range, now).filter(
    (failure) =>
      routeKey(failure.method, failure.route) === key &&
      (screen === null || failure.path === screen),
  );
  return demoDays(range).map((date) => {
    const failed = failures
      .filter((failure) => failure.date === date)
      .reduce((sum, failure) => sum + failure.count, 0);
    return routeDayWire(
      date,
      successfulWritesOn(project, route, date, screen) + failed,
      failed,
      route.medianDurationMs,
    );
  });
}

function readRouteDays(
  project: DemoProject,
  range: DateRange,
  screen: string | null,
  key: string,
): RouteDayWire[] {
  const read = project.failedReads.find((candidate) => routeKey('GET', candidate.route) === key);
  if (read === undefined) {
    return demoDays(range).map(quietDay);
  }
  return demoDays(range).map((date) => {
    const failed = failedReadsOn(project, read, date, screen);
    return routeDayWire(date, failed, failed, read.medianDurationMs);
  });
}

export function demoRouteRequestsWire(
  projectId: string,
  range: DateRange,
  kind: RequestKind,
  screen: string | null,
  route: string,
  now: Date,
): RequestsWire {
  const project = demoProjectOf(projectId);
  return kind === FAILED_READS
    ? {
        ...demoFailedReadsWire(projectId, range, screen),
        route_days: readRouteDays(project, range, screen, route),
      }
    : {
        ...demoRequestsWire(projectId, range, screen, now),
        route_days: writeRouteDays(project, range, screen, route, now),
      };
}

export function demoFailedReadsReport(
  projectId: string,
  range: DateRange,
  screen: string | null,
): RequestsReport {
  return requestsResponseSchema.parse(demoFailedReadsWire(projectId, range, screen));
}

export function demoRequestsReport(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
): RequestsReport {
  return requestsResponseSchema.parse(demoRequestsWire(projectId, range, screen, now));
}
