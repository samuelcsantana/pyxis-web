import { type OverviewReport, overviewResponseSchema } from '@/domain/overview';
import type { ApiReader } from '../api-reader';
import type { DateRange, IOverviewService } from './overview-service.interface';

export function rangeQuery(range: DateRange): string {
  return new URLSearchParams({ from: range.from, to: range.to }).toString();
}

export class HttpOverviewService implements IOverviewService {
  constructor(private readonly api: ApiReader) {}

  overview(projectId: string, range: DateRange): Promise<OverviewReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/overview?${rangeQuery(range)}`,
      overviewResponseSchema,
    );
  }
}
