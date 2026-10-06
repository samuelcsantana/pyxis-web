import type { OverviewReport } from '@/domain/overview';
import { demoOverviewReport } from './demo-overview';
import type { DateRange, IOverviewService } from './overview-service.interface';

export class MockOverviewService implements IOverviewService {
  overview(projectId: string, range: DateRange): Promise<OverviewReport> {
    return Promise.resolve(demoOverviewReport(projectId, range));
  }
}
