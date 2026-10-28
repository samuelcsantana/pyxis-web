import { dashboardFilterQuery } from '@/domain/dashboard-filters';
import { type VisitFilters, type VisitsReport } from '@/domain/visits';
import { visitsResponseSchema } from '@/domain/visits.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IVisitsService } from './visits-service.interface';

function visitsQuery(range: DateRange, filters: VisitFilters, cursor: string | null): string {
  const query = new URLSearchParams(rangeQuery(range));
  for (const [name, value] of dashboardFilterQuery(filters)) {
    query.append(name, value);
  }
  if (filters.route !== null) {
    query.set('route', filters.route);
  }
  if (cursor !== null) {
    query.set('cursor', cursor);
  }
  return query.toString();
}

export class HttpVisitsService implements IVisitsService {
  constructor(private readonly api: ApiReader) {}

  visits(
    projectId: string,
    range: DateRange,
    filters: VisitFilters,
    cursor: string | null,
  ): Promise<VisitsReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/visits?${visitsQuery(range, filters, cursor)}`,
      visitsResponseSchema,
    );
  }
}
