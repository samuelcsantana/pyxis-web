import {
  type FunnelMode,
  type FunnelReport,
  type FunnelStep,
  type FunnelWire,
} from '@/domain/funnel';
import { funnelResponseSchema } from '@/domain/funnel.schema';
import type { DateRange } from '../date-range';
import { demoFunnelCounts } from '../demo/demo-dataset';
import { DEMO_STORE, demoProjectOf } from '../demo/demo-projects';

export const DEMO_FUNNEL_STEPS: readonly FunnelStep[] = DEMO_STORE.exampleFunnel;

export function demoExampleFunnel(projectId: string): readonly FunnelStep[] {
  return demoProjectOf(projectId).exampleFunnel;
}

export function demoFunnelWire(
  projectId: string,
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): FunnelWire {
  return {
    steps: demoFunnelCounts(demoProjectOf(projectId), range, mode, steps).map((count) => ({
      count,
    })),
  };
}

export function demoFunnelReport(
  projectId: string,
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): FunnelReport {
  return funnelResponseSchema.parse(demoFunnelWire(projectId, range, mode, steps));
}
