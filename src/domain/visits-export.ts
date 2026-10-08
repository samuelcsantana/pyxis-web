import type { CsvTable } from './csv';
import { formatCount } from './metrics';
import type { VisitSummary } from './visits';

export const MAX_EXPORTED_VISITS = 1_000;
export const VISITS_TABLE_LABEL = `Newest ${formatCount(MAX_EXPORTED_VISITS)} visits`;

const HIGHLIGHT_SEPARATOR = '; ';

export function visitsCsvTable(visits: readonly VisitSummary[]): CsvTable {
  return {
    columns: [
      'visit_id',
      'started_at',
      'ended_at',
      'entry_path',
      'page_views',
      'highlights',
      'failed_requests',
      'device_type',
      'browser',
      'os',
      'country',
      'channel',
      'user_id',
    ],
    rows: visits.map((visit) => [
      visit.sessionId,
      visit.startedAt,
      visit.endedAt,
      visit.entryPath,
      visit.pageViews,
      visit.highlights.join(HIGHLIGHT_SEPARATOR),
      visit.failedRequests,
      visit.deviceType,
      visit.browser,
      visit.os,
      visit.country,
      visit.channel,
      visit.userId,
    ]),
  };
}
