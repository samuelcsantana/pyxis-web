import type { I18n } from '@/i18n/i18n';
import type { DrillLink, FunnelMode, FunnelRow } from './funnel';
import { formatCount } from './metrics';
import { shortId } from './timeline';

export const FUNNEL_OUTCOMES = ['reached', 'dropped'] as const;
export type FunnelOutcome = (typeof FUNNEL_OUTCOMES)[number];

const FIRST_STEP = 1;
const FIRST_DROPPABLE_STEP = 2;
const STEP_PATTERN = /^[1-9]\d?$/;

export interface FunnelDrillSearch {
  readonly step?: string | string[];
  readonly outcome?: string | string[];
  readonly cursor?: string | string[];
}

export interface FunnelDrill {
  readonly step: number;
  readonly outcome: FunnelOutcome;
  readonly cursor: string | null;
}

export interface FunnelSubject {
  readonly id: string;
  readonly lastStepAt: string;
}

export interface FunnelSubjectsPage {
  readonly subjects: readonly FunnelSubject[];
  readonly nextCursor: string | null;
}

export interface SubjectRow {
  readonly key: string;
  readonly shown: string;
  readonly label: string;
  readonly href: string;
  readonly reachedAt: string;
  readonly reachedAtText: string;
}

export interface FunnelSubjectsText {
  readonly reachedAt: string;
  readonly order: string;
  readonly older: string;
  readonly newest: string;
  readonly close: string;
  readonly empty: string;
}

export interface FunnelSubjectsView {
  readonly heading: string;
  readonly subjectColumn: string;
  readonly rows: readonly SubjectRow[];
  readonly text: FunnelSubjectsText;
}

type Lookup = Readonly<Record<string, string>>;

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function lowestStep(outcome: FunnelOutcome): number {
  return outcome === 'dropped' ? FIRST_DROPPABLE_STEP : FIRST_STEP;
}

export function funnelDrillOf(search: FunnelDrillSearch, stepCount: number): FunnelDrill | null {
  const stepText = single(search.step) ?? '';
  const outcome = FUNNEL_OUTCOMES.find((candidate) => candidate === single(search.outcome));
  if (outcome === undefined || !STEP_PATTERN.test(stepText)) {
    return null;
  }
  const step = Number(stepText);
  if (step < lowestStep(outcome) || step > stepCount) {
    return null;
  }
  const cursor = single(search.cursor) ?? '';
  return { step, outcome, cursor: cursor === '' ? null : cursor };
}

export function drillParameters(step: number, outcome: FunnelOutcome): Lookup {
  return { step: String(step), outcome };
}

export function drillCount(
  counts: readonly number[],
  step: number,
  outcome: FunnelOutcome,
): number {
  const reached = counts[step - 1] ?? 0;
  return outcome === 'reached' ? reached : (counts[step - 2] ?? 0) - reached;
}

function isCurrent(drill: FunnelDrill | null, step: number, outcome: FunnelOutcome): boolean {
  return drill?.step === step && drill.outcome === outcome;
}

function reachedLink(
  counts: readonly number[],
  step: number,
  link: (step: number, outcome: FunnelOutcome) => Omit<DrillLink, 'label'>,
  i18n: I18n,
): DrillLink {
  return {
    ...link(step, 'reached'),
    label: i18n.t('funnel.subjects.reachedLink', {
      count: formatCount(drillCount(counts, step, 'reached'), i18n),
      step: String(step),
    }),
  };
}

function droppedLink(
  counts: readonly number[],
  step: number,
  link: (step: number, outcome: FunnelOutcome) => Omit<DrillLink, 'label'>,
  i18n: I18n,
): DrillLink | null {
  if (step < FIRST_DROPPABLE_STEP) {
    return null;
  }
  return {
    ...link(step, 'dropped'),
    label: i18n.t('funnel.subjects.droppedLink', {
      dropped: i18n.t('funnel.dropped', {
        count: formatCount(drillCount(counts, step, 'dropped'), i18n),
      }),
      step: String(step),
    }),
  };
}

export function withDrillLinks(
  rows: readonly FunnelRow[],
  counts: readonly number[],
  drill: FunnelDrill | null,
  hrefOf: (step: number, outcome: FunnelOutcome) => string,
  i18n: I18n,
): readonly FunnelRow[] {
  const link = (step: number, outcome: FunnelOutcome) => ({
    href: hrefOf(step, outcome),
    current: isCurrent(drill, step, outcome),
  });
  return rows.map((row, index) => ({
    ...row,
    reachedLink: reachedLink(counts, index + 1, link, i18n),
    droppedLink: droppedLink(counts, index + 1, link, i18n),
  }));
}

function subjectsText(mode: FunnelMode, count: number, i18n: I18n): string {
  return mode === 'visit' ? i18n.t('counts.visit', { count }) : i18n.t('counts.person', { count });
}

export function drillHeading(
  counts: readonly number[],
  drill: FunnelDrill,
  mode: FunnelMode,
  i18n: I18n,
): string {
  const count = drillCount(counts, drill.step, drill.outcome);
  const subjects = subjectsText(mode, count, i18n);
  const step = String(drill.step);
  return drill.outcome === 'reached'
    ? i18n.t('funnel.subjects.reached', { count, subjects, step })
    : i18n.t('funnel.subjects.dropped', {
        count,
        subjects,
        step,
        previous: String(drill.step - 1),
      });
}

function subjectRow(
  subject: FunnelSubject,
  mode: FunnelMode,
  timelineHref: (lookup: Lookup) => string,
  reachedAtText: (date: Date) => string,
  i18n: I18n,
): SubjectRow {
  const common = {
    key: subject.id,
    reachedAt: subject.lastStepAt,
    reachedAtText: reachedAtText(new Date(subject.lastStepAt)),
  };
  if (mode === 'visit') {
    const shown = shortId(subject.id);
    return {
      ...common,
      shown,
      label: i18n.t('funnel.subjects.openVisit', { visit: shown }),
      href: timelineHref({ visit: subject.id }),
    };
  }
  return {
    ...common,
    shown: subject.id,
    label: i18n.t('funnel.subjects.openPerson', { user: subject.id }),
    href: timelineHref({ user: subject.id }),
  };
}

export function funnelSubjectsView(
  page: FunnelSubjectsPage,
  heading: string,
  mode: FunnelMode,
  timeZone: string,
  timelineHref: (lookup: Lookup) => string,
  i18n: I18n,
): FunnelSubjectsView {
  const reachedAtText = i18n.format.dateTime('visitStart', timeZone);
  return {
    heading,
    subjectColumn:
      mode === 'visit'
        ? i18n.t('funnel.subjects.columns.visit')
        : i18n.t('funnel.subjects.columns.person'),
    rows: page.subjects.map((subject) =>
      subjectRow(subject, mode, timelineHref, reachedAtText, i18n),
    ),
    text: {
      reachedAt: i18n.t('funnel.subjects.columns.reachedAt'),
      order: i18n.t('funnel.subjects.order'),
      older: i18n.t('funnel.subjects.older'),
      newest: i18n.t('funnel.subjects.newest'),
      close: i18n.t('funnel.subjects.close'),
      empty: i18n.t('funnel.subjects.empty'),
    },
  };
}
