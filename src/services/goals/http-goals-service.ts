import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type {
  DeleteGoalOutcome,
  Goal,
  GoalChanges,
  GoalsSummary,
  SaveGoalOutcome,
} from '@/domain/goals';
import {
  goalChangesWire,
  goalResponseSchema,
  goalsResponseSchema,
  goalsSummaryResponseSchema,
} from '@/domain/goals.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { type ReportScope, reportQuery } from '../date-range';
import type { IGoalsService } from './goals-service.interface';

export const GOAL_ERROR_CODES = {
  invalid: 'invalid_goal',
  limitReached: 'goal_limit_reached',
  subscriptionRequired: 'subscription_required',
} as const;

function goalsPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/goals`;
}

function goalPath(projectId: string, goalId: string): string {
  return `${goalsPath(projectId)}/${encodeURIComponent(goalId)}`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

function refusedSave(error: unknown): SaveGoalOutcome {
  if (error instanceof ApiNotFoundError) {
    return { kind: 'notFound' };
  }
  if (refusedWith(error, GOAL_ERROR_CODES.invalid)) {
    return { kind: 'invalid' };
  }
  if (refusedWith(error, GOAL_ERROR_CODES.limitReached)) {
    return { kind: 'limitReached' };
  }
  if (refusedWith(error, GOAL_ERROR_CODES.subscriptionRequired)) {
    return { kind: 'subscriptionRequired' };
  }
  throw error;
}

export class HttpGoalsService implements IGoalsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(projectId: string): Promise<readonly Goal[]> {
    return this.reader.get(goalsPath(projectId), goalsResponseSchema);
  }

  summary(projectId: string, scope: ReportScope): Promise<GoalsSummary> {
    return this.reader.get(
      `${goalsPath(projectId)}/summary?${reportQuery({ ...scope, goal: null })}`,
      goalsSummaryResponseSchema,
    );
  }

  async create(projectId: string, changes: GoalChanges): Promise<SaveGoalOutcome> {
    try {
      const goal = await this.writer.post(
        goalsPath(projectId),
        goalChangesWire(changes),
        goalResponseSchema,
      );
      return { kind: 'saved', goal };
    } catch (error) {
      return refusedSave(error);
    }
  }

  async update(projectId: string, goalId: string, changes: GoalChanges): Promise<SaveGoalOutcome> {
    try {
      const goal = await this.writer.patch(
        goalPath(projectId, goalId),
        goalChangesWire(changes),
        goalResponseSchema,
      );
      return { kind: 'saved', goal };
    } catch (error) {
      return refusedSave(error);
    }
  }

  async remove(projectId: string, goalId: string): Promise<DeleteGoalOutcome> {
    try {
      await this.writer.delete(goalPath(projectId, goalId));
      return { kind: 'deleted' };
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return { kind: 'deleted' };
      }
      if (refusedWith(error, GOAL_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      throw error;
    }
  }
}
