import type { RequestKind, RequestsReport } from '@/domain/requests';
import type { RouteDay } from '@/domain/route-days';
import type { DateRange } from '../date-range';

export interface IRequestsService {
  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport>;
  failedReads(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport>;
  routeDays(
    projectId: string,
    range: DateRange,
    kind: RequestKind,
    screen: string | null,
    route: string,
  ): Promise<readonly RouteDay[] | null>;
}
