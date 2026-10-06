import { daysBetween } from '@/domain/period';
import {
  type FunnelMode,
  type FunnelReport,
  funnelResponseSchema,
  type FunnelStep,
  type FunnelWire,
} from '@/domain/funnel';
import type { DateRange } from '../date-range';

export const DEMO_FUNNEL_STEPS: readonly FunnelStep[] = [
  { type: 'page', path: '/calculator' },
  { type: 'event', name: 'calculator_result_shown' },
  { type: 'page', path: '/sign-up' },
  { type: 'event', name: 'signup_submitted' },
  { type: 'event', name: 'signup_completed' },
  { type: 'event', name: 'order_created' },
];

const FIRST_STEP_PER_DAY = 65;
const CONTINUATION = [0.625, 0.411, 0.538, 0.791, 0.458, 0.7, 0.6] as const;
const PEOPLE_PER_VISIT: Readonly<Record<FunnelMode, number>> = { visit: 1, user: 0.8 };

export function demoFunnelWire(
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): FunnelWire {
  const first = Math.round(
    FIRST_STEP_PER_DAY * daysBetween(range.from, range.to) * PEOPLE_PER_VISIT[mode],
  );
  const ratios = CONTINUATION.slice(0, steps.length - 1);
  const { counts } = ratios.reduce<{ readonly counts: readonly number[]; readonly last: number }>(
    (progress, ratio) => {
      const next = Math.round(progress.last * ratio);
      return { counts: [...progress.counts, next], last: next };
    },
    { counts: [first], last: first },
  );
  return { steps: counts.map((count) => ({ count })) };
}

export function demoFunnelReport(
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): FunnelReport {
  return funnelResponseSchema.parse(demoFunnelWire(range, mode, steps));
}
