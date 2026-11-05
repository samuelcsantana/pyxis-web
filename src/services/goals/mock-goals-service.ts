import {
  canAddGoal,
  type DeleteGoalOutcome,
  type Goal,
  type GoalChanges,
  goalById,
  type GoalsSummary,
  type SaveGoalOutcome,
} from '@/domain/goals';
import {
  goalResponseSchema,
  goalsResponseSchema,
  goalsSummaryResponseSchema,
} from '@/domain/goals.schema';
import type { ReportScope } from '../date-range';
import { demoGoalsSummaryWire, demoGoalsWire, demoGoalWire } from '../demo/demo-goals';
import { demoProjectOf } from '../demo/demo-projects';
import type { IGoalsService } from './goals-service.interface';

export const DEMO_CREATED_GOAL_ID = 'd3a4b5c6-7d8e-4f90-8a1b-2c3d4e5f6a7b';

function nextPosition(goals: readonly Goal[]): number {
  return Math.max(0, ...goals.map((goal) => goal.position)) + 1;
}

function saved(goal: Goal): SaveGoalOutcome {
  return { kind: 'saved', goal: goalResponseSchema.parse(demoGoalWire(goal)) };
}

export type DemoGoalsOf = (projectId: string) => readonly Goal[];

const DEMO_GOALS_OF: DemoGoalsOf = (projectId) => demoProjectOf(projectId).goals;

export class MockGoalsService implements IGoalsService {
  constructor(
    private readonly now: () => Date = () => new Date(),
    private readonly goalsOf: DemoGoalsOf = DEMO_GOALS_OF,
  ) {}

  list(projectId: string): Promise<readonly Goal[]> {
    return Promise.resolve(goalsResponseSchema.parse(demoGoalsWire(projectId)));
  }

  summary(projectId: string, scope: ReportScope): Promise<GoalsSummary> {
    return Promise.resolve(
      goalsSummaryResponseSchema.parse(demoGoalsSummaryWire(projectId, scope, this.now())),
    );
  }

  create(projectId: string, changes: GoalChanges): Promise<SaveGoalOutcome> {
    const goals = this.goalsOf(projectId);
    return Promise.resolve(
      canAddGoal(goals)
        ? saved({ id: DEMO_CREATED_GOAL_ID, ...changes, position: nextPosition(goals) })
        : { kind: 'limitReached' },
    );
  }

  update(projectId: string, goalId: string, changes: GoalChanges): Promise<SaveGoalOutcome> {
    const goal = goalById(this.goalsOf(projectId), goalId);
    return Promise.resolve(goal === null ? { kind: 'notFound' } : saved({ ...goal, ...changes }));
  }

  remove(): Promise<DeleteGoalOutcome> {
    return Promise.resolve({ kind: 'deleted' });
  }
}
