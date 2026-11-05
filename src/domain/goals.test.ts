import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { NO_DASHBOARD_FILTERS } from './dashboard-filters';
import {
  canAddGoal,
  chosenGoal,
  EMPTY_GOAL_DRAFT,
  type Goal,
  goalById,
  goalChangesOf,
  goalChoiceOf,
  goalDraftOf,
  goalDraftProblems,
  goalNameOf,
  goalQuery,
  goalRows,
  hasGoalProblems,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_PATH_LENGTH,
  MAX_GOALS,
  withKnownReachedGoal,
  withoutGoal,
  withSavedGoal,
} from './goals';
import { askedGoalId, isGoalId, withChosenGoal } from './goal-parameters';
import {
  goalChangesWire,
  goalResponseSchema,
  goalsResponseSchema,
  goalsSummaryResponseSchema,
} from './goals.schema';

const SIGN_UP: Goal = {
  id: '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b',
  name: 'Sign-up',
  kind: 'event',
  target: 'signup_completed',
  position: 1,
};
const THANK_YOU: Goal = {
  id: '8a1d3b5f-2c4e-4f6a-9b7c-0d1e2f3a4b5c',
  name: 'Thank-you page',
  kind: 'page',
  target: '/thank-you/*',
  position: 3,
};
const GOALS: readonly Goal[] = [SIGN_UP, THANK_YOU];
const UNKNOWN_ID = '9b2e4c6a-3d5f-4a7b-8c9d-1e2f3a4b5c6d';

const SIGN_UP_WIRE = {
  id: SIGN_UP.id,
  name: 'Sign-up',
  type: 'event',
  event: 'signup_completed',
  path: null,
  position: 1,
  created_at: '2026-11-04T12:00:00.000Z',
};
const THANK_YOU_WIRE = {
  id: THANK_YOU.id,
  name: 'Thank-you page',
  type: 'page',
  event: null,
  path: '/thank-you/*',
  position: 3,
  created_at: '2026-11-04T12:00:00.000Z',
};

describe('isGoalId', () => {
  it('accepts the id of a goal in either case and refuses anything else', () => {
    expect(isGoalId(SIGN_UP.id)).toBe(true);
    expect(isGoalId(SIGN_UP.id.toUpperCase())).toBe(true);
    expect(isGoalId('signup_completed')).toBe(false);
    expect(isGoalId('')).toBe(false);
  });
});

describe('canAddGoal', () => {
  it('allows a goal until the project has the most it can keep', () => {
    expect(canAddGoal(GOALS)).toBe(true);
    expect(canAddGoal(Array.from({ length: MAX_GOALS }, () => SIGN_UP))).toBe(false);
  });
});

describe('goalById', () => {
  it('finds a goal by its id, and nothing without one or for an unknown one', () => {
    expect(goalById(GOALS, THANK_YOU.id)).toBe(THANK_YOU);
    expect(goalById(GOALS, UNKNOWN_ID)).toBeNull();
    expect(goalById(GOALS, null)).toBeNull();
  });
});

describe('goalDraftProblems', () => {
  it('finds nothing wrong with a named event or a page path with a star', () => {
    const event = goalDraftProblems({ name: ' Sign-up ', kind: 'event', target: ' signup ' });
    const page = goalDraftProblems({ name: 'Thanks', kind: 'page', target: '/thank-you/*' });

    expect(event).toEqual({});
    expect(page).toEqual({});
    expect(hasGoalProblems(event)).toBe(false);
  });

  it('names a missing name and an event the site could not send', () => {
    const problems = goalDraftProblems({ name: '  ', kind: 'event', target: 'Sign Up' });

    expect(problems).toEqual({ name: 'missing', target: 'eventName' });
    expect(hasGoalProblems(problems)).toBe(true);
  });

  it('names a name over the limit alone as a problem', () => {
    const problems = goalDraftProblems({
      name: 'x'.repeat(MAX_GOAL_NAME_LENGTH + 1),
      kind: 'event',
      target: 'signup',
    });

    expect(problems).toEqual({ name: 'tooLong' });
    expect(hasGoalProblems(problems)).toBe(true);
  });

  it('wants a page path to start with a slash and to fit the limit', () => {
    expect(goalDraftProblems({ name: 'Thanks', kind: 'page', target: 'thank-you' })).toEqual({
      target: 'pathStart',
    });
    expect(
      goalDraftProblems({
        name: 'Thanks',
        kind: 'page',
        target: `/${'x'.repeat(MAX_GOAL_PATH_LENGTH)}`,
      }),
    ).toEqual({ target: 'pathLength' });
  });
});

describe('goalChangesOf and goalDraftOf', () => {
  it('trims what is sent, and starts editing from the saved goal', () => {
    expect(goalChangesOf({ name: ' Thanks ', kind: 'page', target: ' /thanks ' })).toEqual({
      name: 'Thanks',
      kind: 'page',
      target: '/thanks',
    });
    expect(goalDraftOf(THANK_YOU)).toEqual({
      name: 'Thank-you page',
      kind: 'page',
      target: '/thank-you/*',
    });
    expect(EMPTY_GOAL_DRAFT).toEqual({ name: '', kind: 'event', target: '' });
  });
});

describe('withSavedGoal and withoutGoal', () => {
  it('replaces a saved goal in place and adds a new one in its position', () => {
    const renamed = { ...SIGN_UP, name: 'Account created' };
    const added = { ...THANK_YOU, id: UNKNOWN_ID, position: 2 };

    expect(withSavedGoal(GOALS, renamed)).toEqual([renamed, THANK_YOU]);
    expect(withSavedGoal(GOALS, added)).toEqual([SIGN_UP, added, THANK_YOU]);
  });

  it('takes a deleted goal out', () => {
    expect(withoutGoal(GOALS, SIGN_UP.id)).toEqual([THANK_YOU]);
  });
});

describe('goalNameOf', () => {
  it('names a goal by its name, or by the start of its id when the project lost it', () => {
    expect(goalNameOf(GOALS, THANK_YOU.id)).toBe('Thank-you page');
    expect(goalNameOf(GOALS, UNKNOWN_ID)).toBe('9b2e4c6a');
  });
});

describe('chosenGoal', () => {
  it('counts the first goal when the address names none', () => {
    expect(chosenGoal(GOALS, undefined, english)).toEqual({
      goal: SIGN_UP,
      askedId: null,
      problem: null,
    });
    expect(chosenGoal(GOALS, ['a', 'b'], english).goal).toBe(SIGN_UP);
    expect(chosenGoal([], ' ', english).goal).toBeNull();
  });

  it('counts the goal the address names', () => {
    expect(chosenGoal(GOALS, ` ${THANK_YOU.id} `, english)).toEqual({
      goal: THANK_YOU,
      askedId: THANK_YOU.id,
      problem: null,
    });
  });

  it('falls back to the first goal and says why when the project lost the goal named', () => {
    expect(chosenGoal(GOALS, UNKNOWN_ID, english)).toEqual({
      goal: SIGN_UP,
      askedId: null,
      problem: 'The goal in the address no longer exists, so the first goal is counted.',
    });
  });
});

describe('goalChoiceOf', () => {
  it('offers nothing without goals, a name for one and a choice for more', () => {
    expect(goalChoiceOf([], chosenGoal([], undefined, english))).toEqual({ kind: 'none' });
    expect(goalChoiceOf([SIGN_UP], chosenGoal([SIGN_UP], undefined, english))).toEqual({
      kind: 'single',
      name: 'Sign-up',
    });
    expect(goalChoiceOf(GOALS, chosenGoal(GOALS, THANK_YOU.id, english))).toEqual({
      kind: 'picker',
      goals: [
        { id: SIGN_UP.id, name: 'Sign-up' },
        { id: THANK_YOU.id, name: 'Thank-you page' },
      ],
      selected: THANK_YOU.id,
      first: SIGN_UP.id,
    });
  });
});

describe('withChosenGoal', () => {
  it('names a goal in the address, and leaves the first goal out of it', () => {
    expect(withChosenGoal('range=7d', THANK_YOU.id, SIGN_UP.id)).toBe(
      `range=7d&goal=${THANK_YOU.id}`,
    );
    expect(withChosenGoal(`range=7d&goal=${THANK_YOU.id}`, SIGN_UP.id, SIGN_UP.id)).toBe(
      'range=7d',
    );
  });
});

describe('askedGoalId and goalQuery', () => {
  it('reads only an id from the address, and writes back only a goal that was asked for', () => {
    expect(askedGoalId(` ${SIGN_UP.id} `)).toBe(SIGN_UP.id);
    expect(askedGoalId('signup')).toBeNull();
    expect(askedGoalId(undefined)).toBeNull();
    expect(goalQuery(chosenGoal(GOALS, THANK_YOU.id, english))).toEqual({ goal: THANK_YOU.id });
    expect(goalQuery(chosenGoal(GOALS, undefined, english))).toEqual({});
  });
});

describe('goalRows', () => {
  it('formats each goal of the summary, a goal no visit reached included', () => {
    expect(
      goalRows(
        {
          visits: 1200,
          goals: [
            {
              ...SIGN_UP,
              conversions: 1340,
              convertingVisits: 1100,
              conversionRate: 1100 / 1200,
              revenue: null,
            },
            {
              ...THANK_YOU,
              conversions: 0,
              convertingVisits: 0,
              conversionRate: null,
              revenue: null,
            },
          ],
        },
        'BRL',
        english,
      ),
    ).toEqual([
      {
        id: SIGN_UP.id,
        name: 'Sign-up',
        target: 'signup_completed',
        kind: 'event',
        conversions: '1,340',
        convertingVisits: '1,100',
        rate: '91.7%',
        share: 1100 / 1200,
        reached: true,
        revenue: null,
        earned: 0,
      },
      {
        id: THANK_YOU.id,
        name: 'Thank-you page',
        target: '/thank-you/*',
        kind: 'page',
        conversions: '0',
        convertingVisits: '0',
        rate: '—',
        share: 0,
        reached: false,
        revenue: null,
        earned: 0,
      },
    ]);
  });
});

describe('withKnownReachedGoal', () => {
  const reading = (reachedGoal: string | null) => ({
    filters: { ...NO_DASHBOARD_FILTERS, reachedGoal },
    problems: ['An earlier problem.'],
  });

  it('keeps a reading without a reached goal or with a goal of the project', () => {
    const none = reading(null);
    const known = reading(SIGN_UP.id);

    expect(withKnownReachedGoal(none, GOALS, english)).toBe(none);
    expect(withKnownReachedGoal(known, GOALS, english)).toBe(known);
  });

  it('leaves out a goal the project lost and says so', () => {
    expect(withKnownReachedGoal(reading(UNKNOWN_ID), GOALS, english)).toEqual({
      filters: NO_DASHBOARD_FILTERS,
      problems: [
        'An earlier problem.',
        'The goal in the filter no longer exists, so it was left out.',
      ],
    });
  });
});

describe('the goals on the wire', () => {
  it('reads a goal of each kind, its target taken from the field of its kind', () => {
    expect(goalsResponseSchema.parse({ goals: [SIGN_UP_WIRE, THANK_YOU_WIRE] })).toEqual(GOALS);
    expect(goalResponseSchema.parse(THANK_YOU_WIRE)).toEqual(THANK_YOU);
  });

  it('reads a goal whose target the API left empty as an empty target', () => {
    expect(goalResponseSchema.parse({ ...SIGN_UP_WIRE, event: null }).target).toBe('');
  });

  it('reads the summary of every goal', () => {
    expect(
      goalsSummaryResponseSchema.parse({
        visits: 1200,
        goals: [
          {
            ...SIGN_UP_WIRE,
            conversions: 40,
            converting_visits: 30,
            conversion_rate: 0.025,
            revenue: 3600.5,
          },
        ],
      }),
    ).toEqual({
      visits: 1200,
      goals: [
        {
          ...SIGN_UP,
          conversions: 40,
          convertingVisits: 30,
          conversionRate: 0.025,
          revenue: 3600.5,
        },
      ],
    });
  });

  it('refuses a goal of a kind it does not know', () => {
    expect(() => goalResponseSchema.parse({ ...SIGN_UP_WIRE, type: 'click' })).toThrow();
  });

  it('writes an event goal with its event and a page goal with its path, trimmed', () => {
    expect(goalChangesWire({ name: ' Sign-up ', kind: 'event', target: ' signup ' })).toEqual({
      name: 'Sign-up',
      event: 'signup',
    });
    expect(goalChangesWire({ name: 'Thanks', kind: 'page', target: ' /thanks ' })).toEqual({
      name: 'Thanks',
      path: '/thanks',
    });
  });
});
