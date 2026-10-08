import type { RequestKind, RequestsReport } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { RouteDay } from '@/domain/route-days';
import type { DateRange } from '../date-range';
import { demoFailedReadsReport, demoRequestsReport, demoRouteRequestsWire } from './demo-requests';
import type { IRequestsService } from './requests-service.interface';

export class MockRequestsService implements IRequestsService {
  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return Promise.resolve(demoRequestsReport(projectId, range, screen, new Date(), null));
  }

  failedReads(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return Promise.resolve(demoFailedReadsReport(projectId, range, screen, new Date(), null));
  }

  routeDays(
    projectId: string,
    range: DateRange,
    kind: RequestKind,
    screen: string | null,
    route: string,
  ): Promise<readonly RouteDay[] | null> {
    return Promise.resolve(
      requestsResponseSchema.parse(
        demoRouteRequestsWire(projectId, range, kind, screen, route, new Date()),
      ).routeDays,
    );
  }
}
