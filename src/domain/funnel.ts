import type { I18n } from '@/i18n/i18n';
import { eventLabel, formatCount, formatPercent, rate, barWidth } from './metrics';
import type { FunnelStep, FunnelStepType, FunnelReport, FunnelWire } from './funnel.schema';

export type { FunnelStep, FunnelStepType, FunnelReport, FunnelWire };

export const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
export const MAX_PATH_LENGTH = 256;
export const MIN_FUNNEL_STEPS = 2;
export const MAX_FUNNEL_STEPS = 8;
export const FUNNEL_MODES = ['visit', 'user'] as const;
export type FunnelMode = (typeof FUNNEL_MODES)[number];
export const DEFAULT_FUNNEL_MODE: FunnelMode = 'visit';
const CONTINUATION_WARNING = 0.5;

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

export function stepsTextOf(search: FunnelSearch): string | undefined {
  return single(search.steps);
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

export function isCountableFunnel(steps: readonly FunnelStep[]): boolean {
  return (
    steps.length >= MIN_FUNNEL_STEPS &&
    steps.length <= MAX_FUNNEL_STEPS &&
    steps.every((step) => stepProblem(step) === null)
  );
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

export function funnelRows(counted: readonly CountedStep[], i18n: I18n): readonly FunnelRow[] {
  const first = counted[0]?.count ?? 0;
  return counted.map(({ step, count }, index) => {
    const previous = counted[index - 1];
    const base = {
      key: `${String(index)}-${step.type}-${stepTarget(step)}`,
      position: index + 1,
      label: stepLabel(step),
      target: stepTarget(step),
      count: formatCount(count, i18n),
      barWidth: barWidth(count, first),
    };
    if (previous === undefined) {
      return { ...base, continued: 'Start', tone: 'start', dropped: '' };
    }
    const continued = rate(count, previous.count);
    return {
      ...base,
      continued: `${formatPercent(continued, i18n)} continued`,
      tone: continuationTone(continued),
      dropped: `${formatCount(previous.count - count, i18n)} dropped`,
    };
  });
}

export interface FunnelFigure {
  readonly value: string;
  readonly note: string;
}

const SUBJECTS = { visit: 'counts.visit', user: 'counts.person' } as const satisfies Readonly<
  Record<FunnelMode, string>
>;

export function overallConversion(
  counted: readonly CountedStep[],
  mode: FunnelMode,
  i18n: I18n,
): FunnelFigure {
  const first = counted[0]?.count ?? 0;
  const last = counted.at(-1)?.count ?? 0;
  const subjects = i18n.t(SUBJECTS[mode], { count: first });
  return {
    value: formatPercent(rate(last, first), i18n),
    note: `${formatCount(last, i18n)} of ${subjects} reached the last step`,
  };
}

export function biggestDropOff(counted: readonly CountedStep[], i18n: I18n): FunnelFigure {
  const transitions = counted.flatMap((current, index) => {
    const previous = counted[index - 1];
    return previous === undefined
      ? []
      : [
          {
            position: index + 1,
            from: previous.step,
            to: current.step,
            continued: rate(current.count, previous.count),
          },
        ];
  });
  const [worst] = transitions.toSorted(
    (left, right) => (left.continued ?? 1) - (right.continued ?? 1),
  );
  if (worst === undefined) {
    return { value: '—', note: 'No step to compare' };
  }
  return {
    value: `Step ${String(worst.position - 1)} → ${String(worst.position)}`,
    note: `${stepLabel(worst.from)} → ${stepLabel(worst.to)} · ${formatPercent(worst.continued, i18n)} continued`,
  };
}
