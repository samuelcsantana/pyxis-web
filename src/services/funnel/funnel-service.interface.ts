import type { FunnelMode, FunnelReport, FunnelStep } from '@/domain/funnel';
import type { FunnelSegmentDimension, FunnelSegmentsReport } from '@/domain/funnel-segments';
import type { FunnelDrill, FunnelSubjectsPage } from '@/domain/funnel-subjects';
import type { ReportScope } from '../date-range';

export interface IFunnelService {
  funnel(
    projectId: string,
    scope: ReportScope,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
  ): Promise<FunnelReport>;
  subjects(
    projectId: string,
    scope: ReportScope,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
    drill: FunnelDrill,
  ): Promise<FunnelSubjectsPage>;
  segments(
    projectId: string,
    scope: ReportScope,
    steps: readonly FunnelStep[],
    by: FunnelSegmentDimension,
  ): Promise<FunnelSegmentsReport>;
}
