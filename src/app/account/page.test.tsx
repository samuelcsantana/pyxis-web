import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountPage, { DASHBOARD_HOME, generateMetadata } from './page';

const state = vi.hoisted<{ accounts: () => Promise<readonly Account[]> }>(() => ({
  accounts: () => Promise.resolve([]),
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
  });

  it("shows the admin's owned account with its billing, and the way back", async () => {
    renderWithMessages(await AccountPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Account and billing' }),
    ).toBeInTheDocument();
    expect(screen.getByText('owner@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Free trial until/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close the account for good' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
      'href',
      DASHBOARD_HOME,
    );
  });

  it('explains that billing belongs to the owner when the admin owns no account', async () => {
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({ ...account, role: 'member' }));

    renderWithMessages(await AccountPage());

    expect(screen.getByText(/You do not own a Pyxis account/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is titled after the page', async () => {
    await expect(generateMetadata()).resolves.toEqual({ title: 'Account and billing' });
  });
});
