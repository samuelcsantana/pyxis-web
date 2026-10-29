import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  Account,
  BillingRedirectOutcome,
  CloseAccountOutcome,
  WithdrawOutcome,
} from '@/domain/accounts';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccountOverview, type AccountOverviewProps } from './account-overview';
import { OPEN_BILLING_MIN_BUSY_MS } from './billing-actions';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const NOW = new Date('2026-11-20T12:00:00.000Z');

const FREE: Account = {
  id: 'a1',
  role: 'owner',
  status: 'free',
  billingInterval: null,
  trialEndsAt: null,
  currentPeriodEndsAt: null,
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
  eventsThisMonth: 3_120,
  measuredAt: '2026-11-20T03:00:00.000Z',
  limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
};

const stay = () => Promise.resolve<BillingRedirectOutcome>({ kind: 'noBillingYet' });

function overview(account: Partial<Account> = {}, props: Partial<AccountOverviewProps> = {}) {
  return renderWithMessages(
    <AccountOverview
      account={{ ...FREE, ...account }}
      i18n={english}
      now={NOW}
      freePlan="open"
      ownsAnotherFreeAccount={false}
      withdraw={() => Promise.resolve<WithdrawOutcome>({ kind: 'noPaidSubscription' })}
      openCheckout={stay}
      subscribe={stay}
      openPortal={stay}
      close={() => Promise.resolve<CloseAccountOutcome>({ kind: 'confirmationMismatch' })}
      {...props}
    />,
  );
}

function paidPlan(): HTMLElement {
  const section = screen.getByRole('heading', { name: 'The paid plan' }).parentElement;
  if (section === null) {
    throw new Error('The paid plan sits in its own block.');
  }
  return section;
}

describe('AccountOverview on the free plan', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the month used against the free plan and where measuring pauses', () => {
    overview();

    expect(screen.getByText('Free plan: up to 10,000 events a month.')).toBeInTheDocument();
    expect(screen.getByText('3,120 of 10,000')).toBeInTheDocument();
    expect(
      screen.getByText(
        'On the free plan, measuring pauses when the month reaches 10,000 events and comes back on the 1st.',
      ),
    ).toBeInTheDocument();
  });

  it('offers the paid plan, monthly or yearly, charged today', () => {
    overview();

    expect(paidPlan()).toHaveTextContent(
      'Up to 100,000 events a month, 3 projects and 3 people, for R$ 39 a month or R$ 390 a year. It is charged today and renews until you cancel.',
    );
    expect(within(paidPlan()).getByRole('button', { name: 'Monthly' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(paidPlan()).getByRole('button', { name: 'Subscribe now' })).toBeInTheDocument();
    expect(screen.queryByText(/resumes within a minute/)).not.toBeInTheDocument();
  });

  it('subscribes with the plan chosen', async () => {
    vi.useFakeTimers();
    const subscribe = vi.fn(() => Promise.resolve<BillingRedirectOutcome>({ kind: 'unavailable' }));
    overview({}, { subscribe });

    fireEvent.click(within(paidPlan()).getByRole('button', { name: 'Yearly' }));
    fireEvent.click(within(paidPlan()).getByRole('button', { name: 'Subscribe now' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(OPEN_BILLING_MIN_BUSY_MS);
    });

    expect(subscribe).toHaveBeenCalledWith('year');
    expect(within(paidPlan()).getByRole('alert')).toHaveTextContent(
      'Billing is not available right now. Try again later.',
    );
  });

  it('says, while paused, that subscribing brings measuring back within a minute', () => {
    overview({ eventsThisMonth: 10_000, ingestionPausedUntil: '2026-12-01T00:00:00.000Z' });

    expect(
      screen.getByText(
        'Measuring is paused until Dec 1, 2026: the account reached 10,000 events this month.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/On the free plan, measuring pauses/)).not.toBeInTheDocument();
    expect(paidPlan()).toHaveTextContent('Measuring resumes within a minute of subscribing.');
  });

  it('closes a free account without a subscription to cancel or a payment to refund', () => {
    overview();

    expect(
      screen.getByText(
        'Revokes the keys of every project, so the sites stop sending events. Everything is deleted thirty days later; export what you need first.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Cancels the subscription/)).not.toBeInTheDocument();
    expect(screen.queryByText(/refunded in full/)).not.toBeInTheDocument();
  });

  it('offers the paid plan only to a free account', () => {
    overview({ status: 'active', billingInterval: 'month' });

    expect(screen.queryByRole('heading', { name: 'The paid plan' })).not.toBeInTheDocument();
    expect(screen.queryByText(/On the free plan, measuring pauses/)).not.toBeInTheDocument();
  });

  it('says by when a withdrawn account has to fit, and what to delete and remove', () => {
    overview({ freePlanFitDueAt: '2026-12-20T12:00:00.000Z', projectCount: 3, peopleCount: 2 });

    expect(
      screen.getByText(
        'This account holds more than the free plan. Make it fit by Dec 20, 2026, or the account ends that day:',
      ),
    ).toBeInTheDocument();
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual([
      'Delete 2 projects: the free plan holds 1 project.',
      'Remove 1 person: the free plan holds 1 person, you included.',
    ]);
    expect(
      screen.getByText("Projects are deleted, and people removed, in each project's Settings."),
    ).toBeInTheDocument();
  });

  it.each([
    [{ projectCount: 2, peopleCount: 1 }, ['Delete 1 project: the free plan holds 1 project.']],
    [
      { projectCount: 1, peopleCount: 3 },
      ['Remove 2 people: the free plan holds 1 person, you included.'],
    ],
  ])('names only what is over the free plan for %o', (counts, items) => {
    overview({ freePlanFitDueAt: '2026-12-20T12:00:00.000Z', ...counts });

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(items);
  });

  it('says nothing about fitting once the account fits', () => {
    overview({ freePlanFitDueAt: '2026-12-20T12:00:00.000Z' });

    expect(screen.queryByText(/Make it fit by/)).not.toBeInTheDocument();
  });
});

const PAID: Partial<Account> = {
  status: 'active',
  billingInterval: 'month',
  currentPeriodEndsAt: '2026-12-01T00:00:00.000Z',
  eventsThisMonth: 41_230,
  limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
};

describe('AccountOverview of a paid account while the free plan is on', () => {
  it('says cancelling takes an account that fits back to the free plan', () => {
    overview(PAID);

    expect(
      screen.getByText(
        'If you cancel, the account goes back to the free plan at the end of the period, with its projects and data: up to 10,000 events a month, and above that measuring pauses until the 1st.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('names the day a cancelled account goes back to the free plan', () => {
    overview({ ...PAID, status: 'ending', accessEndsAt: '2026-12-01T00:00:00.000Z' });

    expect(
      screen.getByText(/^On Dec 1, 2026 the account goes back to the free plan/),
    ).toBeInTheDocument();
  });

  it('says a cancelled account with no end date goes back at the end of the period', () => {
    overview({ ...PAID, status: 'ending' });

    expect(
      screen.getByText(/^At the end of the period the account goes back to the free plan/),
    ).toBeInTheDocument();
  });

  it('promises no return to the free plan while the earlier terms still bind the account', () => {
    overview({ ...PAID, boundByFreePlanTerms: false, projectCount: 3, peopleCount: 2 });

    expect(screen.queryByText(/^If you cancel/)).not.toBeInTheDocument();
    expect(screen.queryByText(/To keep it on the free plan/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('says what to remove for an account that does not fit, or it ends', () => {
    overview({ ...PAID, projectCount: 3, peopleCount: 2 });

    expect(
      screen.getByText(
        'If you cancel, the account ends at the end of the period. To keep it on the free plan instead, make it fit before then:',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Delete 2 projects: the free plan holds 1 project.',
      'Remove 1 person: the free plan holds 1 person, you included.',
    ]);
  });

  it.each([
    [{ accessEndsAt: '2026-12-01T00:00:00.000Z' }, /^On Dec 1, 2026 the account ends\./],
    [{}, /^At the end of the period the account ends\./],
  ])('dates the end of a cancelled account that does not fit (%o)', (end, text) => {
    overview({ ...PAID, status: 'ending', projectCount: 2, ...end });

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('promises nothing when the owner already has an account on the free plan', () => {
    overview(PAID, { ownsAnotherFreeAccount: true });

    expect(screen.queryByText(/^If you cancel/)).not.toBeInTheDocument();
  });

  it('offers to withdraw a paid account, and not one in its free trial', () => {
    const { unmount } = overview(PAID);
    expect(screen.getByRole('heading', { name: 'Withdrawal' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Withdraw from the subscription' }),
    ).toBeInTheDocument();
    unmount();

    overview({ ...PAID, status: 'trialing', trialEndsAt: '2026-11-29T12:00:00.000Z' });
    expect(screen.queryByRole('heading', { name: 'Withdrawal' })).not.toBeInTheDocument();
    expect(screen.getByText(/^If you cancel, the account goes back/)).toBeInTheDocument();
  });

  it('shows nothing new while the free plan is closed', () => {
    overview(PAID, { freePlan: 'closed' });

    expect(screen.queryByText(/free plan/)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdrawal' })).not.toBeInTheDocument();
  });
});

describe('AccountOverview without the free trial, while the free plan is on', () => {
  it('asks an unfinished sign-up to subscribe, charged from today', () => {
    overview({ status: 'incomplete', eventsThisMonth: null, measuredAt: null });

    expect(
      screen.getByText(
        'The subscription was not finished. Choose a plan to subscribe; it is charged from today.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/free trial/)).not.toBeInTheDocument();
  });

  it('asks an ended account to subscribe again without naming a trial', () => {
    overview({
      status: 'ended',
      billingInterval: 'month',
      accessEndsAt: '2026-11-10T00:00:00.000Z',
    });

    expect(
      screen.getByText(
        'Subscribe again before Dec 10, 2026 to keep the data: the plan is charged from today, and the old keys stay revoked, so each project needs a new public key.',
      ),
    ).toBeInTheDocument();
  });

  it('asks an ended account with no end date, or a held deletion, to subscribe again', () => {
    overview({ status: 'ended', billingInterval: 'month' });

    expect(
      screen.getByText(
        'Subscribe again to keep the data: the plan is charged from today, and the old keys stay revoked, so each project needs a new public key.',
      ),
    ).toBeInTheDocument();
  });

  it('keeps the trial in both texts while the free plan is closed', () => {
    const { unmount } = overview(
      { status: 'incomplete', eventsThisMonth: null, measuredAt: null },
      { freePlan: 'closed' },
    );
    expect(screen.getByText(/to start the free trial\.$/)).toBeInTheDocument();
    unmount();

    overview({ status: 'ended', billingInterval: 'month' }, { freePlan: 'closed' });
    expect(screen.getByText(/there is no new free trial/)).toBeInTheDocument();
  });
});
