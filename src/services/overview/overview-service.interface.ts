import type { OverviewReport } from '@/domain/overview';
import type { DateRange } from '../date-range';

export interface IOverviewService {
  overview(projectId: string, range: DateRange): Promise<OverviewReport>;
}
