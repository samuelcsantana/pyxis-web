import type { OverviewReport } from '@/domain/overview';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import type { DateRange } from '../date-range';

export interface IOverviewService {
  overview(projectId: string, range: DateRange): Promise<OverviewReport>;
  timeOfDay(projectId: string, range: DateRange): Promise<TimeOfDayReport>;
}
