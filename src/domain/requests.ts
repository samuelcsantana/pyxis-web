import type { I18n } from '@/i18n/i18n';
import { barWidth, formatCount, formatPercent, rate } from './metrics';
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

export function writesFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  return {
    value: formatCount(failureCounts(routes).total, i18n),
    note: 'POST, PUT, PATCH and DELETE calls from the browser',
  };
}

function failureKinds(counts: FailureCounts, i18n: I18n): string {
  return [
    counts.client === 0 ? null : i18n.t('counts.clientError', { count: counts.client }),
    counts.server === 0 ? null : i18n.t('counts.serverError', { count: counts.server }),
    counts.noResponse === 0 ? null : `${formatCount(counts.noResponse, i18n)} with no response`,
  ]
    .filter((part) => part !== null)
    .join(', ');
}

export function errorRateFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const counts = failureCounts(routes);
  return {
    value: formatPercent(rate(counts.failed, counts.total), i18n),
    note:
      counts.failed === 0
        ? `No failures in ${i18n.t('counts.write', { count: counts.total })}`
        : `${formatCount(counts.failed, i18n)} failed: ${failureKinds(counts, i18n)}`,
  };
}

const NO_FAILED_READ = 'No read failed in this period';

export function failedReadsFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const counts = failureCounts(routes);
  return {
    value: formatCount(counts.failed, i18n),
    note: counts.failed === 0 ? NO_FAILED_READ : failureKinds(counts, i18n),
  };
}

export function failingRoutesFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const failing = routes.filter((route) => route.failed > 0);
  const most = failing.reduce<RouteReport | undefined>(
    (best, route) => (best === undefined || route.failed > best.failed ? route : best),
    undefined,
  );
  return {
    value: formatCount(failing.length, i18n),
    note:
      most === undefined
        ? NO_FAILED_READ
        : `Most: ${most.method} ${most.route}, ${i18n.t('counts.failure', { count: most.failed })}`,
  };
}

export function formatDuration(milliseconds: number, i18n: I18n): string {
  return `${formatCount(milliseconds, i18n)} ms`;
}

export function slowestRouteFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const slowest = routes.reduce<RouteReport | undefined>(
    (best, route) =>
      best === undefined || route.medianDurationMs > best.medianDurationMs ? route : best,
    undefined,
  );
  return slowest === undefined
    ? { value: '—', note: 'No writes in this period' }
    : {
        value: formatDuration(slowest.medianDurationMs, i18n),
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
  i18n: I18n,
): readonly RequestFigure[] {
  return kind === FAILED_READS
    ? [
        { id: 'failed-reads', label: 'Failed reads', ...failedReadsFigure(routes, i18n) },
        { id: 'failing-routes', label: 'Routes failing', ...failingRoutesFigure(routes, i18n) },
      ]
    : [
        { id: 'writes', label: 'Writes', ...writesFigure(routes, i18n) },
        { id: 'error-rate', label: 'Write error rate', ...errorRateFigure(routes, i18n) },
        { id: 'slowest-route', label: 'Slowest route', ...slowestRouteFigure(routes, i18n) },
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

function routeSummary(
  route: RouteReport,
  kind: RequestKind,
  shares: { readonly errorShare: string; readonly median: string },
  i18n: I18n,
) {
  const { errorShare, median } = shares;
  return kind === FAILED_READS
    ? `${i18n.t('counts.failedRead', { count: route.failed })} · median ${median}`
    : `${i18n.t('counts.request', { count: route.total })} · ${errorShare} errors · median ${median}`;
}

export function routeRows(
  routes: readonly RouteReport[],
  timeZone: string,
  kind: RequestKind,
  i18n: I18n,
): readonly RouteRow[] {
  const time = i18n.format.dateTime('failureTime', timeZone);
  return routes.map((route) => {
    const errorShare = formatPercent(rate(route.failed, route.total), i18n);
    const median = formatDuration(route.medianDurationMs, i18n);
    return {
      key: `${route.method} ${route.route}`,
      method: route.method,
      route: route.route,
      total: formatCount(route.total, i18n),
      successShare: formatPercent(rate(route.total - route.failed, route.total), i18n),
      errorShare,
      successWidth: barWidth(route.total - route.failed, route.total),
      hasFailures: route.failed > 0,
      statuses: route.statuses.map((entry) => ({
        label: `${statusLabel(entry.status)} × ${formatCount(entry.count, i18n)}`,
        tone: statusTone(entry.status),
      })),
      median,
      summary: routeSummary(route, kind, { errorShare, median }, i18n),
      screens: route.screens.map((screen) => ({
        path: screen.path,
        failed: `${formatCount(screen.failed, i18n)} failed`,
      })),
      failures: route.recentFailures.map((failure, index) => ({
        key: `${failure.occurredAt}-${String(index)}`,
        when: time(new Date(failure.occurredAt)),
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
