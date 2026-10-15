import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  Account,
  AccountNotice,
  BillingRedirectOutcome,
  CloseAccountOutcome,
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
  month: '2026-11',
  eventsThisMonth: 41_230,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3 },
};

const OPEN = {
  openCheckout: () => Promise.resolve<BillingRedirectOutcome>({ kind: 'noBillingYet' }),
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
    [{ status: 'comped', billingInterval: null }, 'A free account, given by Pyxis.'],
  ] as const)('describes %o', (account, text) => {
    overview(account);

    expect(screen.getByRole('region')).toHaveTextContent(text);
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

    expect(screen.getByText(/Measuring is paused until Dec 1, 2026/)).toBeInTheDocument();
    expect(container.querySelector('.bg-bad')).toHaveStyle({ width: '100%' });
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
});
