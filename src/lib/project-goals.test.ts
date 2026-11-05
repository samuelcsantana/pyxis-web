import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import type { Goal } from '@/domain/goals';
import { english } from '@/test-utils/english';
import { projectGoals, withGoalsWhenFiltered } from './project-goals';

const GOAL: Goal = {
  id: '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b',
  name: 'Sign-up',
  kind: 'event',
  target: 'signup_completed',
  position: 1,
};

const state = vi.hoisted(() => ({ list: vi.fn<(projectId: string) => Promise<unknown>>() }));

vi.mock('@/services/goals/goals-service.factory', () => ({
  createGoalsService: () => ({ list: (projectId: string) => state.list(projectId) }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

beforeEach(() => {
  state.list.mockReset();
  state.list.mockResolvedValue([GOAL]);
});

describe('projectGoals', () => {
  it('reads the goals of the project', async () => {
    await expect(projectGoals('p1')).resolves.toEqual([GOAL]);
    expect(state.list).toHaveBeenCalledWith('p1');
  });
});

describe('withGoalsWhenFiltered', () => {
  const reading = (reachedGoal: string | null) => ({
    filters: { ...NO_DASHBOARD_FILTERS, reachedGoal },
    problems: [],
  });

  it('reads no goal while no reached goal is asked for', async () => {
    const unfiltered = reading(null);

    await expect(withGoalsWhenFiltered('p1', unfiltered, english)).resolves.toEqual({
      reading: unfiltered,
      goals: [],
    });
    expect(state.list).not.toHaveBeenCalled();
  });

  it('keeps a goal the project has and gives the goals to name it', async () => {
    await expect(withGoalsWhenFiltered('p1', reading(GOAL.id), english)).resolves.toEqual({
      reading: reading(GOAL.id),
      goals: [GOAL],
    });
  });

  it('leaves out a goal the project lost', async () => {
    const { reading: kept } = await withGoalsWhenFiltered(
      'p1',
      reading('9b2e4c6a-3d5f-4a7b-8c9d-1e2f3a4b5c6d'),
      english,
    );

    expect(kept.filters.reachedGoal).toBeNull();
    expect(kept.problems).toEqual(['The goal in the filter no longer exists, so it was left out.']);
  });
});
