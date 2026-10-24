import type { ArrivalsReport } from '@/domain/arrivals';
import { arrivalsResponseSchema } from '@/domain/arrivals.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IArrivalsService } from './arrivals-service.interface';

export class HttpArrivalsService implements IArrivalsService {
  constructor(private readonly api: ApiReader) {}

  arrivals(projectId: string, range: DateRange, since: Date): Promise<ArrivalsReport> {
    const sinceQuery = new URLSearchParams({ since: since.toISOString() }).toString();
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/arrivals?${rangeQuery(range)}&${sinceQuery}`,
      arrivalsResponseSchema,
    );
  }
}
