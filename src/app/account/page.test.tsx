import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import type { FreePlanState } from '@/domain/sign-up';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountPage, { DASHBOARD_HOME, generateMetadata } from './page';

const state = vi.hoisted<{
  accounts: () => Promise<readonly Account[]>;
  freePlan: FreePlanState;
}>(() => ({
  accounts: () => Promise.resolve([]),
  freePlan: 'closed',
}));

vi.mock('@/lib/free-plan-state', () => ({
  bestEffortFreePlanState: () => Promise.resolve(state.freePlan),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({ email: 'owner@example.com', projects: [] }),
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
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('AccountPage', () => {
  beforeEach(() => {
    state.accounts = () => new MockAccountsService().list();
    state.freePlan = 'closed';
  });

  it("shows the admin's owned account with its billing, and the way back", async () => {
    renderWithMessages(await AccountPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Account and billing' }),
    ).toBeInTheDocument();
    expect(screen.getByText('owner@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Free trial until/)).toBeInTheDocument();
    expect(screen.queryByText(/free plan/)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withdrawal' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close the account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
      'href',
      DASHBOARD_HOME,
    );
  });

  it('shows a paying owner, while the free plan is on, what cancelling does and the withdrawal', async () => {
    state.freePlan = 'open';
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({
        ...account,
        status: 'active',
        trialEndsAt: null,
        projectCount: 1,
        peopleCount: 1,
      }));

    renderWithMessages(await AccountPage());

    expect(
      screen.getByText(/^If you cancel, the account goes back to the free plan/),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Withdraw from the subscription' })).toBeVisible();
  });

  it('promises no free plan to an owner who already has an account on it', async () => {
    state.freePlan = 'open';
    state.accounts = async () => {
      const [paid] = await new MockAccountsService().list();
      if (paid === undefined) {
        throw new Error('The demo has an account.');
      }
      return [
        {
          ...paid,
          status: 'active',
          trialEndsAt: null,
          projectCount: 1,
          peopleCount: 1,
          mailboxHasAnotherFreeAccount: true,
        },
        { ...paid, id: 'free-account', status: 'free', billingInterval: null },
      ];
    };

    renderWithMessages(await AccountPage());

    expect(screen.queryByText(/^If you cancel/)).not.toBeInTheDocument();
  });

  it('explains that billing belongs to the owner when the admin owns no account', async () => {
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({ ...account, role: 'member' }));

    renderWithMessages(await AccountPage());

    expect(screen.getByText(/You do not own a Pyxis account/)).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Copy']);
  });

  it('closes with the support address and the reply time of the plan, for the account’s e-mail', async () => {
    renderWithMessages(await AccountPage());

    const support = screen.getByRole('region', { name: 'Support' });
    expect(within(support).getByText('hello@pyxis-analytics.dev')).toBeInTheDocument();
    expect(within(support).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(support).toHaveTextContent(
      'On the paid plan, we confirm that your message arrived and reply within 2 business days.',
    );
    expect(support).toHaveTextContent('Write from owner@example.com, so we know which account');
    expect(support).not.toHaveTextContent('On the free plan');
  });

  it('is titled after the page', async () => {
    await expect(generateMetadata()).resolves.toEqual({ title: 'Account and billing' });
  });
});
