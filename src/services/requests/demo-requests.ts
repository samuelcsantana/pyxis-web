import { type RequestsReport, type RequestsWire } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { DateRange } from '../date-range';
import type { DemoProject, DemoRoute } from '../demo/demo-catalog';
import { type DemoFailure, demoFailures, demoSuccessfulWritesOn } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { apportion, demoDays } from '../demo/demo-series';

export const RECENT_FAILURES_PER_ROUTE = 5;

function successfulWrites(
  project: DemoProject,
  route: DemoRoute,
  range: DateRange,
  screen: string | null,
): number {
  const writes = demoDays(range).reduce(
    (sum, date) => sum + demoSuccessfulWritesOn(project, route, date),
    0,
  );
  if (screen === null) {
    return writes;
  }
  return apportion(writes, route.screens, ([, share]) => share)
    .filter(({ item: [path] }) => path === screen)
    .reduce((sum, { count }) => sum + count, 0);
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
  };
}

export function demoRequestsReport(
  projectId: string,
  range: DateRange,
  screen: string | null,
  now: Date,
): RequestsReport {
  return requestsResponseSchema.parse(demoRequestsWire(projectId, range, screen, now));
}
