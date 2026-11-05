import type {
  DeleteGoalOutcome,
  Goal,
  GoalChanges,
  GoalsSummary,
  SaveGoalOutcome,
} from '@/domain/goals';
import type { ReportScope } from '../date-range';

export interface IGoalsService {
  list(projectId: string): Promise<readonly Goal[]>;
  summary(projectId: string, scope: ReportScope): Promise<GoalsSummary>;
  create(projectId: string, changes: GoalChanges): Promise<SaveGoalOutcome>;
  update(projectId: string, goalId: string, changes: GoalChanges): Promise<SaveGoalOutcome>;
  remove(projectId: string, goalId: string): Promise<DeleteGoalOutcome>;
}
