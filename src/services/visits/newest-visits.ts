import type { VisitFilters, VisitSummary } from '@/domain/visits';
import type { DateRange } from '../date-range';
import { createVisitsService } from './visits-service.factory';

type VisitsPageReader = (
  cursor: string | null,
) => Promise<{ readonly visits: readonly VisitSummary[]; readonly nextCursor: string | null }>;

async function collect(
  read: VisitsPageReader,
  cursor: string | null,
  collected: readonly VisitSummary[],
  limit: number,
): Promise<readonly VisitSummary[]> {
  const page = await read(cursor);
  const visits = [...collected, ...page.visits];
  if (page.nextCursor === null || visits.length >= limit) {
    return visits.slice(0, limit);
  }
  return collect(read, page.nextCursor, visits, limit);
}

export function readNewestVisits(
  projectId: string,
  range: DateRange,
  filters: VisitFilters,
  limit: number,
): Promise<readonly VisitSummary[]> {
  const service = createVisitsService();
  return collect((cursor) => service.visits(projectId, range, filters, cursor), null, [], limit);
}
