import type { I18n } from '@/i18n/i18n';
import { EVENT_NAME_PATTERN, MAX_PATH_LENGTH } from './funnel';
import { GOAL_PARAMETER } from './goal-parameters';
import { formatCount, formatPercent } from './metrics';

export const MAX_GOALS = 10;
export const MAX_GOAL_NAME_LENGTH = 64;
export const MAX_GOAL_PATH_LENGTH = MAX_PATH_LENGTH;
export const GOAL_KINDS = ['event', 'page'] as const;

const PATH_START = '/';
const SHORT_ID_LENGTH = 8;

export type GoalKind = (typeof GOAL_KINDS)[number];

export interface Goal {
  readonly id: string;
  readonly name: string;
  readonly kind: GoalKind;
  readonly target: string;
  readonly position: number;
}

export interface GoalSummary extends Goal {
  readonly conversions: number;
  readonly convertingVisits: number;
  readonly conversionRate: number | null;
}

export interface GoalsSummary {
  readonly visits: number;
  readonly goals: readonly GoalSummary[];
}

export interface GoalDraft {
  readonly name: string;
  readonly kind: GoalKind;
  readonly target: string;
}

export type GoalChanges = GoalDraft;

export type GoalNameProblem = 'missing' | 'tooLong';
export type GoalTargetProblem = 'eventName' | 'pathStart' | 'pathLength';

export interface GoalDraftProblems {
  readonly name?: GoalNameProblem;
  readonly target?: GoalTargetProblem;
}

export type SaveGoalOutcome =
  | { readonly kind: 'saved'; readonly goal: Goal }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'limitReached' }
  | { readonly kind: 'notFound' }
  | { readonly kind: 'subscriptionRequired' };

export type DeleteGoalOutcome =
  { readonly kind: 'deleted' } | { readonly kind: 'subscriptionRequired' };

export function canAddGoal(goals: readonly Goal[]): boolean {
  return goals.length < MAX_GOALS;
}

export function goalById(goals: readonly Goal[], id: string | null): Goal | null {
  return id === null ? null : (goals.find((goal) => goal.id === id) ?? null);
}

function nameProblem(name: string): GoalNameProblem | undefined {
  const trimmed = name.trim();
  if (trimmed === '') {
    return 'missing';
  }
  return trimmed.length > MAX_GOAL_NAME_LENGTH ? 'tooLong' : undefined;
}

function targetProblem(kind: GoalKind, target: string): GoalTargetProblem | undefined {
  const trimmed = target.trim();
  if (kind === 'event') {
    return EVENT_NAME_PATTERN.test(trimmed) ? undefined : 'eventName';
  }
  if (!trimmed.startsWith(PATH_START)) {
    return 'pathStart';
  }
  return trimmed.length > MAX_GOAL_PATH_LENGTH ? 'pathLength' : undefined;
}

export function goalDraftProblems(draft: GoalDraft): GoalDraftProblems {
  const name = nameProblem(draft.name);
  const target = targetProblem(draft.kind, draft.target);
  return {
    ...(name === undefined ? {} : { name }),
    ...(target === undefined ? {} : { target }),
  };
}

export function hasGoalProblems(problems: GoalDraftProblems): boolean {
  return problems.name !== undefined || problems.target !== undefined;
}

export function goalChangesOf(draft: GoalDraft): GoalChanges {
  return { name: draft.name.trim(), kind: draft.kind, target: draft.target.trim() };
}

export function goalDraftOf(goal: Goal): GoalDraft {
  return { name: goal.name, kind: goal.kind, target: goal.target };
}

export const EMPTY_GOAL_DRAFT: GoalDraft = { name: '', kind: 'event', target: '' };

export function withSavedGoal(goals: readonly Goal[], saved: Goal): readonly Goal[] {
  const kept = goals.some((goal) => goal.id === saved.id)
    ? goals.map((goal) => (goal.id === saved.id ? saved : goal))
    : [...goals, saved];
  return kept.toSorted((first, second) => first.position - second.position);
}

export function withoutGoal(goals: readonly Goal[], goalId: string): readonly Goal[] {
  return goals.filter((goal) => goal.id !== goalId);
}

function shortGoalId(id: string): string {
  return id.slice(0, SHORT_ID_LENGTH);
}

export function goalNameOf(goals: readonly Goal[], id: string): string {
  return goalById(goals, id)?.name ?? shortGoalId(id);
}

export interface ChosenGoal {
  readonly goal: Goal | null;
  readonly askedId: string | null;
  readonly problem: string | null;
}

export function chosenGoal(
  goals: readonly Goal[],
  typed: string | string[] | undefined,
  i18n: I18n,
): ChosenGoal {
  const first = goals[0] ?? null;
  const text = typeof typed === 'string' ? typed.trim() : '';
  if (text === '') {
    return { goal: first, askedId: null, problem: null };
  }
  const asked = goalById(goals, text);
  return asked === null
    ? { goal: first, askedId: null, problem: i18n.t('goals.problems.unknownGoal') }
    : { goal: asked, askedId: asked.id, problem: null };
}

export type GoalChoice =
  | { readonly kind: 'none' }
  | { readonly kind: 'single'; readonly name: string }
  | {
      readonly kind: 'picker';
      readonly goals: readonly Pick<Goal, 'id' | 'name'>[];
      readonly selected: string;
      readonly first: string;
    };

export function goalChoiceOf(goals: readonly Goal[], chosen: ChosenGoal): GoalChoice {
  const [first, second] = goals;
  if (chosen.goal === null || first === undefined) {
    return { kind: 'none' };
  }
  if (second === undefined) {
    return { kind: 'single', name: chosen.goal.name };
  }
  return {
    kind: 'picker',
    goals: goals.map(({ id, name }) => ({ id, name })),
    selected: chosen.goal.id,
    first: first.id,
  };
}

export function goalQuery(chosen: ChosenGoal): Readonly<Record<string, string>> {
  return chosen.askedId === null ? {} : { [GOAL_PARAMETER]: chosen.askedId };
}

export interface GoalRow {
  readonly id: string;
  readonly name: string;
  readonly target: string;
  readonly kind: GoalKind;
  readonly conversions: string;
  readonly convertingVisits: string;
  readonly rate: string;
  readonly share: number;
  readonly reached: boolean;
}

export function goalRows(summary: GoalsSummary, i18n: I18n): readonly GoalRow[] {
  return summary.goals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    target: goal.target,
    kind: goal.kind,
    conversions: formatCount(goal.conversions, i18n),
    convertingVisits: formatCount(goal.convertingVisits, i18n),
    rate: formatPercent(goal.conversionRate, i18n),
    share: goal.conversionRate ?? 0,
    reached: goal.convertingVisits > 0,
  }));
}

interface ReachedGoalReading {
  readonly filters: { readonly reachedGoal: string | null };
  readonly problems: readonly string[];
}

export function withKnownReachedGoal<Reading extends ReachedGoalReading>(
  reading: Reading,
  goals: readonly Goal[],
  i18n: I18n,
): Reading {
  const { reachedGoal } = reading.filters;
  if (reachedGoal === null || goalById(goals, reachedGoal) !== null) {
    return reading;
  }
  return {
    ...reading,
    filters: { ...reading.filters, reachedGoal: null },
    problems: [...reading.problems, i18n.t('goals.problems.unknownReachedGoal')],
  };
}
