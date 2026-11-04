import { describe, expect, it } from 'vitest';
import { ACCOUNT_STATUSES, type AccountStatus } from './accounts';
import { isOnProPlan, PRO_FEATURES } from './pro-features';

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
