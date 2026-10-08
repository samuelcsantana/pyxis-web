import { type VisitFilters, type VisitsReport } from '@/domain/visits';
import { visitsResponseSchema } from '@/domain/visits.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IVisitsService } from './visits-service.interface';

const SINGLE_FILTERS = [
  'event',
  'property',
  'channel',
  'device',
  'identity',
  'country',
  'source',
  'campaign',
  'route',
] as const;
const FAILED_ONLY = 'true';

function visitsQuery(range: DateRange, filters: VisitFilters, cursor: string | null): string {
  const query = new URLSearchParams(rangeQuery(range));
  for (const path of filters.paths) {
    query.append('path', path);
  }
  for (const name of SINGLE_FILTERS) {
    const value = filters[name];
    if (value !== null) {
      query.set(name, value);
    }
  }
  if (filters.failed) {
    query.set('failed', FAILED_ONLY);
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
