import type { CsvTable } from './csv';
import { FAILED_READS, type RequestKind, type RouteReport, statusLabel } from './requests';

export const REQUESTS_FILE_SUBJECTS: Readonly<Record<RequestKind, string>> = {
  writes: 'writes',
  reads: 'failed-reads',
};

export const REQUESTS_TABLE_LABELS: Readonly<Record<RequestKind, string>> = {
  writes: 'Writes',
  reads: 'Failed reads',
};

const STATUS_SEPARATOR = '; ';

function statusesCell(route: RouteReport): string {
  return route.statuses
    .map((entry) => `${statusLabel(entry.status)} × ${String(entry.count)}`)
    .join(STATUS_SEPARATOR);
}

export function requestsCsvTable(routes: readonly RouteReport[], kind: RequestKind): CsvTable {
  if (kind === FAILED_READS) {
    return {
      columns: ['method', 'route', 'failed_reads', 'median_duration_ms', 'statuses'],
      rows: routes.map((route) => [
        route.method,
        route.route,
        route.failed,
        route.medianDurationMs,
        statusesCell(route),
      ]),
    };
  }
  return {
    columns: ['method', 'route', 'requests', 'failed', 'median_duration_ms', 'statuses'],
    rows: routes.map((route) => [
      route.method,
      route.route,
      route.total,
      route.failed,
      route.medianDurationMs,
      statusesCell(route),
    ]),
  };
}
