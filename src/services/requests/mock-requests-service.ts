import type { RequestsReport } from '@/domain/requests';
import type { DateRange } from '../date-range';
import { demoRequestsReport } from './demo-requests';
import type { IRequestsService } from './requests-service.interface';

export class MockRequestsService implements IRequestsService {
  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return Promise.resolve(demoRequestsReport(projectId, range, screen, new Date()));
  }
}
