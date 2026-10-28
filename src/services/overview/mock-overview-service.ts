import type { OverviewReport } from '@/domain/overview';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import { timeOfDayResponseSchema } from '@/domain/time-of-day.schema';
import { demoOverviewReport } from './demo-overview';
import { demoTimeOfDayWire } from './demo-time-of-day';
import type { ReportScope } from '../date-range';
import type { IOverviewService } from './overview-service.interface';

export class MockOverviewService implements IOverviewService {
  overview(projectId: string, scope: ReportScope): Promise<OverviewReport> {
    return Promise.resolve(demoOverviewReport(projectId, scope, new Date()));
  }

  timeOfDay(projectId: string, scope: ReportScope): Promise<TimeOfDayReport> {
    return Promise.resolve(
      timeOfDayResponseSchema.parse(demoTimeOfDayWire(projectId, scope, new Date())),
    );
  }
}
