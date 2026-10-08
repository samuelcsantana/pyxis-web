import type { FunnelMode, FunnelReport, FunnelStep } from '@/domain/funnel';
import type { DateRange } from '../date-range';
import { demoFunnelReport } from './demo-funnel';
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
}
