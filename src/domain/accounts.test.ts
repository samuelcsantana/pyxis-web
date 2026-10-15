import { describe, expect, it } from 'vitest';
import {
  type Account,
  accountNotice,
  canClose,
  deletionDateOf,
  firstNotice,
  hasBillingPortal,
  needsCheckout,
  ownedAccounts,
  quotaShare,
} from './accounts';
import {
  billingRedirectResponseSchema,
  checkoutWire,
  closeAccountWire,
  closedAccountResponseSchema,
  myAccountsResponseSchema,
  portalWire,
} from './accounts.schema';

const NOW = new Date('2026-11-20T12:00:00.000Z');

const ACCOUNT: Account = {
  id: 'a1',
  role: 'owner',
  status: 'active',
  billingInterval: 'month',
  trialEndsAt: null,
  currentPeriodEndsAt: '2026-12-01T00:00:00.000Z',
  accessEndsAt: null,
  ingestionPausedUntil: null,
  month: '2026-11',
  eventsThisMonth: 10_000,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3 },
};

describe('accounts', () => {
  it('keeps the accounts the admin owns', () => {
    expect(ownedAccounts([ACCOUNT, { ...ACCOUNT, id: 'a2', role: 'member' }])).toEqual([ACCOUNT]);
  });

  it('measures the share of the monthly quota, or nothing before the first measurement', () => {
    expect(quotaShare(ACCOUNT)).toBe(0.1);
    expect(quotaShare({ ...ACCOUNT, eventsThisMonth: null })).toBeNull();
  });

  it('dates the deletion thirty days after the end of access', () => {
    expect(deletionDateOf('2026-11-20T12:00:00.000Z')).toBe('2026-12-20T12:00:00.000Z');
  });

  it.each([
    ['incomplete', false, true],
    ['trialing', true, false],
    ['active', true, false],
    ['past_due', true, false],
    ['ending', true, false],
    ['ended', true, false],
    ['comped', false, false],
  ] as const)(
    'a %s account has a billing portal: %s, needs Checkout: %s',
    (status, portal, checkout) => {
      expect(hasBillingPortal({ ...ACCOUNT, status })).toBe(portal);
      expect(needsCheckout({ ...ACCOUNT, status })).toBe(checkout);
    },
  );
});

describe('accountNotice', () => {
  it('says nothing for a running account well under its quota', () => {
    expect(accountNotice(ACCOUNT, NOW)).toBeNull();
    expect(accountNotice({ ...ACCOUNT, eventsThisMonth: null }, NOW)).toBeNull();
  });

  it('warns about a failed payment first', () => {
    expect(accountNotice({ ...ACCOUNT, status: 'past_due', eventsThisMonth: 99_000 }, NOW)).toEqual(
      { kind: 'paymentFailed' },
    );
  });

  it('says when access ends and when the data goes', () => {
    expect(
      accountNotice(
        { ...ACCOUNT, status: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' },
        NOW,
      ),
    ).toEqual({ kind: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' });
    expect(
      accountNotice({ ...ACCOUNT, status: 'ended', accessEndsAt: '2026-11-10T00:00:00.000Z' }, NOW),
    ).toEqual({ kind: 'ended', deletionOn: '2026-12-10T00:00:00.000Z' });
  });

  it('ignores an end without a date', () => {
    expect(accountNotice({ ...ACCOUNT, status: 'ending' }, NOW)).toBeNull();
    expect(accountNotice({ ...ACCOUNT, status: 'ended' }, NOW)).toBeNull();
  });

  it('says ingestion is paused until a date still ahead', () => {
    expect(
      accountNotice({ ...ACCOUNT, ingestionPausedUntil: '2026-12-01T00:00:00.000Z' }, NOW),
    ).toEqual({ kind: 'paused', until: '2026-12-01T00:00:00.000Z' });
    expect(
      accountNotice({ ...ACCOUNT, ingestionPausedUntil: '2026-11-01T00:00:00.000Z' }, NOW),
    ).toBeNull();
  });

  it('warns from 80% of the quota', () => {
    expect(accountNotice({ ...ACCOUNT, eventsThisMonth: 79_999 }, NOW)).toBeNull();
    expect(accountNotice({ ...ACCOUNT, eventsThisMonth: 80_000 }, NOW)).toEqual({
      kind: 'nearQuota',
      share: 0.8,
    });
  });
});

describe('firstNotice', () => {
  it('names the first owned account with something to say', () => {
    const quiet = { ...ACCOUNT, id: 'quiet' };
    const failing = { ...ACCOUNT, id: 'failing', status: 'past_due' } as const;
    const someoneElses = { ...ACCOUNT, id: 'theirs', role: 'member', status: 'past_due' } as const;

    expect(firstNotice([someoneElses, quiet, failing], NOW)).toEqual({
      account: failing,
      notice: { kind: 'paymentFailed' },
    });
    expect(firstNotice([quiet, someoneElses], NOW)).toBeNull();
  });
});

describe('accounts on the wire', () => {
  it('reads the accounts the API lists', () => {
    expect(
      myAccountsResponseSchema.parse({
        accounts: [
          {
            id: 'a1',
            role: 'owner',
            status: 'active',
            billing_interval: 'month',
            trial_ends_at: null,
            current_period_ends_at: '2026-12-01T00:00:00.000Z',
            access_ends_at: null,
            ingestion_paused_until: null,
            month: '2026-11',
            events_this_month: 10_000,
            measured_at: '2026-11-20T03:00:00.000Z',
            limits: { events_per_month: 100_000, projects: 3, people: 3 },
          },
        ],
      }),
    ).toEqual([ACCOUNT]);
  });

  it('reads the address Stripe gives and writes the requests', () => {
    expect(billingRedirectResponseSchema.parse({ url: 'https://billing.stripe.com/p/x' })).toBe(
      'https://billing.stripe.com/p/x',
    );
    expect(checkoutWire('year', 'pt-BR')).toEqual({ interval: 'year', locale: 'pt-BR' });
    expect(portalWire('es')).toEqual({ locale: 'es' });
  });
});

describe('closing an account', () => {
  it('is for the owner of an account that has not ended', () => {
    expect(canClose(ACCOUNT)).toBe(true);
    expect(canClose({ ...ACCOUNT, role: 'member' })).toBe(false);
    expect(canClose({ ...ACCOUNT, status: 'ended' })).toBe(false);
  });

  it('writes the confirmation and reads the answer', () => {
    expect(closeAccountWire(' owner@example.com ')).toEqual({ confirm_email: 'owner@example.com' });
    expect(
      closedAccountResponseSchema.parse({
        access_ends_at: '2026-11-20T12:00:00.000Z',
        deletion_on: '2026-12-20T12:00:00.000Z',
        refunded_amount: 0,
      }),
    ).toEqual({
      accessEndsAt: '2026-11-20T12:00:00.000Z',
      deletionOn: '2026-12-20T12:00:00.000Z',
      refundedAmount: 0,
    });
  });
});
