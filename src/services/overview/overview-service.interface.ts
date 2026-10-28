import type { OverviewReport } from '@/domain/overview';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import type { ReportScope } from '../date-range';

export interface IOverviewService {
  overview(projectId: string, scope: ReportScope): Promise<OverviewReport>;
  timeOfDay(projectId: string, scope: ReportScope): Promise<TimeOfDayReport>;
}
