export const GOAL_PARAMETER = 'goal';

const GOAL_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isGoalId(text: string): boolean {
  return GOAL_ID_PATTERN.test(text);
}

export function askedGoalId(typed: string | string[] | undefined): string | null {
  const text = typeof typed === 'string' ? typed.trim() : '';
  return isGoalId(text) ? text : null;
}

export function withChosenGoal(query: string, goalId: string, firstGoalId: string): string {
  const parameters = new URLSearchParams(query);
  if (goalId === firstGoalId) {
    parameters.delete(GOAL_PARAMETER);
  } else {
    parameters.set(GOAL_PARAMETER, goalId);
  }
  return parameters.toString();
}
