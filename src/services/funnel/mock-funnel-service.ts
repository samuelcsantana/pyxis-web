import type { FunnelMode, FunnelReport, FunnelStep } from '@/domain/funnel';
import type { FunnelSegmentDimension, FunnelSegmentsReport } from '@/domain/funnel-segments';
import { funnelSegmentsResponseSchema } from '@/domain/funnel-segments.schema';
import type { FunnelDrill, FunnelSubjectsPage } from '@/domain/funnel-subjects';
import { funnelSubjectsResponseSchema } from '@/domain/funnel.schema';
import type { DateRange } from '../date-range';
import { demoFunnelReport, demoFunnelSegmentsWire, demoFunnelSubjectsWire } from './demo-funnel';
import type { IFunnelService } from './funnel-service.interface';

export class MockFunnelService implements IFunnelService {
  segments(
    projectId: string,
    range: DateRange,
    steps: readonly FunnelStep[],
    by: FunnelSegmentDimension,
  ): Promise<FunnelSegmentsReport> {
    return Promise.resolve(
      funnelSegmentsResponseSchema.parse(
        demoFunnelSegmentsWire(projectId, range, steps, by, new Date()),
      ),
    );
  }

  funnel(
    projectId: string,
    range: DateRange,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
  ): Promise<FunnelReport> {
    return Promise.resolve(demoFunnelReport(projectId, range, mode, steps, new Date()));
  }

  subjects(
    projectId: string,
    range: DateRange,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
    drill: FunnelDrill,
  ): Promise<FunnelSubjectsPage> {
    return Promise.resolve(
      funnelSubjectsResponseSchema.parse(
        demoFunnelSubjectsWire(projectId, range, mode, steps, drill, new Date()),
      ),
    );
  }
}
