import { type OverviewReport } from '@/domain/overview';
import { overviewResponseSchema } from '@/domain/overview.schema';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import { timeOfDayResponseSchema } from '@/domain/time-of-day.schema';
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

  timeOfDay(projectId: string, range: DateRange): Promise<TimeOfDayReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/time-of-day?${rangeQuery(range)}`,
      timeOfDayResponseSchema,
    );
  }
}
