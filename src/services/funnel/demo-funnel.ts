import {
  type FunnelMode,
  type FunnelReport,
  type FunnelStep,
  type FunnelWire,
} from '@/domain/funnel';
import type { FunnelSegmentDimension } from '@/domain/funnel-segments';
import type { FunnelDrill } from '@/domain/funnel-subjects';
import { type FunnelSubjectsWire, funnelResponseSchema } from '@/domain/funnel.schema';
import { DEMO_STORE, demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from '../demo/demo-records';
import { itemAt } from '../demo/demo-random';
import {
  byKeys,
  demoRevenueOf,
  demoRoundedRevenue,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  isPageView,
  pathPattern,
  percentile,
  type DemoReportRange,
} from '../demo/demo-scope';

export const DEMO_FUNNEL_STEPS: readonly FunnelStep[] = DEMO_STORE.exampleFunnel;

export const FUNNEL_SUBJECTS_PER_PAGE = 50;
const MEDIAN = 0.5;
const MILLISECONDS_PER_SECOND = 1000;
const CURSOR_SEPARATOR = '~';

export interface DemoFunnelSubject {
  readonly id: string;
  readonly reached: readonly number[];
  readonly revenues: readonly number[];
}

export function demoExampleFunnel(projectId: string): readonly FunnelStep[] {
  return demoProjectOf(projectId).exampleFunnel;
}

function matcherOf(step: FunnelStep): (event: DemoEventRecord) => boolean {
  if (step.type === 'event') {
    return (event) => event.name === step.name;
  }
  const pattern = pathPattern(step.path);
  return (event) => isPageView(event) && pattern.test(event.path);
}

function stepEvents(
  events: readonly DemoEventRecord[],
  matchers: readonly ((event: DemoEventRecord) => boolean)[],
): readonly DemoEventRecord[] {
  return matchers.reduce<readonly DemoEventRecord[]>((reached, matches, index) => {
    if (reached.length < index) {
      return reached;
    }
    const after = reached.at(-1)?.at ?? Number.NEGATIVE_INFINITY;
    const next = events.find((event) => event.at >= after && matches(event));
    return next === undefined ? reached : [...reached, next];
  }, []);
}

function subjectsOf(
  visits: readonly DemoVisitRecord[],
  mode: FunnelMode,
): ReadonlyMap<string, readonly DemoVisitRecord[]> {
  if (mode === 'visit') {
    return groupedBy(visits, (visit) => visit.sessionId);
  }
  return groupedBy(
    visits.filter((visit) => visit.userId !== null),
    (visit) => String(visit.userId),
  );
}

export function demoFunnelSubjects(
  projectId: string,
  range: DemoReportRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): readonly DemoFunnelSubject[] {
  const matchers = steps.map(matcherOf);
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now, range.filters));
  return [...subjectsOf(visits, mode)].map(([id, owned]) => {
    const reached = stepEvents(
      owned.flatMap((visit) => visit.events).toSorted((first, second) => first.at - second.at),
      matchers,
    );
    return {
      id,
      reached: reached.map((event) => event.at),
      revenues: reached.map(demoRevenueOf),
    };
  });
}

function medianSeconds(gaps: readonly number[]): number | null {
  const median = percentile(gaps, MEDIAN);
  return median === null ? null : Math.round(median / MILLISECONDS_PER_SECOND);
}

function gapsBetween(
  subjects: readonly DemoFunnelSubject[],
  later: number,
  earlier: number,
): readonly number[] {
  return subjects
    .filter((subject) => subject.reached.length > later)
    .map((subject) => itemAt(subject.reached, later) - itemAt(subject.reached, earlier));
}

export function demoFunnelWire(
  projectId: string,
  range: DemoReportRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): FunnelWire {
  const subjects = demoFunnelSubjects(projectId, range, mode, steps, now);
  return {
    steps: steps.map((step, index) => ({
      count: subjects.filter((subject) => subject.reached.length > index).length,
      median_seconds_from_previous:
        index === 0 ? null : medianSeconds(gapsBetween(subjects, index, index - 1)),
      revenue:
        step.type === 'page'
          ? null
          : demoRoundedRevenue(
              subjects.reduce((total, subject) => total + (subject.revenues[index] ?? 0), 0),
            ),
    })),
    median_seconds_overall: medianSeconds(gapsBetween(subjects, steps.length - 1, 0)),
  };
}

function segmentOf(visits: readonly DemoVisitRecord[], by: FunnelSegmentDimension): string {
  const visit = itemAt(visits, 0);
  return by === 'device' ? visit.deviceType : visit.channel;
}

export function demoFunnelSegmentsWire(
  projectId: string,
  range: DemoReportRange,
  steps: readonly FunnelStep[],
  by: FunnelSegmentDimension,
  now: Date,
) {
  const matchers = steps.map(matcherOf);
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now, range.filters));
  const reached = [...groupedBy(visits, (visit) => visit.sessionId).values()]
    .map((owned) => ({
      segment: segmentOf(owned, by),
      reached: stepEvents(
        owned.flatMap((visit) => visit.events).toSorted((first, second) => first.at - second.at),
        matchers,
      ),
    }))
    .filter((subject) => subject.reached.length > 0);
  const segments = [...groupedBy(reached, (subject) => subject.segment)].map(
    ([segment, subjects]) => ({
      segment,
      steps: steps.map(
        (_, index) => subjects.filter((subject) => subject.reached.length > index).length,
      ),
    }),
  );
  return {
    by,
    segments: segments.toSorted(byKeys((row) => [-itemAt(row.steps, 0), row.segment])),
  };
}

export function demoFunnelReport(
  projectId: string,
  range: DemoReportRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): FunnelReport {
  return funnelResponseSchema.parse(demoFunnelWire(projectId, range, mode, steps, now));
}

interface RankedSubject {
  readonly id: string;
  readonly at: number;
}

const newestFirst = byKeys<RankedSubject>((subject) => [-subject.at, subject.id]);

function cursorOf(subject: RankedSubject): string {
  return `${String(subject.at)}${CURSOR_SEPARATOR}${subject.id}`;
}

function afterCursor(cursor: string | null): (subject: RankedSubject) => boolean {
  if (cursor === null) {
    return () => true;
  }
  const separator = cursor.indexOf(CURSOR_SEPARATOR);
  const last = { at: Number(cursor.slice(0, separator)), id: cursor.slice(separator + 1) };
  return (subject) => newestFirst(subject, last) > 0;
}

function isBehind(subject: DemoFunnelSubject, drill: FunnelDrill): boolean {
  return drill.outcome === 'reached'
    ? subject.reached.length >= drill.step
    : subject.reached.length === drill.step - 1;
}

function lastStepIndex(drill: FunnelDrill): number {
  return drill.outcome === 'reached' ? drill.step - 1 : drill.step - 2;
}

export function demoFunnelSubjectsWire(
  projectId: string,
  range: DemoReportRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  drill: FunnelDrill,
  now: Date,
): FunnelSubjectsWire {
  const ranked = demoFunnelSubjects(projectId, range, mode, steps, now)
    .filter((subject) => isBehind(subject, drill))
    .map((subject) => ({ id: subject.id, at: itemAt(subject.reached, lastStepIndex(drill)) }))
    .toSorted(newestFirst)
    .filter(afterCursor(drill.cursor));
  const page = ranked.slice(0, FUNNEL_SUBJECTS_PER_PAGE);
  return {
    subjects: page.map((subject) => ({
      id: subject.id,
      last_step_at: new Date(subject.at).toISOString(),
    })),
    next_cursor:
      ranked.length > FUNNEL_SUBJECTS_PER_PAGE
        ? cursorOf(itemAt(page, FUNNEL_SUBJECTS_PER_PAGE - 1))
        : null,
    timezone: demoProjectOf(projectId).timezone,
  };
}
