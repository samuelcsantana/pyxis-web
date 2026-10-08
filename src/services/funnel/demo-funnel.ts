import {
  type FunnelMode,
  type FunnelReport,
  type FunnelStep,
  type FunnelWire,
} from '@/domain/funnel';
import { funnelResponseSchema } from '@/domain/funnel.schema';
import type { DateRange } from '../date-range';
import { DEMO_STORE, demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from '../demo/demo-records';
import { itemAt } from '../demo/demo-random';
import {
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  isPageView,
  pathPattern,
  percentile,
} from '../demo/demo-scope';

export const DEMO_FUNNEL_STEPS: readonly FunnelStep[] = DEMO_STORE.exampleFunnel;

const MEDIAN = 0.5;
const MILLISECONDS_PER_SECOND = 1000;

export interface DemoFunnelSubject {
  readonly id: string;
  readonly reached: readonly number[];
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

function stepTimes(
  events: readonly DemoEventRecord[],
  matchers: readonly ((event: DemoEventRecord) => boolean)[],
): readonly number[] {
  return matchers.reduce<readonly number[]>((times, matches, index) => {
    if (times.length < index) {
      return times;
    }
    const after = times.at(-1) ?? Number.NEGATIVE_INFINITY;
    const reached = events.find((event) => event.at >= after && matches(event));
    return reached === undefined ? times : [...times, reached.at];
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
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): readonly DemoFunnelSubject[] {
  const matchers = steps.map(matcherOf);
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now));
  return [...subjectsOf(visits, mode)].map(([id, owned]) => ({
    id,
    reached: stepTimes(
      owned.flatMap((visit) => visit.events).toSorted((first, second) => first.at - second.at),
      matchers,
    ),
  }));
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
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): FunnelWire {
  const subjects = demoFunnelSubjects(projectId, range, mode, steps, now);
  return {
    steps: steps.map((_, index) => ({
      count: subjects.filter((subject) => subject.reached.length > index).length,
      median_seconds_from_previous:
        index === 0 ? null : medianSeconds(gapsBetween(subjects, index, index - 1)),
    })),
    median_seconds_overall: medianSeconds(gapsBetween(subjects, steps.length - 1, 0)),
  };
}

export function demoFunnelReport(
  projectId: string,
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
  now: Date,
): FunnelReport {
  return funnelResponseSchema.parse(demoFunnelWire(projectId, range, mode, steps, now));
}
