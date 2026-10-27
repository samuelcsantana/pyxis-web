import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import { accountsInView, bestEffortAccountsInView } from './accounts-in-view';

const NOW = new Date('2026-11-20T12:00:00.000Z');

const state = vi.hoisted<{ list: () => Promise<readonly Account[]> }>(() => ({
  list: () => Promise.resolve([]),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.list() }),
}));

const ENDING: Account = {
  id: 'a1',
  role: 'owner',
  status: 'ending',
  billingInterval: 'year',
  trialEndsAt: null,
  currentPeriodEndsAt: '2026-12-01T00:00:00.000Z',
  accessEndsAt: '2026-12-01T00:00:00.000Z',
  ingestionPausedUntil: null,
  suspendedAt: null,
  suspensionReason: null,
  deletionHeldAt: null,
  quotaPauseExemptUntil: null,
  month: '2026-11',
  eventsThisMonth: 10,
  measuredAt: null,
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
};

describe('accountsInView', () => {
  it('says what to warn about and that the owner can still create projects', () => {
    expect(accountsInView([ENDING], NOW)).toEqual({
      notice: { kind: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' },
      canCreateProject: true,
      hasUnfinishedSignUp: false,
    });
  });

  it('lets nobody create projects in an account that ended, never started or is not theirs', () => {
    for (const account of [
      { ...ENDING, status: 'ended' },
      { ...ENDING, status: 'incomplete' },
      { ...ENDING, role: 'member' },
    ] as const) {
      expect(accountsInView([account], NOW).canCreateProject).toBe(false);
    }
  });

  it('shows nothing without accounts', () => {
    expect(accountsInView([], NOW)).toEqual({
      notice: null,
      canCreateProject: false,
      hasUnfinishedSignUp: false,
    });
  });

  it('notices a sign-up the owner did not finish, and only theirs', () => {
    const unfinished = { ...ENDING, status: 'incomplete', accessEndsAt: null } as const;

    expect(accountsInView([unfinished], NOW).hasUnfinishedSignUp).toBe(true);
    expect(accountsInView([{ ...unfinished, role: 'member' }], NOW).hasUnfinishedSignUp).toBe(
      false,
    );
  });
});

describe('bestEffortAccountsInView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads the admin's accounts", async () => {
    state.list = () => Promise.resolve([{ ...ENDING, status: 'comped', accessEndsAt: null }]);

    await expect(bestEffortAccountsInView(NOW)).resolves.toEqual({
      notice: null,
      canCreateProject: true,
      hasUnfinishedSignUp: false,
    });
  });

  it('shows nothing, and logs why, when the accounts cannot be read', async () => {
    const failure = new Error('Pyxis API answered 503');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    state.list = () => Promise.reject(failure);

    await expect(bestEffortAccountsInView(NOW)).resolves.toEqual({
      notice: null,
      canCreateProject: false,
      hasUnfinishedSignUp: false,
    });
    expect(warn).toHaveBeenCalledWith(
      'accounts in view: could not read the accounts, showing none',
      failure,
    );
  });
});
