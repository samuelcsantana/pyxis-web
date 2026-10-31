import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type AccountPageProps,
  type AccountSectionPageProps,
  AccountSectionPage,
  DASHBOARD_HOME,
} from '@/app/[projectId]/settings/settings-sections';
import type {
  Account,
  BillingInterval,
  BillingRedirectOutcome,
  CloseAccountOutcome,
  WithdrawOutcome,
} from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { FreePlanState } from '@/domain/sign-up';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountPlanPage, { generateMetadata } from './page';

const state = vi.hoisted<{
  admin: Admin;
  accounts: () => Promise<readonly Account[]>;
  freePlan: FreePlanState;
}>(() => ({
  admin: { email: 'owner@example.com', projects: [] },
  accounts: () => Promise.resolve([]),
  freePlan: 'closed',
}));

const actions = vi.hoisted(() => ({
  openCheckout: vi.fn<
    (accountId: string, interval: BillingInterval) => Promise<BillingRedirectOutcome>
  >(() => new Promise<BillingRedirectOutcome>(() => undefined)),
  subscribeFromFreePlan: vi.fn<
    (accountId: string, interval: BillingInterval) => Promise<BillingRedirectOutcome>
  >(() => new Promise<BillingRedirectOutcome>(() => undefined)),
  openBillingPortal: vi.fn<(accountId: string) => Promise<BillingRedirectOutcome>>(
    () => new Promise<BillingRedirectOutcome>(() => undefined),
  ),
  withdrawToFreePlan: vi.fn<(accountId: string) => Promise<WithdrawOutcome>>(
    () => new Promise<WithdrawOutcome>(() => undefined),
  ),
  closeAccount: vi.fn<(accountId: string, confirmEmail: string) => Promise<CloseAccountOutcome>>(
    () => new Promise<CloseAccountOutcome>(() => undefined),
  ),
}));

vi.mock('./actions', () => actions);

vi.mock('@/lib/free-plan-state', () => ({
  bestEffortFreePlanState: () => Promise.resolve(state.freePlan),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/account',
  useSearchParams: () => new URLSearchParams(),
}));

const PLAN_TITLE = 'Account and billing';
const ACCOUNT_LINKS = [
  '/account',
  '/account/preferences',
  '/account/sessions',
  '/account/tokens',
  '/account/apps',
];
const CHECKOUT_ACCOUNT_ID = '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f';
const FREE_ACCOUNT_ID = '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a';
const PAID_ACCOUNT_ID = '3e4f5a6b-7c8d-4e9f-8a1b-2c3d4e5f6a7b';
const SHARED_ACCOUNT_ID = '4f5a6b7c-8d9e-4f0a-9b2c-3d4e5f6a7b8c';
const CANCELLING_PROMISE = /^If you cancel, the account goes back to the free plan/;

async function demoAccount(): Promise<Account> {
  const [account] = await new MockAccountsService().list();
  if (account === undefined) {
    throw new Error('The demo has an account.');
  }
  return account;
}

async function paidAccount(): Promise<Account> {
  return {
    ...(await demoAccount()),
    id: PAID_ACCOUNT_ID,
    status: 'active',
    billingInterval: 'year',
    trialEndsAt: null,
    projectCount: 1,
    peopleCount: 1,
    mailboxHasAnotherFreeAccount: null,
  };
}

async function freeAccount(role: Account['role']): Promise<Account> {
  return {
    ...(await demoAccount()),
    id: FREE_ACCOUNT_ID,
    role,
    status: 'free',
    billingInterval: null,
    trialEndsAt: null,
    currentPeriodEndsAt: null,
  };
}

function pageProps(): AccountPageProps {
  return { searchParams: Promise.resolve({}) };
}

async function planPage() {
  const element: ReactElement<AccountSectionPageProps> = AccountPlanPage(pageProps());
  expect(element.type).toBe(AccountSectionPage);
  expect(element.props.section).toBe('plan');
  return AccountSectionPage(element.props);
}

function planRegion() {
  return screen.getByRole('region', { name: PLAN_TITLE });
}

function cardOf(plan: string) {
  return within(planRegion()).getByRole('region', { name: plan });
}

function menuLinks() {
  return within(screen.getByRole('navigation', { name: 'Sections' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'));
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
  vi.clearAllMocks();
  state.admin = { email: 'owner@example.com', projects: [] };
  state.accounts = () => new MockAccountsService().list();
  state.freePlan = 'closed';
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the full page of the plan part of the account', () => {
  it("shows the admin's owned account with its plan, status and billing under Settings, and the way back", async () => {
    renderWithMessages(await planPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: PLAN_TITLE })).toBeInTheDocument();
    const card = cardOf('Plan: Monthly');
    expect(card).toHaveTextContent(/Free trial until/);
    expect(within(card).getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
    expect(screen.queryByText(/free plan/)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdrawal' })).not.toBeInTheDocument();
    const closing = within(planRegion()).getByRole('region', { name: 'Close the account' });
    expect(within(closing).getByRole('button', { name: 'Close the account' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    const menu = screen.getByRole('navigation', { name: 'Sections' });
    expect(within(menu).getByText('owner@example.com')).toBeInTheDocument();
    expect(within(menu).getByText('You')).toBeInTheDocument();
    expect(menuLinks()).toEqual(ACCOUNT_LINKS);
    expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', '/account');
    expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
      'href',
      DASHBOARD_HOME,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('lists every account the admin owns with its own status, and leaves out the ones shared with it', async () => {
    state.accounts = async () => {
      const demo = await demoAccount();
      return [
        { ...demo, status: 'ending', accessEndsAt: '2026-11-20T12:00:00.000Z' },
        await freeAccount('owner'),
        {
          ...demo,
          id: SHARED_ACCOUNT_ID,
          role: 'member',
          status: 'past_due',
          billingInterval: 'year',
        },
      ];
    };

    renderWithMessages(await planPage());

    expect(cardOf('Plan: Monthly')).toHaveTextContent(
      'Cancelled. Access continues until Nov 20, 2026, with no further charge.',
    );
    expect(cardOf('Plan')).toHaveTextContent('Free plan: up to 100,000 events a month.');
    expect(
      within(planRegion()).queryByRole('region', { name: 'Plan: Yearly' }),
    ).not.toBeInTheDocument();
    expect(planRegion()).not.toHaveTextContent('The last charge failed.');
    expect(within(planRegion()).getAllByRole('region', { name: 'Close the account' })).toHaveLength(
      2,
    );
  });

  it('shows a paying owner, while the free plan is on, what cancelling does and the withdrawal', async () => {
    state.freePlan = 'open';
    state.accounts = async () => [await paidAccount()];

    renderWithMessages(await planPage());

    const card = cardOf('Plan: Yearly');
    expect(within(card).getByText(CANCELLING_PROMISE)).toBeVisible();
    expect(
      within(card).getByRole('button', { name: 'Withdraw from the subscription' }),
    ).toBeVisible();
  });

  it('promises no free plan to an owner whose mailbox already has an account on it', async () => {
    state.freePlan = 'open';
    state.accounts = async () => [{ ...(await paidAccount()), mailboxHasAnotherFreeAccount: true }];

    renderWithMessages(await planPage());

    expect(screen.queryByText(/^If you cancel/)).not.toBeInTheDocument();
  });

  it('promises no free plan to an owner who owns another account on it', async () => {
    state.freePlan = 'open';
    state.accounts = async () => [await paidAccount(), await freeAccount('owner')];

    renderWithMessages(await planPage());

    expect(within(cardOf('Plan: Yearly')).queryByText(/^If you cancel/)).not.toBeInTheDocument();
  });

  it('still promises the free plan when the account on it belongs to someone else', async () => {
    state.freePlan = 'open';
    state.accounts = async () => [await paidAccount(), await freeAccount('member')];

    renderWithMessages(await planPage());

    expect(within(cardOf('Plan: Yearly')).getByText(CANCELLING_PROMISE)).toBeVisible();
    expect(within(planRegion()).queryByRole('region', { name: 'Plan' })).not.toBeInTheDocument();
  });

  it('explains that billing belongs to the owner when the admin owns no account', async () => {
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({ ...account, role: 'member' }));

    renderWithMessages(await planPage());

    const plan = planRegion();
    expect(within(plan).getByText(/You do not own a Pyxis account/)).toBeInTheDocument();
    expect(within(plan).queryByRole('region', { name: /^Plan/ })).not.toBeInTheDocument();
    expect(within(plan).queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
    expect(
      within(plan).queryByRole('button', { name: 'Close the account' }),
    ).not.toBeInTheDocument();
    expect(
      within(within(plan).getByRole('region', { name: 'Support' })).getByRole('button', {
        name: 'Copy',
      }),
    ).toBeInTheDocument();
  });

  it('keeps the support address for an admin with no project, who has no Help to go to', async () => {
    renderWithMessages(await planPage());

    const support = within(planRegion()).getByRole('region', { name: 'Support' });
    expect(within(support).getByText('hello@pyxis-analytics.dev')).toBeInTheDocument();
    expect(support).toHaveTextContent('Write from owner@example.com, so we know which account');
    expect(menuLinks()).toEqual(ACCOUNT_LINKS);
  });

  it('lists Help and support last, at the first project of an admin who has one', async () => {
    state.admin = {
      email: 'owner@example.com',
      projects: [
        { id: DEMO_STORE.id, name: 'My site', timezone: 'Europe/Lisbon', conversionEvent: null },
      ],
    };

    renderWithMessages(await planPage());

    expect(menuLinks()).toEqual([...ACCOUNT_LINKS, `/${DEMO_STORE.id}/help`]);
    expect(within(planRegion()).queryByRole('region', { name: 'Support' })).not.toBeInTheDocument();
  });

  it('binds every billing action of an owned account to that account', async () => {
    const user = userEvent.setup();
    state.freePlan = 'open';
    state.accounts = async () => [
      {
        ...(await demoAccount()),
        id: CHECKOUT_ACCOUNT_ID,
        status: 'incomplete',
        trialEndsAt: null,
      },
      await freeAccount('owner'),
      await paidAccount(),
    ];
    renderWithMessages(await planPage());

    await user.click(
      within(cardOf('Plan: Monthly')).getByRole('button', { name: 'Finish subscription' }),
    );
    await user.click(within(cardOf('Plan')).getByRole('button', { name: 'Yearly' }));
    await user.click(within(cardOf('Plan')).getByRole('button', { name: 'Subscribe now' }));
    const paid = cardOf('Plan: Yearly');
    await user.click(within(paid).getByRole('button', { name: 'Manage billing' }));
    await user.click(within(paid).getByRole('button', { name: 'Withdraw from the subscription' }));
    await user.click(within(paid).getByRole('button', { name: 'Withdraw and get the refund' }));
    const closings = within(planRegion()).getAllByRole('region', { name: 'Close the account' });
    expect(closings).toHaveLength(3);
    const paidClosing = closings[2];
    if (paidClosing === undefined) {
      throw new Error('Every owned account can be closed.');
    }
    await user.click(within(paidClosing).getByRole('button', { name: 'Close the account' }));
    await user.type(
      within(paidClosing).getByRole('textbox', { name: 'Type your e-mail address to confirm' }),
      'owner@example.com',
    );
    await user.click(
      within(paidClosing).getByRole('button', { name: 'Close the account for good' }),
    );

    expect(actions.openCheckout.mock.calls).toEqual([[CHECKOUT_ACCOUNT_ID, 'month']]);
    expect(actions.subscribeFromFreePlan.mock.calls).toEqual([[FREE_ACCOUNT_ID, 'year']]);
    expect(actions.openBillingPortal.mock.calls).toEqual([[PAID_ACCOUNT_ID]]);
    expect(actions.withdrawToFreePlan.mock.calls).toEqual([[PAID_ACCOUNT_ID]]);
    expect(actions.closeAccount.mock.calls).toEqual([[PAID_ACCOUNT_ID, 'owner@example.com']]);
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.accounts = () => Promise.reject(new UnauthenticatedError());

    await expect(planPage()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('is titled after the plan part', async () => {
    await expect(generateMetadata()).resolves.toEqual({ title: PLAN_TITLE });
  });
});
