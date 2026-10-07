import { barWidth, formatCount, formatPercent, formatQuantity, rate } from './metrics';
import type { REQUEST_KINDS, RequestsReport, RequestsWire } from './requests.schema';

export type { RequestsReport, RequestsWire };

export type RequestKind = (typeof REQUEST_KINDS)[number];

export type RouteReport = RequestsReport['routes'][number];

export const MAX_SCREEN_LENGTH = 256;
export const FAILING_ONLY = 'failing';
export const FAILED_READS: RequestKind = 'reads';
const VISIT_ID_LENGTH = 8;

export interface RequestsSearch {
  readonly kind?: string | string[];
  readonly show?: string | string[];
  readonly screen?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function requestKindOf(search: RequestsSearch): RequestKind {
  return single(search.kind) === FAILED_READS ? FAILED_READS : 'writes';
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

function failureKinds(counts: FailureCounts): string {
  return [
    counts.client === 0
      ? null
      : formatQuantity(counts.client, 'client error (4xx)', 'client errors (4xx)'),
    counts.server === 0
      ? null
      : formatQuantity(counts.server, 'server error (5xx)', 'server errors (5xx)'),
    counts.noResponse === 0 ? null : `${formatCount(counts.noResponse)} with no response`,
  ]
    .filter((part) => part !== null)
    .join(', ');
}

export function errorRateFigure(routes: readonly RouteReport[]): Figure {
  const counts = failureCounts(routes);
  return {
    value: formatPercent(rate(counts.failed, counts.total)),
    note:
      counts.failed === 0
        ? `No failures in ${formatQuantity(counts.total, 'write', 'writes')}`
        : `${formatCount(counts.failed)} failed: ${failureKinds(counts)}`,
  };
}

const NO_FAILED_READ = 'No read failed in this period';

export function failedReadsFigure(routes: readonly RouteReport[]): Figure {
  const counts = failureCounts(routes);
  return {
    value: formatCount(counts.failed),
    note: counts.failed === 0 ? NO_FAILED_READ : failureKinds(counts),
  };
}

export function failingRoutesFigure(routes: readonly RouteReport[]): Figure {
  const failing = routes.filter((route) => route.failed > 0);
  const most = failing.reduce<RouteReport | undefined>(
    (best, route) => (best === undefined || route.failed > best.failed ? route : best),
    undefined,
  );
  return {
    value: formatCount(failing.length),
    note:
      most === undefined
        ? NO_FAILED_READ
        : `Most: ${most.method} ${most.route}, ${formatQuantity(most.failed, 'failure', 'failures')}`,
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

export interface RequestFigure extends Figure {
  readonly id: string;
  readonly label: string;
}

export function requestFigures(
  kind: RequestKind,
  routes: readonly RouteReport[],
): readonly RequestFigure[] {
  return kind === FAILED_READS
    ? [
        { id: 'failed-reads', label: 'Failed reads', ...failedReadsFigure(routes) },
        { id: 'failing-routes', label: 'Routes failing', ...failingRoutesFigure(routes) },
      ]
    : [
        { id: 'writes', label: 'Writes', ...writesFigure(routes) },
        { id: 'error-rate', label: 'Error rate', ...errorRateFigure(routes) },
        { id: 'slowest-route', label: 'Slowest route', ...slowestRouteFigure(routes) },
      ];
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
  readonly sessionId: string;
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

function routeSummary(route: RouteReport, kind: RequestKind, errorShare: string, median: string) {
  return kind === FAILED_READS
    ? `${formatQuantity(route.failed, 'failed read', 'failed reads')} · median ${median}`
    : `${formatQuantity(route.total, 'request', 'requests')} · ${errorShare} errors · median ${median}`;
}

export function routeRows(
  routes: readonly RouteReport[],
  timeZone: string,
  kind: RequestKind,
): readonly RouteRow[] {
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
      summary: routeSummary(route, kind, errorShare, median),
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
        sessionId: failure.sessionId,
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
