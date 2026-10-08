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

export function statusLabel(status: number, i18n: I18n): string {
  return status === 0 ? i18n.t('requests.noResponse') : String(status);
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
    note: i18n.t('requests.notes.writes'),
  };
}

function failureKinds(counts: FailureCounts, i18n: I18n): string {
  return [
    counts.client === 0 ? null : i18n.t('counts.clientError', { count: counts.client }),
    counts.server === 0 ? null : i18n.t('counts.serverError', { count: counts.server }),
    counts.noResponse === 0
      ? null
      : i18n.t('requests.notes.withNoResponse', { count: formatCount(counts.noResponse, i18n) }),
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
        ? i18n.t('requests.notes.noFailures', {
            writes: i18n.t('counts.write', { count: counts.total }),
          })
        : i18n.t('requests.notes.failed', {
            failed: formatCount(counts.failed, i18n),
            kinds: failureKinds(counts, i18n),
          }),
  };
}

export function failedReadsFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const counts = failureCounts(routes);
  return {
    value: formatCount(counts.failed, i18n),
    note: counts.failed === 0 ? i18n.t('requests.notes.noFailedRead') : failureKinds(counts, i18n),
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
        ? i18n.t('requests.notes.noFailedRead')
        : i18n.t('requests.notes.mostFailing', {
            route: `${most.method} ${most.route}`,
            failures: i18n.t('counts.failure', { count: most.failed }),
          }),
  };
}

export function formatDuration(milliseconds: number, i18n: I18n): string {
  return i18n.t('requests.duration', { milliseconds: formatCount(milliseconds, i18n) });
}

export function slowestRouteFigure(routes: readonly RouteReport[], i18n: I18n): Figure {
  const slowest = routes.reduce<RouteReport | undefined>(
    (best, route) =>
      best === undefined || route.medianDurationMs > best.medianDurationMs ? route : best,
    undefined,
  );
  return slowest === undefined
    ? { value: '—', note: i18n.t('requests.notes.noWrites') }
    : {
        value: formatDuration(slowest.medianDurationMs, i18n),
        note: i18n.t('requests.notes.slowestMedian', {
          route: `${slowest.method} ${slowest.route}`,
        }),
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
        {
          id: 'failed-reads',
          label: i18n.t('requests.figures.failedReads'),
          ...failedReadsFigure(routes, i18n),
        },
        {
          id: 'failing-routes',
          label: i18n.t('requests.figures.failingRoutes'),
          ...failingRoutesFigure(routes, i18n),
        },
      ]
    : [
        { id: 'writes', label: i18n.t('requests.figures.writes'), ...writesFigure(routes, i18n) },
        {
          id: 'error-rate',
          label: i18n.t('requests.figures.errorRate'),
          ...errorRateFigure(routes, i18n),
        },
        {
          id: 'slowest-route',
          label: i18n.t('requests.figures.slowestRoute'),
          ...slowestRouteFigure(routes, i18n),
        },
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
  readonly openVisit: string;
  readonly sessionId: string;
}

export interface RouteRow {
  readonly key: string;
  readonly method: string;
  readonly route: string;
  readonly total: string;
  readonly detailsLabel: string;
  readonly successNote: string;
  readonly errorNote: string;
  readonly failedVisitsLabel: string;
  readonly successWidth: string;
  readonly hasFailures: boolean;
  readonly statuses: readonly StatusChip[];
  readonly median: string;
  readonly p95: string | null;
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
    ? i18n.t('requests.routeSummary.reads', {
        failedReads: i18n.t('counts.failedRead', { count: route.failed }),
        median,
      })
    : i18n.t('requests.routeSummary.writes', {
        requests: i18n.t('counts.request', { count: route.total }),
        errorShare,
        median,
      });
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
      detailsLabel: i18n.t('requests.table.showDetails', {
        route: `${route.method} ${route.route}`,
      }),
      successNote: i18n.t('requests.table.successShare', {
        share: formatPercent(rate(route.total - route.failed, route.total), i18n),
      }),
      errorNote: i18n.t('requests.table.errorShare', { share: errorShare }),
      failedVisitsLabel: i18n.t('requests.details.failedVisits', {
        method: route.method,
        route: route.route,
      }),
      successWidth: barWidth(route.total - route.failed, route.total),
      hasFailures: route.failed > 0,
      statuses: route.statuses.map((entry) => ({
        label: `${statusLabel(entry.status, i18n)} × ${formatCount(entry.count, i18n)}`,
        tone: statusTone(entry.status),
      })),
      median,
      p95: route.p95DurationMs === null ? null : formatDuration(route.p95DurationMs, i18n),
      summary: routeSummary(route, kind, { errorShare, median }, i18n),
      screens: route.screens.map((screen) => ({
        path: screen.path,
        failed: i18n.t('requests.details.screenFailed', {
          failed: formatCount(screen.failed, i18n),
        }),
      })),
      failures: route.recentFailures.map((failure, index) => ({
        key: `${failure.occurredAt}-${String(index)}`,
        when: time(new Date(failure.occurredAt)),
        status: statusLabel(failure.status, i18n),
        tone: statusTone(failure.status),
        errorCode: failure.errorCode,
        openVisit: i18n.t('requests.details.openVisit', {
          visit: failure.sessionId.slice(0, VISIT_ID_LENGTH),
        }),
        sessionId: failure.sessionId,
      })),
    };
  });
}

export interface RequestsTableText {
  readonly heading: string;
  readonly columns: {
    readonly route: string;
    readonly total: string;
    readonly failed: string;
    readonly outcomes: string;
    readonly statuses: string;
    readonly median: string;
    readonly p95: string;
  };
  readonly details: {
    readonly close: string;
    readonly statuses: string;
    readonly whereItFailed: string;
    readonly onlyThisScreen: string;
    readonly latestFailures: string;
    readonly noFailures: string;
    readonly noErrorCode: string;
  };
}

export function requestsTableText(i18n: I18n): RequestsTableText {
  return {
    heading: i18n.t('requests.table.heading'),
    columns: {
      route: i18n.t('requests.table.columns.route'),
      total: i18n.t('requests.table.columns.total'),
      failed: i18n.t('requests.table.columns.failed'),
      outcomes: i18n.t('requests.table.columns.outcomes'),
      statuses: i18n.t('requests.table.columns.statuses'),
      median: i18n.t('requests.table.columns.median'),
      p95: i18n.t('requests.table.columns.p95'),
    },
    details: {
      close: i18n.t('requests.details.close'),
      statuses: i18n.t('requests.details.statuses'),
      whereItFailed: i18n.t('requests.details.whereItFailed'),
      onlyThisScreen: i18n.t('requests.details.onlyThisScreen'),
      latestFailures: i18n.t('requests.details.latestFailures'),
      noFailures: i18n.t('requests.details.noFailures'),
      noErrorCode: i18n.t('requests.details.noErrorCode'),
    },
  };
}

export function visibleRoutes(
  routes: readonly RouteReport[],
  failingOnly: boolean,
): readonly RouteReport[] {
  return failingOnly ? routes.filter((route) => route.failed > 0) : routes;
}
