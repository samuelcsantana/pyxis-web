import { describe, expect, it } from 'vitest';
import type { Account, AccountStatus } from './accounts';
import { supportPlanOf } from './support';

const ACCOUNT: Account = {
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
  month: '2026-11',
  eventsThisMonth: 10_000,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
};

function withStatus(status: AccountStatus, id = 'a1'): Account {
  return { ...ACCOUNT, id, status };
}

describe('supportPlanOf', () => {
  it.each(['trialing', 'active', 'past_due', 'ending', 'comped'] as const)(
    'gives a %s account the paid plan’s support',
    (status) => {
      expect(supportPlanOf([withStatus(status)])).toBe('paid');
    },
  );

  it('gives the paid plan’s support when any account is paid, even next to a free one', () => {
    expect(supportPlanOf([withStatus('free', 'a1'), withStatus('active', 'a2')])).toBe('paid');
  });

  it('gives a free account the free plan’s support', () => {
    expect(supportPlanOf([withStatus('free')])).toBe('free');
  });

  it('knows no plan without an account, or with only incomplete and ended ones', () => {
    expect(supportPlanOf([])).toBeNull();
    expect(supportPlanOf([withStatus('incomplete', 'a1'), withStatus('ended', 'a2')])).toBeNull();
  });
});
