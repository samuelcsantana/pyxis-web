import { describe, expect, it } from 'vitest';
import { ACCOUNT_STATUSES } from './accounts';
import { FREE_PLAN_STATES, requestedIntervalOf, stepAfterSignUp } from './sign-up';

describe('where a verified sign-up goes', () => {
  it.each(FREE_PLAN_STATES)('welcomes an owner who starts on the free plan (%s)', (freePlan) => {
    expect(stepAfterSignUp('free', freePlan)).toBe('welcome');
  });

  it('opens Checkout for an account waiting for it while the free plan is closed', () => {
    expect(stepAfterSignUp('incomplete', 'closed')).toBe('checkout');
  });

  it.each(['open', 'full'] as const)(
    'offers to wait for a free place, or subscribe, when the free plan is %s but had none',
    (freePlan) => {
      expect(stepAfterSignUp('incomplete', freePlan)).toBe('waitForAFreePlace');
    },
  );

  it.each(ACCOUNT_STATUSES.filter((status) => status !== 'free' && status !== 'incomplete'))(
    'sends a returning owner whose account is %s to the dashboard',
    (status) => {
      expect(stepAfterSignUp(status, 'open')).toBe('dashboard');
      expect(stepAfterSignUp(status, 'closed')).toBe('dashboard');
    },
  );
});

describe('the billing interval a link asks for', () => {
  it('is yearly only when the link says so, monthly otherwise', () => {
    expect(requestedIntervalOf('year')).toBe('year');
    expect(requestedIntervalOf('month')).toBe('month');
    expect(requestedIntervalOf(undefined)).toBe('month');
    expect(requestedIntervalOf('weekly')).toBe('month');
    expect(requestedIntervalOf(['year', 'month'])).toBe('month');
  });
});
