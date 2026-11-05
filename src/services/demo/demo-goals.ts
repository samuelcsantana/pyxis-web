import { goalById, type Goal } from '@/domain/goals';
import type { DateRange } from '../date-range';
import type { DemoProject } from './demo-catalog';
import { demoProjectOf } from './demo-projects';
import type { DemoVisitRecord } from './demo-records';
import {
  countWhere,
  type DemoGoalTest,
  demoGoalTest,
  type DemoReportRange,
  demoScopeOf,
  demoVisitsIn,
  hasPageView,
} from './demo-scope';

export const DEMO_GOAL_CREATED_AT = '2025-01-06T08:00:00.000Z';

export function demoCountedGoal(project: DemoProject, goalId?: string | null): Goal | null {
  return goalById(project.goals, goalId ?? null) ?? project.goals[0] ?? null;
}

export function demoConversionTest(
  project: DemoProject,
  goalId?: string | null,
): DemoGoalTest | null {
  const goal = demoCountedGoal(project, goalId);
  return goal === null ? null : demoGoalTest(goal);
}

export function demoGoalWire(goal: Goal) {
  return {
    id: goal.id,
    name: goal.name,
    type: goal.kind,
    event: goal.kind === 'event' ? goal.target : null,
    path: goal.kind === 'page' ? goal.target : null,
    position: goal.position,
    created_at: DEMO_GOAL_CREATED_AT,
  };
}

export function demoGoalsWire(projectId: string) {
  return { goals: demoProjectOf(projectId).goals.map(demoGoalWire) };
}

function summaryOf(project: DemoProject, visits: readonly DemoVisitRecord[]) {
  const counted = countWhere(visits, hasPageView);
  const events = visits.flatMap((visit) => visit.events);
  return {
    visits: counted,
    goals: project.goals.map((goal) => {
      const test = demoGoalTest(goal);
      const convertingVisits = countWhere(visits, (visit) => visit.events.some(test));
      return {
        ...demoGoalWire(goal),
        conversions: countWhere(events, test),
        converting_visits: convertingVisits,
        conversion_rate: counted === 0 ? null : convertingVisits / counted,
      };
    }),
  };
}

export function demoGoalsSummaryWire(projectId: string, range: DemoReportRange, now: Date) {
  const project = demoProjectOf(projectId);
  const scope: DateRange = { from: range.from, to: range.to };
  return summaryOf(project, demoVisitsIn(project, demoScopeOf(scope, now, range.filters)));
}
