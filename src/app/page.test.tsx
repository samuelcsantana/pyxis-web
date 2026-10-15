import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import HomePage from './page';

const state = vi.hoisted<{
  admin: unknown;
  failure: Error | undefined;
  accounts: () => Promise<readonly Account[]>;
}>(() => ({
  admin: undefined,
  failure: undefined,
  accounts: () => Promise.resolve([]),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/p-store/overview',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () =>
      state.failure === undefined ? Promise.resolve(state.admin) : Promise.reject(state.failure),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

beforeEach(() => {
  state.admin = ADMIN;
  state.failure = undefined;
  state.accounts = () => Promise.resolve([]);
});

describe('HomePage', () => {
  it('opens the first project the admin may read', async () => {
    await expect(HomePage()).rejects.toThrow('redirect:/p-store/overview');
  });

  it('explains an account without projects', async () => {
    state.admin = { ...ADMIN, projects: [] };

    renderWithMessages(await HomePage());

    expect(screen.getByRole('heading', { level: 1, name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent(
      'owner@demo-store.example can sign in, but no project was granted to it yet. Ask the operator of this Pyxis to run admin:grant for your email.',
    );
    expect(screen.getByText('admin:grant').tagName).toBe('CODE');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('offers the owner of a running account to create the first project', async () => {
    state.admin = { ...ADMIN, projects: [] };
    state.accounts = () => new MockAccountsService().list();

    renderWithMessages(await HomePage());

    expect(screen.getByRole('main')).toHaveTextContent('Your account is ready.');
    expect(screen.getByRole('link', { name: 'Create your first project' })).toHaveAttribute(
      'href',
      '/new-project',
    );
    expect(screen.queryByText('admin:grant')).not.toBeInTheDocument();
  });

  it('asks an owner whose sign-up is unfinished to finish the subscription', async () => {
    state.admin = { ...ADMIN, projects: [] };
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({
        ...account,
        status: 'incomplete',
      }));

    renderWithMessages(await HomePage());

    expect(screen.getByRole('main')).toHaveTextContent('Your account is waiting for a plan.');
    expect(screen.getByRole('link', { name: 'Finish your subscription' })).toHaveAttribute(
      'href',
      '/account',
    );
  });

  it('sends an ended session back to sign in, saying why', async () => {
    state.failure = new UnauthenticatedError();

    await expect(HomePage()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('lets any other failure reach the error boundary', async () => {
    state.failure = new ApiRequestError('/v1/me', 503);

    await expect(HomePage()).rejects.toThrow(ApiRequestError);
  });
});
