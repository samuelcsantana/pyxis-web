import { type RequestsReport } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IRequestsService } from './requests-service.interface';

export class HttpRequestsService implements IRequestsService {
  constructor(private readonly api: ApiReader) {}

  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    const query = new URLSearchParams(rangeQuery(range));
    if (screen !== null) {
      query.set('screen', screen);
    }
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/requests?${query.toString()}`,
      requestsResponseSchema,
    );
  }
}
