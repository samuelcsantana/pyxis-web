import type { RequestKind, RequestsReport } from '@/domain/requests';
import { requestsResponseSchema } from '@/domain/requests.schema';
import type { RouteDay } from '@/domain/route-days';
import type { ReportScope } from '../date-range';
import { demoFailedReadsReport, demoRequestsReport, demoRouteRequestsWire } from './demo-requests';
import type { IRequestsService } from './requests-service.interface';

export class MockRequestsService implements IRequestsService {
  requests(projectId: string, scope: ReportScope, screen: string | null): Promise<RequestsReport> {
    return Promise.resolve(demoRequestsReport(projectId, scope, screen, new Date(), null));
  }

  failedReads(
    projectId: string,
    scope: ReportScope,
    screen: string | null,
  ): Promise<RequestsReport> {
    return Promise.resolve(demoFailedReadsReport(projectId, scope, screen, new Date(), null));
  }

  routeDays(
    projectId: string,
    scope: ReportScope,
    kind: RequestKind,
    screen: string | null,
    route: string,
  ): Promise<readonly RouteDay[] | null> {
    return Promise.resolve(
      requestsResponseSchema.parse(
        demoRouteRequestsWire(projectId, scope, kind, screen, route, new Date()),
      ).routeDays,
    );
  }
}
