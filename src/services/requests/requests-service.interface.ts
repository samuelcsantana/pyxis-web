import type { RequestsReport } from '@/domain/requests';
import type { DateRange } from '../date-range';

export interface IRequestsService {
  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport>;
  failedReads(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport>;
}
