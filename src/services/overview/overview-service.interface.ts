import type { OverviewReport } from '@/domain/overview';

export interface DateRange {
  readonly from: string;
  readonly to: string;
}

export interface IOverviewService {
  overview(projectId: string, range: DateRange): Promise<OverviewReport>;
}
