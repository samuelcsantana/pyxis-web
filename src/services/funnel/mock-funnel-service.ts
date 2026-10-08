import type { FunnelMode, FunnelReport, FunnelStep } from '@/domain/funnel';
import type { FunnelDrill, FunnelSubjectsPage } from '@/domain/funnel-subjects';
import { funnelSubjectsResponseSchema } from '@/domain/funnel.schema';
import type { DateRange } from '../date-range';
import { demoFunnelReport, demoFunnelSubjectsWire } from './demo-funnel';
import type { IFunnelService } from './funnel-service.interface';

export class MockFunnelService implements IFunnelService {
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
