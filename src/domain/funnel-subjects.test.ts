import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import type { FunnelRow } from './funnel';
import {
  drillCount,
  drillHeading,
  drillParameters,
  type FunnelDrill,
  funnelDrillOf,
  funnelSubjectsView,
  withDrillLinks,
} from './funnel-subjects';
import { funnelSubjectsResponseSchema } from './funnel.schema';

const COUNTS = [1940, 1212, 340];
const DROPPED_AT_TWO: FunnelDrill = { step: 2, outcome: 'dropped', cursor: null };

function row(position: number): FunnelRow {
  return {
    key: `row-${String(position)}`,
    position,
    label: `Step ${String(position)}`,
    target: '/',
    count: '0',
    barWidth: '0%',
    continued: '',
    tone: 'neutral',
    dropped: '',
    time: null,
    reachedLink: null,
    droppedLink: null,
  };
}

function hrefOf(step: number, outcome: string): string {
  return `/f?step=${String(step)}&outcome=${outcome}`;
}

describe('funnelDrillOf', () => {
  it('reads the step, the outcome and the cursor of the address', () => {
    expect(funnelDrillOf({ step: '2', outcome: 'dropped', cursor: 'c1' }, 3)).toEqual({
      step: 2,
      outcome: 'dropped',
      cursor: 'c1',
    });
    expect(funnelDrillOf({ step: '1', outcome: 'reached' }, 3)).toEqual({
      step: 1,
      outcome: 'reached',
      cursor: null,
    });
    expect(funnelDrillOf({ step: '3', outcome: 'reached', cursor: '' }, 3)?.cursor).toBeNull();
  });

  it('leaves the list closed for a step or an outcome it cannot use', () => {
    expect(funnelDrillOf({}, 3)).toBeNull();
    expect(funnelDrillOf({ step: '2' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: '2', outcome: 'left' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: ['2'], outcome: 'reached' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: 'two', outcome: 'reached' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: '0', outcome: 'reached' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: '4', outcome: 'reached' }, 3)).toBeNull();
    expect(funnelDrillOf({ step: '1', outcome: 'dropped' }, 3)).toBeNull();
  });
});

describe('drillCount', () => {
  it('counts who reached a step, and who reached the one before and never it', () => {
    expect(drillCount(COUNTS, 2, 'reached')).toBe(1212);
    expect(drillCount(COUNTS, 2, 'dropped')).toBe(728);
    expect(drillCount(COUNTS, 3, 'dropped')).toBe(872);
  });

  it('counts nobody for a step the counts do not have', () => {
    expect(drillCount([], 1, 'reached')).toBe(0);
    expect(drillCount([], 2, 'dropped')).toBe(0);
  });

  it('names the parameters of a list', () => {
    expect(drillParameters(3, 'reached')).toEqual({ step: '3', outcome: 'reached' });
  });
});

describe('withDrillLinks', () => {
  it('links every step to who reached it and every later step to who left before it', () => {
    const rows = withDrillLinks([row(1), row(2), row(3)], COUNTS, DROPPED_AT_TWO, hrefOf, english);

    expect(rows[0]?.reachedLink).toEqual({
      href: '/f?step=1&outcome=reached',
      label: '1,940, list who reached step 1',
      current: false,
    });
    expect(rows[0]?.droppedLink).toBeNull();
    expect(rows[1]?.droppedLink).toEqual({
      href: '/f?step=2&outcome=dropped',
      label: '728 dropped, list who left before step 2',
      current: true,
    });
    expect(rows[2]?.droppedLink?.current).toBe(false);
  });

  it('marks no link as current while no list is open', () => {
    const rows = withDrillLinks([row(1), row(2)], COUNTS, null, hrefOf, english);

    expect(rows.flatMap((each) => [each.reachedLink?.current, each.droppedLink?.current])).toEqual([
      false,
      undefined,
      false,
      false,
    ]);
  });
});

describe('drillHeading', () => {
  it('says how many reached a step, as visits or as people', () => {
    expect(drillHeading(COUNTS, { ...DROPPED_AT_TWO, outcome: 'reached' }, 'visit', english)).toBe(
      '1,212 visits reached step 2',
    );
    expect(drillHeading([1], { step: 1, outcome: 'reached', cursor: null }, 'user', english)).toBe(
      '1 person reached step 1',
    );
  });

  it('says how many reached the step before and never this one', () => {
    expect(drillHeading(COUNTS, DROPPED_AT_TWO, 'user', english)).toBe(
      '728 people reached step 1 and never step 2',
    );
  });
});

describe('funnelSubjectsView', () => {
  const page = {
    subjects: [{ id: '7e2b9c14-0000-4000-8000-000000000001', lastStepAt: '2026-10-04T15:20:00Z' }],
    nextCursor: null,
  };
  const timeline = (lookup: Readonly<Record<string, string>>) =>
    `/t?${new URLSearchParams(lookup).toString()}`;

  it('opens each visit of a list in the timeline, at the time of its last step', () => {
    const view = funnelSubjectsView(
      page,
      'Heading',
      'visit',
      'America/Sao_Paulo',
      timeline,
      english,
    );

    expect(view.subjectColumn).toBe('Visit');
    expect(view.rows).toEqual([
      {
        key: '7e2b9c14-0000-4000-8000-000000000001',
        shown: '7e2b9c14',
        label: '7e2b9c14, open this visit in the timeline',
        href: '/t?visit=7e2b9c14-0000-4000-8000-000000000001',
        reachedAt: '2026-10-04T15:20:00Z',
        reachedAtText: 'Sun, Oct 4, 12:20',
      },
    ]);
    expect(view.text).toEqual({
      reachedAt: 'Last step reached',
      order: 'Newest first, 50 at a time.',
      older: 'Show older',
      newest: 'Back to the newest',
      close: 'Close the list',
      empty: 'Nobody in this period.',
    });
  });

  it('opens each person of a list in their timeline', () => {
    const people = { subjects: [{ id: 'u_7f3a', lastStepAt: '2026-10-04T15:20:00Z' }] };
    const view = funnelSubjectsView(
      { ...people, nextCursor: 'c' },
      'Heading',
      'user',
      'UTC',
      timeline,
      english,
    );

    expect(view.subjectColumn).toBe('Person');
    expect(view.rows[0]).toMatchObject({
      shown: 'u_7f3a',
      label: 'u_7f3a, open the timeline of this person',
      href: '/t?user=u_7f3a',
    });
  });
});

describe('funnelSubjectsResponseSchema', () => {
  it('reads the subjects and the cursor of the older page', () => {
    expect(
      funnelSubjectsResponseSchema.parse({
        subjects: [{ id: 's1', last_step_at: '2026-10-04T15:20:00.000Z' }],
        next_cursor: 'c2',
      }),
    ).toEqual({
      subjects: [{ id: 's1', lastStepAt: '2026-10-04T15:20:00.000Z' }],
      nextCursor: 'c2',
    });
  });
});
