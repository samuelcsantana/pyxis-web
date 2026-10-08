import { type RequestKind, type RequestsReport } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { RouteDay } from '@/domain/route-days';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IRequestsService } from './requests-service.interface';

export class HttpRequestsService implements IRequestsService {
  constructor(private readonly api: ApiReader) {}

  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return this.report(projectId, range, screen, 'writes', null);
  }

  failedReads(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return this.report(projectId, range, screen, 'reads', null);
  }

  async routeDays(
    projectId: string,
    range: DateRange,
    kind: RequestKind,
    screen: string | null,
    route: string,
  ): Promise<readonly RouteDay[] | null> {
    return (await this.report(projectId, range, screen, kind, route)).routeDays;
  }

  private report(
    projectId: string,
    range: DateRange,
    screen: string | null,
    kind: RequestKind,
    route: string | null,
  ): Promise<RequestsReport> {
    const query = new URLSearchParams(rangeQuery(range));
    if (screen !== null) {
      query.set('screen', screen);
    }
    if (kind === 'reads') {
      query.set('kind', kind);
    }
    if (route !== null) {
      query.set('route', route);
    }
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/requests?${query.toString()}`,
      requestsResponseSchema,
    );
  }
}
