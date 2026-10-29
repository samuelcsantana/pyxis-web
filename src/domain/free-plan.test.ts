import { describe, expect, it } from 'vitest';
import type { Account } from './accounts';
import {
  afterCancelling,
  canWithdraw,
  excessOver,
  FREE_PLAN_ROOM,
  freePlanFitDue,
  isFreePlanOn,
  ownsAnotherFreeAccount,
} from './free-plan';

const PAID: Account = {
  id: 'a1',
  role: 'owner',
  status: 'active',
  billingInterval: 'month',
  trialEndsAt: null,
  currentPeriodEndsAt: '2026-12-01T00:00:00.000Z',
  accessEndsAt: null,
  ingestionPausedUntil: null,
  suspendedAt: null,
  suspensionReason: null,
  deletionHeldAt: null,
  quotaPauseExemptUntil: null,
  freeWaitlistedAt: null,
  freePlanFitDueAt: null,
  projectCount: 1,
  peopleCount: 1,
  boundByFreePlanTerms: true,
  mailboxHasAnotherFreeAccount: null,
  month: '2026-11',
  eventsThisMonth: 10_000,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
};

const FREE: Account = {
  ...PAID,
  status: 'free',
  billingInterval: null,
  currentPeriodEndsAt: null,
  limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
};

describe('the free plan', () => {
  it('is on while it takes new owners and while it is full, off while closed', () => {
    expect(isFreePlanOn('open')).toBe(true);
    expect(isFreePlanOn('full')).toBe(true);
    expect(isFreePlanOn('closed')).toBe(false);
  });

  it('holds one project and one person', () => {
    expect(FREE_PLAN_ROOM).toEqual({ projects: 1, people: 1 });
  });

  it('counts what an account holds beyond a room, never below zero', () => {
    expect(excessOver({ ...PAID, projectCount: 3, peopleCount: 1 }, FREE_PLAN_ROOM)).toEqual({
      projects: 2,
      people: 0,
    });
    expect(excessOver({ ...PAID, projectCount: 0, peopleCount: 2 }, FREE_PLAN_ROOM)).toEqual({
      projects: 0,
      people: 1,
    });
  });

  it('cannot count what it is not told', () => {
    expect(excessOver({ ...PAID, projectCount: null }, FREE_PLAN_ROOM)).toBeNull();
    expect(excessOver({ ...PAID, peopleCount: null }, FREE_PLAN_ROOM)).toBeNull();
  });

  it('knows whether the owner already has another account on it', () => {
    const other = { ...FREE, id: 'a2' };

    expect(ownsAnotherFreeAccount(PAID, [PAID, other])).toBe(true);
    expect(ownsAnotherFreeAccount(FREE, [FREE])).toBe(false);
    expect(ownsAnotherFreeAccount(PAID, [PAID, { ...PAID, id: 'a3' }])).toBe(false);
  });

  it("follows the API when it says whether the owner's mailbox has another free account", () => {
    const other = { ...FREE, id: 'a2' };

    expect(ownsAnotherFreeAccount({ ...PAID, mailboxHasAnotherFreeAccount: true }, [PAID])).toBe(
      true,
    );
    expect(
      ownsAnotherFreeAccount({ ...PAID, mailboxHasAnotherFreeAccount: false }, [PAID, other]),
    ).toBe(false);
  });
});

describe('withdrawing to the free plan', () => {
  it.each(['active', 'past_due', 'ending'] as const)(
    'is offered to the owner of a %s account while the free plan is on',
    (status) => {
      expect(canWithdraw({ ...PAID, status }, 'open')).toBe(true);
      expect(canWithdraw({ ...PAID, status }, 'full')).toBe(true);
    },
  );

  it('is not offered while the free plan is closed', () => {
    expect(canWithdraw(PAID, 'closed')).toBe(false);
  });

  it.each(['trialing', 'incomplete', 'ended', 'comped', 'free'] as const)(
    'is not offered to a %s account, which has paid nothing to withdraw from',
    (status) => {
      expect(canWithdraw({ ...PAID, status }, 'open')).toBe(false);
    },
  );

  it('is not offered to a member', () => {
    expect(canWithdraw({ ...PAID, role: 'member' }, 'open')).toBe(false);
  });
});

describe('what cancelling does', () => {
  it('takes an account that fits back to the free plan', () => {
    expect(afterCancelling(PAID, 'open', false)).toEqual({ kind: 'backToFreePlan' });
    expect(afterCancelling({ ...PAID, status: 'trialing' }, 'full', false)).toEqual({
      kind: 'backToFreePlan',
    });
    expect(afterCancelling({ ...PAID, status: 'ending' }, 'open', false)).toEqual({
      kind: 'backToFreePlan',
    });
  });

  it('ends an account that holds more than the free plan, unless it fits by then', () => {
    expect(afterCancelling({ ...PAID, projectCount: 3, peopleCount: 2 }, 'open', false)).toEqual({
      kind: 'endsUnlessItFits',
      excess: { projects: 2, people: 1 },
      room: { projects: 1, people: 1 },
    });
  });

  it('says nothing while the free plan is closed, so the screen stays as it is', () => {
    expect(afterCancelling(PAID, 'closed', false)).toBeNull();
  });

  it('says nothing when the owner already has an account on the free plan', () => {
    expect(afterCancelling(PAID, 'open', true)).toBeNull();
  });

  it('promises nothing while the earlier terms still bind the account, since it then ends', () => {
    expect(afterCancelling({ ...PAID, boundByFreePlanTerms: false }, 'open', false)).toBeNull();
    expect(
      afterCancelling(
        { ...PAID, boundByFreePlanTerms: false, projectCount: 3, peopleCount: 2 },
        'open',
        false,
      ),
    ).toBeNull();
  });

  it('promises nothing when the API does not say whether the terms bind the account', () => {
    expect(afterCancelling({ ...PAID, boundByFreePlanTerms: null }, 'open', false)).toBeNull();
  });

  it('says nothing without the counts', () => {
    expect(afterCancelling({ ...PAID, projectCount: null }, 'open', false)).toBeNull();
  });

  it.each(['incomplete', 'ended', 'comped', 'free'] as const)(
    'says nothing for a %s account, which has no subscription to cancel',
    (status) => {
      expect(afterCancelling({ ...PAID, status }, 'open', false)).toBeNull();
    },
  );

  it('says nothing to a member', () => {
    expect(afterCancelling({ ...PAID, role: 'member' }, 'open', false)).toBeNull();
  });
});

describe('fitting the free plan after a withdrawal', () => {
  it('names the day and what to remove, against the account’s own limits', () => {
    expect(
      freePlanFitDue({
        ...FREE,
        freePlanFitDueAt: '2026-12-20T12:00:00.000Z',
        projectCount: 3,
        peopleCount: 1,
        limits: { ...FREE.limits, projects: 2 },
      }),
    ).toEqual({
      dueAt: '2026-12-20T12:00:00.000Z',
      excess: { projects: 1, people: 0 },
      room: { projects: 2, people: 1 },
    });
  });

  it('says nothing once the account fits, even before the day is cleared', () => {
    expect(freePlanFitDue({ ...FREE, freePlanFitDueAt: '2026-12-20T12:00:00.000Z' })).toBeNull();
  });

  it('says nothing without a day, without the counts, or for a paid account', () => {
    expect(freePlanFitDue({ ...FREE, projectCount: 3 })).toBeNull();
    expect(
      freePlanFitDue({ ...FREE, freePlanFitDueAt: '2026-12-20T12:00:00.000Z', projectCount: null }),
    ).toBeNull();
    expect(
      freePlanFitDue({ ...PAID, freePlanFitDueAt: '2026-12-20T12:00:00.000Z', projectCount: 3 }),
    ).toBeNull();
  });
});
