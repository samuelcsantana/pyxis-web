import { z } from 'zod';
import { eventLabel, formatCount, formatPercent, formatQuantity, rate, barWidth } from './metrics';

export const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
export const MAX_PATH_LENGTH = 256;
export const MIN_FUNNEL_STEPS = 2;
export const MAX_FUNNEL_STEPS = 8;
export const FUNNEL_MODES = ['visit', 'user'] as const;
export type FunnelMode = (typeof FUNNEL_MODES)[number];
export const DEFAULT_FUNNEL_MODE: FunnelMode = 'visit';
const CONTINUATION_WARNING = 0.5;

export const funnelStepSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('page'),
    path: z.string().startsWith('/').max(MAX_PATH_LENGTH),
  }),
  z.strictObject({ type: z.literal('event'), name: z.string().regex(EVENT_NAME_PATTERN) }),
]);
export type FunnelStep = z.output<typeof funnelStepSchema>;
export type FunnelStepType = FunnelStep['type'];

export const funnelStepsSchema = z
  .array(funnelStepSchema)
  .min(MIN_FUNNEL_STEPS)
  .max(MAX_FUNNEL_STEPS);

const stepsParameterSchema = z
  .string()
  .transform((text, context) => {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      context.addIssue({ code: 'custom', message: 'steps must be JSON' });
      return z.NEVER;
    }
  })
  .pipe(funnelStepsSchema);

export const funnelResponseSchema = z.object({
  steps: z.array(z.object({ count: z.number() })),
});
export type FunnelReport = z.output<typeof funnelResponseSchema>;
export type FunnelWire = z.input<typeof funnelResponseSchema>;

export interface FunnelSearch {
  readonly mode?: string | string[];
  readonly steps?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function funnelModeOf(search: FunnelSearch): FunnelMode {
  const mode = single(search.mode);
  return FUNNEL_MODES.find((candidate) => candidate === mode) ?? DEFAULT_FUNNEL_MODE;
}

export function funnelStepsOf(search: FunnelSearch): readonly FunnelStep[] | null {
  const parsed = stepsParameterSchema.safeParse(single(search.steps));
  return parsed.success ? parsed.data : null;
}

export function serializeSteps(steps: readonly FunnelStep[]): string {
  return JSON.stringify(steps);
}

export function stepTarget(step: FunnelStep): string {
  return step.type === 'page' ? step.path : step.name;
}

export function stepLabel(step: FunnelStep): string {
  return step.type === 'page' ? `Opened ${step.path}` : eventLabel(step.name);
}

export function stepProblem(step: FunnelStep): string | null {
  if (step.type === 'page') {
    if (!step.path.startsWith('/')) {
      return 'A page path starts with "/".';
    }
    return step.path.length > MAX_PATH_LENGTH
      ? `A page path has at most ${String(MAX_PATH_LENGTH)} characters.`
      : null;
  }
  return EVENT_NAME_PATTERN.test(step.name)
    ? null
    : 'An event name starts with a lowercase letter and holds only lowercase letters, digits and _, 64 at most.';
}

export type FunnelTone = 'start' | 'good' | 'bad' | 'neutral';

export interface FunnelRow {
  readonly key: string;
  readonly position: number;
  readonly label: string;
  readonly target: string;
  readonly count: string;
  readonly barWidth: string;
  readonly continued: string;
  readonly tone: FunnelTone;
  readonly dropped: string;
}

interface CountedStep {
  readonly step: FunnelStep;
  readonly count: number;
}

export function countedSteps(
  steps: readonly FunnelStep[],
  report: FunnelReport,
): readonly CountedStep[] {
  return steps.map((step, index) => ({ step, count: report.steps[index]?.count ?? 0 }));
}

function continuationTone(continued: number | null): FunnelTone {
  if (continued === null) {
    return 'neutral';
  }
  return continued < CONTINUATION_WARNING ? 'bad' : 'good';
}

export function funnelRows(counted: readonly CountedStep[]): readonly FunnelRow[] {
  const first = counted[0]?.count ?? 0;
  return counted.map(({ step, count }, index) => {
    const previous = counted[index - 1];
    const base = {
      key: `${String(index)}-${step.type}-${stepTarget(step)}`,
      position: index + 1,
      label: stepLabel(step),
      target: stepTarget(step),
      count: formatCount(count),
      barWidth: barWidth(count, first),
    };
    if (previous === undefined) {
      return { ...base, continued: 'Start', tone: 'start', dropped: '' };
    }
    const continued = rate(count, previous.count);
    return {
      ...base,
      continued: `${formatPercent(continued)} continued`,
      tone: continuationTone(continued),
      dropped: `${formatCount(previous.count - count)} dropped`,
    };
  });
}

export interface FunnelFigure {
  readonly value: string;
  readonly note: string;
}

const SUBJECTS: Readonly<Record<FunnelMode, readonly [string, string]>> = {
  visit: ['visit', 'visits'],
  user: ['person', 'people'],
};

export function overallConversion(counted: readonly CountedStep[], mode: FunnelMode): FunnelFigure {
  const first = counted[0]?.count ?? 0;
  const last = counted.at(-1)?.count ?? 0;
  const [singular, plural] = SUBJECTS[mode];
  return {
    value: formatPercent(rate(last, first)),
    note: `${formatCount(last)} of ${formatQuantity(first, singular, plural)} reached the last step`,
  };
}

export function biggestDropOff(counted: readonly CountedStep[]): FunnelFigure {
  const transitions = counted.flatMap((current, index) => {
    const previous = counted[index - 1];
    return previous === undefined
      ? []
      : [{ from: previous.step, to: current.step, continued: rate(current.count, previous.count) }];
  });
  const [worst] = transitions.toSorted(
    (left, right) => (left.continued ?? 1) - (right.continued ?? 1),
  );
  if (worst === undefined) {
    return { value: '—', note: 'No step to compare' };
  }
  return {
    value: `${stepLabel(worst.from)} → ${stepLabel(worst.to)}`,
    note: `${formatPercent(worst.continued)} continued`,
  };
}
