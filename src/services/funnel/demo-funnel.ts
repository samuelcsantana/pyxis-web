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
import { textSalt } from '../demo/demo-series';

const FEWEST_SECONDS_BETWEEN_STEPS = 20;
const SECONDS_BETWEEN_STEPS_SPREAD = 580;

export const DEMO_FUNNEL_STEPS: readonly FunnelStep[] = DEMO_STORE.exampleFunnel;

export function demoExampleFunnel(projectId: string): readonly FunnelStep[] {
  return demoProjectOf(projectId).exampleFunnel;
}

export function demoSecondsBeforeStep(projectId: string, index: number): number {
  return (
    FEWEST_SECONDS_BETWEEN_STEPS +
    (textSalt(`${projectId} funnel step ${String(index)}`) % SECONDS_BETWEEN_STEPS_SPREAD)
  );
}

export function demoFunnelWire(
  projectId: string,
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): FunnelWire {
  const counts = demoFunnelCounts(demoProjectOf(projectId), range, mode, steps);
  const completed = !counts.includes(0);
  return {
    steps: counts.map((count, index) => ({
      count,
      median_seconds_from_previous:
        index === 0 || count === 0 ? null : demoSecondsBeforeStep(projectId, index),
    })),
    median_seconds_overall: completed
      ? counts
          .slice(1)
          .reduce((sum, _count, index) => sum + demoSecondsBeforeStep(projectId, index + 1), 0)
      : null,
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
