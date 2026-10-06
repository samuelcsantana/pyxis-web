import { z } from 'zod';
import { barWidth, formatCount, formatPercent, formatQuantity, rate } from './metrics';

export const requestsResponseSchema = z
  .object({
    routes: z.array(
      z.object({
        method: z.string(),
        route: z.string(),
        total: z.number(),
        failed: z.number(),
        statuses: z.array(z.object({ status: z.number(), count: z.number() })),
        median_duration_ms: z.number(),
        screens: z.array(z.object({ path: z.string(), failed: z.number() })),
        recent_failures: z.array(
          z.object({
            occurred_at: z.string(),
            status: z.number(),
            error_code: z.string().nullable(),
            session_id: z.string(),
          }),
        ),
      }),
    ),
  })
  .transform((body) => ({
    routes: body.routes.map((route) => ({
      method: route.method,
      route: route.route,
      total: route.total,
      failed: route.failed,
      statuses: route.statuses,
      medianDurationMs: route.median_duration_ms,
      screens: route.screens,
      recentFailures: route.recent_failures.map((failure) => ({
        occurredAt: failure.occurred_at,
        status: failure.status,
        errorCode: failure.error_code,
        sessionId: failure.session_id,
      })),
    })),
  }));

export type RequestsReport = z.output<typeof requestsResponseSchema>;
export type RequestsWire = z.input<typeof requestsResponseSchema>;
export type RouteReport = RequestsReport['routes'][number];

export const MAX_SCREEN_LENGTH = 256;
export const FAILING_ONLY = 'failing';
const VISIT_ID_LENGTH = 8;

export interface RequestsSearch {
  readonly show?: string | string[];
  readonly screen?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function failingOnlyOf(search: RequestsSearch): boolean {
  return single(search.show) === FAILING_ONLY;
}

export function screenFilterOf(search: RequestsSearch): string | null {
  const screen = single(search.screen);
  if (screen === undefined || !screen.startsWith('/') || screen.length > MAX_SCREEN_LENGTH) {
    return null;
  }
  return screen;
}

export type StatusTone = 'success' | 'client' | 'server';

export function statusTone(status: number): StatusTone {
  if (status === 0 || status >= 500) {
    return 'server';
  }
  return status >= 400 ? 'client' : 'success';
}

export function statusLabel(status: number): string {
  return status === 0 ? 'No response' : String(status);
}

interface FailureCounts {
  readonly total: number;
  readonly failed: number;
  readonly client: number;
  readonly server: number;
  readonly noResponse: number;
}

export function failureCounts(routes: readonly RouteReport[]): FailureCounts {
  const statuses = routes.flatMap((route) => route.statuses);
  const countWhere = (accepts: (status: number) => boolean) =>
    statuses.filter((entry) => accepts(entry.status)).reduce((sum, entry) => sum + entry.count, 0);
  return {
    total: routes.reduce((sum, route) => sum + route.total, 0),
    failed: routes.reduce((sum, route) => sum + route.failed, 0),
    client: countWhere((status) => status >= 400 && status < 500),
    server: countWhere((status) => status >= 500),
    noResponse: countWhere((status) => status === 0),
  };
}

export interface Figure {
  readonly value: string;
  readonly note: string;
}

export function writesFigure(routes: readonly RouteReport[]): Figure {
  return {
    value: formatCount(failureCounts(routes).total),
    note: 'POST, PUT, PATCH and DELETE calls from the browser',
  };
}

export function errorRateFigure(routes: readonly RouteReport[]): Figure {
  const counts = failureCounts(routes);
  const parts = [
    counts.client === 0
      ? null
      : formatQuantity(counts.client, 'client error (4xx)', 'client errors (4xx)'),
    counts.server === 0
      ? null
      : formatQuantity(counts.server, 'server error (5xx)', 'server errors (5xx)'),
    counts.noResponse === 0 ? null : `${formatCount(counts.noResponse)} with no response`,
  ].filter((part) => part !== null);
  return {
    value: formatPercent(rate(counts.failed, counts.total)),
    note:
      counts.failed === 0
        ? `No failures in ${formatQuantity(counts.total, 'write', 'writes')}`
        : `${formatCount(counts.failed)} failed: ${parts.join(', ')}`,
  };
}

export function formatDuration(milliseconds: number): string {
  return `${formatCount(milliseconds)} ms`;
}

export function slowestRouteFigure(routes: readonly RouteReport[]): Figure {
  const slowest = routes.reduce<RouteReport | undefined>(
    (best, route) =>
      best === undefined || route.medianDurationMs > best.medianDurationMs ? route : best,
    undefined,
  );
  return slowest === undefined
    ? { value: '—', note: 'No writes in this period' }
    : {
        value: formatDuration(slowest.medianDurationMs),
        note: `median of ${slowest.method} ${slowest.route}`,
      };
}

export interface StatusChip {
  readonly label: string;
  readonly tone: StatusTone;
}

export interface ScreenFailure {
  readonly path: string;
  readonly failed: string;
}

export interface FailureRow {
  readonly key: string;
  readonly when: string;
  readonly status: string;
  readonly tone: StatusTone;
  readonly errorCode: string | null;
  readonly visit: string;
}

export interface RouteRow {
  readonly key: string;
  readonly method: string;
  readonly route: string;
  readonly total: string;
  readonly successShare: string;
  readonly errorShare: string;
  readonly successWidth: string;
  readonly hasFailures: boolean;
  readonly statuses: readonly StatusChip[];
  readonly median: string;
  readonly summary: string;
  readonly screens: readonly ScreenFailure[];
  readonly failures: readonly FailureRow[];
}

function failureTime(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
}

export function routeRows(routes: readonly RouteReport[], timeZone: string): readonly RouteRow[] {
  const time = failureTime(timeZone);
  return routes.map((route) => {
    const errorShare = formatPercent(rate(route.failed, route.total));
    const median = formatDuration(route.medianDurationMs);
    return {
      key: `${route.method} ${route.route}`,
      method: route.method,
      route: route.route,
      total: formatCount(route.total),
      successShare: formatPercent(rate(route.total - route.failed, route.total)),
      errorShare,
      successWidth: barWidth(route.total - route.failed, route.total),
      hasFailures: route.failed > 0,
      statuses: route.statuses.map((entry) => ({
        label: `${statusLabel(entry.status)} × ${formatCount(entry.count)}`,
        tone: statusTone(entry.status),
      })),
      median,
      summary: `${formatQuantity(route.total, 'request', 'requests')} · ${errorShare} errors · median ${median}`,
      screens: route.screens.map((screen) => ({
        path: screen.path,
        failed: `${formatCount(screen.failed)} failed`,
      })),
      failures: route.recentFailures.map((failure, index) => ({
        key: `${failure.occurredAt}-${String(index)}`,
        when: time.format(new Date(failure.occurredAt)),
        status: statusLabel(failure.status),
        tone: statusTone(failure.status),
        errorCode: failure.errorCode,
        visit: failure.sessionId.slice(0, VISIT_ID_LENGTH),
      })),
    };
  });
}

export function visibleRoutes(
  routes: readonly RouteReport[],
  failingOnly: boolean,
): readonly RouteReport[] {
  return failingOnly ? routes.filter((route) => route.failed > 0) : routes;
}
