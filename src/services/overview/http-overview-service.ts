import { type OverviewReport } from '@/domain/overview';
import { overviewResponseSchema } from '@/domain/overview.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IOverviewService } from './overview-service.interface';

export class HttpOverviewService implements IOverviewService {
  constructor(private readonly api: ApiReader) {}

  overview(projectId: string, range: DateRange): Promise<OverviewReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/overview?${rangeQuery(range)}`,
      overviewResponseSchema,
    );
  }
}
