import type { FunnelMode, FunnelReport, FunnelStep } from '@/domain/funnel';
import type { FunnelDrill, FunnelSubjectsPage } from '@/domain/funnel-subjects';
import type { DateRange } from '../date-range';

export interface IFunnelService {
  funnel(
    projectId: string,
    range: DateRange,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
  ): Promise<FunnelReport>;
  subjects(
    projectId: string,
    range: DateRange,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
    drill: FunnelDrill,
  ): Promise<FunnelSubjectsPage>;
}
