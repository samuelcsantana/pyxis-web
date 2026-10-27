import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Account, BillingRedirectOutcome, CloseAccountOutcome } from '@/domain/accounts';
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
