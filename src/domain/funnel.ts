import type { I18n } from '@/i18n/i18n';
import type { ClientSourceMessages } from '@/i18n/messages';
import type { Translator } from '@/i18n/translate';
import { eventLabel, formatCount, formatPercent, rate, barWidth } from './metrics';
import { formatSeconds } from './timeline';
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

export function stepLabel(step: FunnelStep, i18n: I18n): string {
  return step.type === 'page'
    ? i18n.t('funnel.openedPage', { path: step.path })
    : eventLabel(step.name);
}

type StepProblem = 'path-start' | 'path-length' | 'event-name';

function problemOf(step: FunnelStep): StepProblem | null {
  if (step.type === 'page') {
    if (!step.path.startsWith('/')) {
      return 'path-start';
    }
    return step.path.length > MAX_PATH_LENGTH ? 'path-length' : null;
  }
  return EVENT_NAME_PATTERN.test(step.name) ? null : 'event-name';
}

export function stepProblem(step: FunnelStep, t: Translator<ClientSourceMessages>): string | null {
  switch (problemOf(step)) {
    case 'path-start':
      return t('funnelEditor.problems.pathStart');
    case 'path-length':
      return t('funnelEditor.problems.pathLength', { max: String(MAX_PATH_LENGTH) });
    case 'event-name':
      return t('funnelEditor.problems.eventName');
    case null:
      return null;
  }
}

export function isCountableFunnel(steps: readonly FunnelStep[]): boolean {
  return (
    steps.length >= MIN_FUNNEL_STEPS &&
    steps.length <= MAX_FUNNEL_STEPS &&
    steps.every((step) => problemOf(step) === null)
  );
}

export type FunnelTone = 'start' | 'good' | 'bad' | 'neutral';

export interface DrillLink {
  readonly href: string;
  readonly label: string;
  readonly current: boolean;
}

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
  readonly time: string | null;
  readonly reachedLink: DrillLink | null;
  readonly droppedLink: DrillLink | null;
}

interface CountedStep {
  readonly step: FunnelStep;
  readonly count: number;
  readonly secondsFromPrevious: number | null;
}

interface StepCounts {
  readonly steps: readonly {
    readonly count: number;
    readonly medianSecondsFromPrevious?: number | null;
  }[];
}

export function countedSteps(
  steps: readonly FunnelStep[],
  report: StepCounts,
): readonly CountedStep[] {
  return steps.map((step, index) => ({
    step,
    count: report.steps[index]?.count ?? 0,
    secondsFromPrevious: report.steps[index]?.medianSecondsFromPrevious ?? null,
  }));
}

function medianTime(seconds: number | null, i18n: I18n): string | null {
  return seconds === null
    ? null
    : i18n.t('funnel.medianTime', { duration: formatSeconds(seconds, i18n) });
}

function continuationTone(continued: number | null): FunnelTone {
  if (continued === null) {
    return 'neutral';
  }
  return continued < CONTINUATION_WARNING ? 'bad' : 'good';
}

export function funnelRows(counted: readonly CountedStep[], i18n: I18n): readonly FunnelRow[] {
  const first = counted[0]?.count ?? 0;
  return counted.map(({ step, count, secondsFromPrevious }, index) => {
    const previous = counted[index - 1];
    const base = {
      key: `${String(index)}-${step.type}-${stepTarget(step)}`,
      position: index + 1,
      label: stepLabel(step, i18n),
      target: stepTarget(step),
      count: formatCount(count, i18n),
      barWidth: barWidth(count, first),
      time: medianTime(secondsFromPrevious, i18n),
      reachedLink: null,
      droppedLink: null,
    };
    if (previous === undefined) {
      return { ...base, continued: i18n.t('funnel.start'), tone: 'start', dropped: '' };
    }
    const continued = rate(count, previous.count);
    return {
      ...base,
      continued: i18n.t('funnel.continued', { share: formatPercent(continued, i18n) }),
      tone: continuationTone(continued),
      dropped: i18n.t('funnel.dropped', { count: formatCount(previous.count - count, i18n) }),
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
    note: i18n.t('funnel.reachedLastStep', { reached: formatCount(last, i18n), subjects }),
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
    return { value: '—', note: i18n.t('funnel.noStepToCompare') };
  }
  return {
    value: i18n.t('funnel.transition', {
      from: String(worst.position - 1),
      to: String(worst.position),
    }),
    note: i18n.t('funnel.transitionNote', {
      from: stepLabel(worst.from, i18n),
      to: stepLabel(worst.to, i18n),
      share: formatPercent(worst.continued, i18n),
    }),
  };
}

export function timeToFinish(
  seconds: number | null,
  steps: number,
  i18n: I18n,
): FunnelFigure | null {
  return seconds === null
    ? null
    : {
        value: formatSeconds(seconds, i18n),
        note: i18n.t('funnel.timeToFinishNote', { last: String(steps) }),
      };
}
