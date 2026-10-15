import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import { bestEffortAccountNotice } from './account-notice';

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
  month: '2026-11',
  eventsThisMonth: 10,
  measuredAt: null,
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3 },
};

describe('bestEffortAccountNotice', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("answers what to say about the admin's accounts", async () => {
    state.list = () => Promise.resolve([ENDING]);

    await expect(bestEffortAccountNotice(NOW)).resolves.toEqual({
      kind: 'ending',
      accessEndsAt: '2026-12-01T00:00:00.000Z',
    });
  });

  it('answers nothing when every account is fine', async () => {
    state.list = () => Promise.resolve([{ ...ENDING, status: 'active', accessEndsAt: null }]);

    await expect(bestEffortAccountNotice(NOW)).resolves.toBeNull();
  });

  it('shows nothing, and logs why, when the accounts cannot be read', async () => {
    const failure = new Error('Pyxis API answered 503');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    state.list = () => Promise.reject(failure);

    await expect(bestEffortAccountNotice(NOW)).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      'account notice: could not read the accounts, showing none',
      failure,
    );
  });
});
