import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  Account,
  AccountNotice,
  BillingRedirectOutcome,
  CloseAccountOutcome,
  WithdrawOutcome,
} from '@/domain/accounts';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccountNoticeBanner } from './account-notice-banner';
import { AccountOverview } from './account-overview';
import * as billing from './billing-actions';
import { CLOSE_ACCOUNT_MIN_BUSY_MS } from './close-account-form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

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
  eventsThisMonth: 41_230,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
};

const OPEN = {
  freePlan: 'closed' as const,
  ownsAnotherFreeAccount: false,
  withdraw: () => Promise.resolve<WithdrawOutcome>({ kind: 'freePlanClosed' }),
  openCheckout: () => Promise.resolve<BillingRedirectOutcome>({ kind: 'noBillingYet' }),
  subscribe: () => Promise.resolve<BillingRedirectOutcome>({ kind: 'noBillingYet' }),
  openPortal: () => Promise.resolve<BillingRedirectOutcome>({ kind: 'noBillingYet' }),
  close: () => Promise.resolve<CloseAccountOutcome>({ kind: 'confirmationMismatch' }),
};

function overview(account: Partial<Account> = {}) {
  return renderWithMessages(
    <AccountOverview account={{ ...ACCOUNT, ...account }} i18n={english} now={NOW} {...OPEN} />,
  );
}

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(billing.OPEN_BILLING_MIN_BUSY_MS);
  });
}

describe('AccountOverview', () => {
  it('shows the plan, the renewal, the month used and the limits, with the billing portal', () => {
    overview();

    expect(screen.getByRole('heading', { name: 'Plan: Monthly' })).toBeInTheDocument();
    expect(screen.getByText('Active. It renews on Dec 1, 2026.')).toBeInTheDocument();
    expect(screen.getByText('41,230 of 100,000')).toBeInTheDocument();
    expect(screen.getByText('Measured Nov 20, 2026.')).toBeInTheDocument();
    expect(screen.getByText('Up to 3 projects and 3 people, you included.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it.each([
    [
      { status: 'trialing', trialEndsAt: '2026-11-29T12:00:00.000Z' },
      'Free trial until Nov 29, 2026.',
    ],
    [{ status: 'past_due' }, 'The last charge failed.'],
    [
      { status: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' },
      'Access continues until Dec 1, 2026',
    ],
    [
      { status: 'ended', accessEndsAt: '2026-11-10T00:00:00.000Z' },
      'Ended on Nov 10, 2026. The projects stopped measuring, and everything is deleted on Dec 10, 2026.',
    ],
    [{ status: 'comped', billingInterval: null }, 'A complimentary account, given by Pyxis.'],
  ] as const)('describes %o', (account, text) => {
    overview(account);

    expect(screen.getByRole('region')).toHaveTextContent(text);
  });

  it('describes the free plan with the limits the API answers, with no billing to manage', () => {
    overview({
      status: 'free',
      billingInterval: null,
      currentPeriodEndsAt: null,
      eventsThisMonth: 3_120,
      limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
    });

    expect(screen.getByRole('heading', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByText('Free plan: up to 10,000 events a month.')).toBeInTheDocument();
    expect(screen.getByText('3,120 of 10,000')).toBeInTheDocument();
    expect(screen.getByText('Up to 1 project and 1 person, you included.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Finish subscription' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Subscribe again' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Close the account' })).toBeInTheDocument();
  });

  it('offers Checkout with a plan choice to an unfinished sign-up, and no portal', () => {
    overview({
      status: 'incomplete',
      billingInterval: null,
      eventsThisMonth: null,
      measuredAt: null,
    });

    expect(screen.getByRole('heading', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByText(/The subscription was not finished/)).toBeInTheDocument();
    expect(screen.getByText('0 of 100,000')).toBeInTheDocument();
    expect(screen.getByText('Not measured yet this month.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finish subscription' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
  });

  it.each([
    [{ status: 'trialing', trialEndsAt: null }, 'Free trial. Then the plan is charged'],
    [{ status: 'active', currentPeriodEndsAt: null }, 'Active.'],
    [{ status: 'ending', accessEndsAt: null }, 'Access continues until the end of the period'],
    [{ status: 'ended', accessEndsAt: null }, 'deleted thirty days after the end'],
  ] as const)('says %o without a date it does not know', (account, text) => {
    overview(account);

    expect(screen.getByRole('region')).toHaveTextContent(text);
  });

  it('says when measuring is paused, and turns the bar red past the quota', () => {
    const { container } = overview({
      eventsThisMonth: 160_000,
      ingestionPausedUntil: '2026-12-01T00:00:00.000Z',
    });

    expect(
      screen.getByText(
        'Measuring is paused until Dec 1, 2026: the account reached 150,000 events this month.',
      ),
    ).toBeInTheDocument();
    expect(container.querySelector('.bg-bad')).toHaveStyle({ width: '100%' });
  });

  it('says a free account paused at its monthly events, the pause point the API answers', () => {
    overview({
      status: 'free',
      billingInterval: null,
      currentPeriodEndsAt: null,
      eventsThisMonth: 10_000,
      ingestionPausedUntil: '2026-12-01T00:00:00.000Z',
      limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
    });

    expect(screen.getByText('10,000 of 10,000')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Measuring is paused until Dec 1, 2026: the account reached 10,000 events this month.',
      ),
    ).toBeInTheDocument();
  });

  it('offers to close an account that has not ended, and not one that has', () => {
    const { unmount } = overview();
    expect(screen.getByRole('heading', { name: 'Close the account' })).toBeInTheDocument();
    expect(screen.getByText(/refunded in full/)).toBeInTheDocument();
    unmount();

    overview({ status: 'ended', accessEndsAt: '2026-11-10T00:00:00.000Z' });
    expect(screen.queryByRole('heading', { name: 'Close the account' })).not.toBeInTheDocument();
  });

  it('keeps the closing confirmation when the refreshed page shows the account ended', async () => {
    vi.useFakeTimers();
    const closed: CloseAccountOutcome = {
      kind: 'closed',
      accessEndsAt: '2026-11-20T12:00:00.000Z',
      deletionOn: '2026-12-20T12:00:00.000Z',
      refundedAmount: 3900,
    };
    const props = { i18n: english, now: NOW, ...OPEN, close: () => Promise.resolve(closed) };
    const view = renderWithMessages(<AccountOverview account={ACCOUNT} {...props} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Type your e-mail address to confirm' }), {
      target: { value: 'owner@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close the account for good' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLOSE_ACCOUNT_MIN_BUSY_MS);
    });
    view.rerender(
      <AccountOverview
        account={{ ...ACCOUNT, status: 'ended', accessEndsAt: closed.accessEndsAt }}
        {...props}
      />,
    );
    vi.useRealTimers();

    expect(screen.getByRole('status')).toHaveTextContent(
      'The account is closed. Everything is deleted on December 20, 2026.',
    );
    expect(screen.getByRole('status')).toHaveTextContent('R$39.00 were refunded to your card.');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
  });

  it('shows a suspension with its date, the reason and where to contest it', () => {
    overview({
      suspendedAt: '2026-11-19T10:00:00.000Z',
      suspensionReason: 'Events carried e-mail addresses.',
    });

    expect(screen.getByText(/^Suspended on Nov 19, 2026\./)).toBeInTheDocument();
    expect(screen.getByText('Reason: Events carried e-mail addresses.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hello@pyxis-analytics.dev' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev',
    );
  });

  it('shows a suspension without a reason', () => {
    overview({ suspendedAt: '2026-11-19T10:00:00.000Z' });

    expect(screen.getByText(/^Suspended on Nov 19, 2026\./)).toBeInTheDocument();
    expect(screen.queryByText(/^Reason:/)).not.toBeInTheDocument();
  });

  it.each([
    ['2026-11-10T00:00:00.000Z', 'Ended on Nov 10, 2026. The projects stopped measuring.'],
    [null, 'Ended. The projects stopped measuring.'],
  ] as const)(
    'says a held deletion is on hold, with no deletion date for an end on %s',
    (accessEndsAt, text) => {
      overview({ status: 'ended', accessEndsAt, deletionHeldAt: '2026-11-12T00:00:00.000Z' });

      expect(screen.getByText(text)).toBeInTheDocument();
      expect(
        screen.getByText(
          'Deletion is on hold: nothing in this account is deleted until Pyxis lifts the hold.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('region')).not.toHaveTextContent('deleted on');
    },
  );

  it('offers an ended account to subscribe again before its deletion date, with a plan choice', () => {
    overview({ status: 'ended', accessEndsAt: '2026-11-10T00:00:00.000Z' });

    expect(
      screen.getByText(
        'Subscribe again before Dec 10, 2026 to keep the data: there is no new free trial, the plan is charged from today, and the old keys stay revoked, so each project needs a new public key.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Billing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe again' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
  });

  it.each([
    ['without an end date', { accessEndsAt: null }],
    [
      'whose deletion is on hold',
      { accessEndsAt: '2026-11-10T00:00:00.000Z', deletionHeldAt: '2026-11-12T00:00:00.000Z' },
    ],
  ] as const)('offers to subscribe again with no date an ended account %s', (_, account) => {
    overview({ status: 'ended', ...account });

    expect(screen.getByText(/^Subscribe again to keep the data:/)).toBeInTheDocument();
  });

  it('offers to subscribe again only to an ended account', () => {
    overview();

    expect(screen.queryByRole('button', { name: 'Subscribe again' })).not.toBeInTheDocument();
  });

  it('says until when measuring is not paused past the limit, while Pyxis exempts the account', () => {
    const { unmount } = overview({ quotaPauseExemptUntil: '2027-01-01T00:00:00.000Z' });
    expect(
      screen.getByText('Measuring is not paused past the monthly limit until Jan 1, 2027.'),
    ).toBeInTheDocument();
    unmount();

    overview({ quotaPauseExemptUntil: '2026-11-01T00:00:00.000Z' });
    expect(screen.queryByText(/not paused past the monthly limit/)).not.toBeInTheDocument();
  });

  it('says nothing about a pause already over', () => {
    overview({ ingestionPausedUntil: '2026-11-01T00:00:00.000Z' });

    expect(screen.queryByText(/Measuring is paused/)).not.toBeInTheDocument();
  });
});

describe('BillingActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens Checkout for the plan chosen and goes there', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    const open = vi.fn<billing.OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' }),
    );
    renderWithMessages(<billing.BillingActions kind="checkout" open={open} />);
    const plan = screen.getByRole('group', { name: 'Billing' });

    expect(within(plan).getByRole('button', { name: 'Monthly' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(within(plan).getByRole('button', { name: 'Yearly' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish subscription' }));
    expect(screen.getByRole('button', { name: 'Opening Stripe…' })).toBeDisabled();
    await settle();

    expect(open).toHaveBeenCalledWith('year');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/x');
  });

  it('opens the portal', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    renderWithMessages(
      <billing.BillingActions
        kind="portal"
        open={() => Promise.resolve({ kind: 'redirect', url: 'https://billing.stripe.com/p/x' })}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Manage billing' }));
    await settle();

    expect(assign).toHaveBeenCalledWith('https://billing.stripe.com/p/x');
  });

  it.each([
    ['noBillingYet', 'There is no billing to manage yet.'],
    ['subscriptionExists', 'This account already has a subscription.'],
    ['unavailable', 'Billing is not available right now.'],
  ] as const)('explains a %s answer', async (kind, message) => {
    renderWithMessages(
      <billing.BillingActions kind="portal" open={() => Promise.resolve({ kind })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Manage billing' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(message);
  });

  it('subscribes an ended account again with the plan chosen', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    const open = vi.fn<billing.OpenCheckout>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/again' }),
    );
    renderWithMessages(<billing.BillingActions kind="resubscribe" open={open} />);

    fireEvent.click(screen.getByRole('button', { name: 'Yearly' }));
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe again' }));
    await settle();

    expect(open).toHaveBeenCalledWith('year');
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/again');
  });

  it('points to hello@ when subscribing again is not open in the dashboard', async () => {
    renderWithMessages(
      <billing.BillingActions
        kind="resubscribe"
        open={() => Promise.resolve({ kind: 'unavailable' })}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe again' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Subscribing again is not open in the dashboard yet. Write to hello@pyxis-analytics.dev and we reactivate the subscription.',
    );
  });

  it('explains any other refusal to subscribe again as usual', async () => {
    renderWithMessages(
      <billing.BillingActions
        kind="resubscribe"
        open={() => Promise.resolve({ kind: 'subscriptionExists' })}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe again' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('This account already has a subscription.');
  });

  it('says Stripe could not be opened when the call fails', async () => {
    renderWithMessages(
      <billing.BillingActions kind="checkout" open={() => Promise.reject(new Error('503'))} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Finish subscription' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('Stripe could not be opened.');
  });
});

describe('AccountNoticeBanner', () => {
  it.each([
    [{ kind: 'paymentFailed' }, 'The last charge failed. Update the card to keep measuring.'],
    [
      { kind: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' },
      'Your subscription ends on Dec 1, 2026.',
    ],
    [
      { kind: 'ended', deletionOn: '2026-12-10T00:00:00.000Z' },
      'Everything is deleted on Dec 10, 2026.',
    ],
    [
      { kind: 'paused', until: '2026-12-01T00:00:00.000Z' },
      'Measuring is paused until Dec 1, 2026',
    ],
    [{ kind: 'nearQuota', share: 0.85 }, 'This month the account has used 85.0% of its events.'],
  ] satisfies [AccountNotice, string][])('says %o and links to billing', (notice, text) => {
    render(<AccountNoticeBanner notice={notice} i18n={english} />);

    expect(screen.getByRole('note')).toHaveTextContent(text);
    expect(screen.getByRole('link', { name: 'Open billing' })).toHaveAttribute('href', '/account');
  });

  it('says an ended account keeps its data while the deletion is on hold', () => {
    render(<AccountNoticeBanner notice={{ kind: 'endedHeld' }} i18n={english} />);

    expect(screen.getByRole('note')).toHaveTextContent(
      'Your subscription ended. The deletion of its data is on hold.',
    );
  });

  it('says a free account comes back on the 1st or once subscribed, and links to subscribe', () => {
    render(
      <AccountNoticeBanner
        notice={{ kind: 'freePlanPaused', until: '2026-12-01T00:00:00.000Z', events: 10_000 }}
        i18n={english}
      />,
    );

    expect(screen.getByRole('note')).toHaveTextContent(
      "Measuring is paused: the account reached the free plan's 10,000 events this month. It comes back on Dec 1, 2026, or within a minute of subscribing.",
    );
    expect(screen.getByRole('link', { name: 'Subscribe now' })).toHaveAttribute('href', '/account');
  });

  it('says a suspended account stopped measuring and links to the reason', () => {
    render(<AccountNoticeBanner notice={{ kind: 'suspended' }} i18n={english} />);

    expect(screen.getByRole('note')).toHaveTextContent(
      'This account is suspended, so its projects stopped measuring.',
    );
    expect(screen.getByRole('link', { name: 'See why' })).toHaveAttribute('href', '/account');
  });
});
