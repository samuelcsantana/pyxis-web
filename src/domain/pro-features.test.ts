import { describe, expect, it } from 'vitest';
import { demoAccountsWire } from '@/services/accounts/mock-accounts-service';
import { type Account, ACCOUNT_STATUSES, type AccountStatus } from './accounts';
import { myAccountsResponseSchema } from './accounts.schema';
import { isOnProPlan, PRO_FEATURES, projectOnPro } from './pro-features';

describe('Pro features', () => {
  it('lists the five integrations the API keeps for Pro, in its own words', () => {
    expect(PRO_FEATURES).toEqual([
      'public_share_link',
      'slack_alerts',
      'annotations_by_token',
      'ga4_import',
      'search_console',
    ]);
  });

  it('counts a trial, a paid, a late, an ending and a gifted account as Pro', () => {
    expect(ACCOUNT_STATUSES.filter(isOnProPlan)).toEqual([
      'trialing',
      'active',
      'past_due',
      'ending',
      'comped',
    ]);
  });

  it('leaves the free plan and the accounts without access off Pro', () => {
    const offPro: readonly AccountStatus[] = ['free', 'incomplete', 'ended'];
    expect(offPro.some(isOnProPlan)).toBe(false);
  });
});

const NOW = new Date('2026-11-05T12:00:00.000Z');
const [DEMO_ACCOUNT] = myAccountsResponseSchema.parse(demoAccountsWire(NOW));

function account(id: string, status: AccountStatus): Account {
  if (DEMO_ACCOUNT === undefined) {
    throw new Error('The demo has an account.');
  }
  return { ...DEMO_ACCOUNT, id, status };
}

describe('projectOnPro', () => {
  it('counts the projects of an account on Pro, and those outside any account', () => {
    expect(projectOnPro([account('a1', 'active')], 'a1')).toBe(true);
    expect(projectOnPro([], null)).toBe(true);
  });

  it('leaves out an account on Hobby, and one it cannot read', () => {
    expect(projectOnPro([account('a1', 'free')], 'a1')).toBe(false);
    expect(projectOnPro([account('a2', 'active')], 'a1')).toBe(false);
  });
});
