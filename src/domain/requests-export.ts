import type { CsvTable } from './csv';
import type { I18n } from '@/i18n/i18n';
import { FAILED_READS, type RequestKind, type RouteReport } from './requests';

export const REQUESTS_FILE_SUBJECTS: Readonly<Record<RequestKind, string>> = {
  writes: 'writes',
  reads: 'failed-reads',
};

export function requestsTableLabel(kind: RequestKind, i18n: I18n): string {
  return i18n.t(`exports.requests.${kind}`);
}

const STATUS_SEPARATOR = '; ';
const NO_RESPONSE_STATUS = 'No response';

function csvStatus(status: number): string {
  return status === 0 ? NO_RESPONSE_STATUS : String(status);
}

function statusesCell(route: RouteReport): string {
  return route.statuses
    .map((entry) => `${csvStatus(entry.status)} × ${String(entry.count)}`)
    .join(STATUS_SEPARATOR);
}

export function requestsCsvTable(routes: readonly RouteReport[], kind: RequestKind): CsvTable {
  if (kind === FAILED_READS) {
    return {
      columns: [
        'method',
        'route',
        'failed_reads',
        'median_duration_ms',
        'p95_duration_ms',
        'statuses',
      ],
      rows: routes.map((route) => [
        route.method,
        route.route,
        route.failed,
        route.medianDurationMs,
        route.p95DurationMs,
        statusesCell(route),
      ]),
    };
  }
  return {
    columns: [
      'method',
      'route',
      'requests',
      'failed',
      'median_duration_ms',
      'p95_duration_ms',
      'statuses',
    ],
    rows: routes.map((route) => [
      route.method,
      route.route,
      route.total,
      route.failed,
      route.medianDurationMs,
      route.p95DurationMs,
      statusesCell(route),
    ]),
  };
}
