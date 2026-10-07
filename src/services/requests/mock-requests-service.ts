import type { RequestsReport } from '@/domain/requests';
import type { DateRange } from '../date-range';
import { demoTimeZone } from '../demo/demo-projects';
import { demoRequestsReport } from './demo-requests';
import type { IRequestsService } from './requests-service.interface';

export class MockRequestsService implements IRequestsService {
  requests(projectId: string, range: DateRange, screen: string | null): Promise<RequestsReport> {
    return Promise.resolve(demoRequestsReport(range, screen, new Date(), demoTimeZone(projectId)));
  }
}
