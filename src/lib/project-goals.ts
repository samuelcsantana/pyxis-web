import { cache } from 'react';
import { type Goal, withKnownReachedGoal } from '@/domain/goals';
import type { I18n } from '@/i18n/i18n';
import { createGoalsService } from '@/services/goals/goals-service.factory';
import { readOrSignIn } from './current-admin';

const NO_GOALS: readonly Goal[] = [];

export const projectGoals = cache((projectId: string): Promise<readonly Goal[]> =>
  readOrSignIn(() => createGoalsService().list(projectId)),
);

export interface ReadingWithGoals<Reading> {
  readonly reading: Reading;
  readonly goals: readonly Goal[];
}

interface FilterReading {
  readonly filters: { readonly reachedGoal: string | null };
  readonly problems: readonly string[];
}

export async function withGoalsWhenFiltered<Reading extends FilterReading>(
  projectId: string,
  reading: Reading,
  i18n: I18n,
): Promise<ReadingWithGoals<Reading>> {
  if (reading.filters.reachedGoal === null) {
    return { reading, goals: NO_GOALS };
  }
  const goals = await projectGoals(projectId);
  return { reading: withKnownReachedGoal(reading, goals, i18n), goals };
}
