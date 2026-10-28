import type { RequestKind, RequestsReport } from '@/domain/requests';
import type { RouteDay } from '@/domain/route-days';
import type { ReportScope } from '../date-range';

export interface IRequestsService {
  requests(projectId: string, scope: ReportScope, screen: string | null): Promise<RequestsReport>;
  failedReads(
    projectId: string,
    scope: ReportScope,
    screen: string | null,
  ): Promise<RequestsReport>;
  routeDays(
    projectId: string,
    scope: ReportScope,
    kind: RequestKind,
    screen: string | null,
    route: string,
  ): Promise<readonly RouteDay[] | null>;
}
