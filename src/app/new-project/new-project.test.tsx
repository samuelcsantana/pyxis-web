import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectChanges } from '@/domain/project-management';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_ACCOUNT_ID } from '@/services/projects/demo-project-settings';
import type { IProjectManagementService } from '@/services/project-management/project-management-service.interface';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { createProject } from './actions';
import NewProjectPage, { DASHBOARD_HOME, generateMetadata } from './page';

const CHANGES: ProjectChanges = {
  name: 'Shop',
  allowedOrigins: ['https://shop.example.com'],
  timezone: 'UTC',
  conversionEvent: null,
};

const state = vi.hoisted<{
  accounts: () => Promise<readonly Account[]>;
  create: IProjectManagementService['create'];
}>(() => ({
  accounts: () => Promise.resolve([]),
  create: () => Promise.reject(new Error('create not set')),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

vi.mock('@/services/project-management/project-management-service.factory', () => ({
  createProjectManagementService: () => ({
    create: (accountId: string, changes: ProjectChanges) => state.create(accountId, changes),
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
  useRouter: () => ({ push: vi.fn() }),
}));

describe('NewProjectPage', () => {
  beforeEach(() => {
    state.accounts = () => new MockAccountsService().list();
  });

  it('offers the form to the owner of a running account, with the way back', async () => {
    renderWithMessages(await NewProjectPage());

    expect(screen.getByRole('heading', { level: 1, name: 'New project' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
      'href',
      DASHBOARD_HOME,
    );
  });

  it('explains who creates projects to someone without such an account', async () => {
    state.accounts = async () =>
      (await new MockAccountsService().list()).map((account) => ({ ...account, status: 'ended' }));

    renderWithMessages(await NewProjectPage());

    expect(screen.getByText(/Only the owner of an account/)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('is titled after the page', async () => {
    await expect(generateMetadata()).resolves.toEqual({ title: 'New project' });
  });
});

describe('createProject', () => {
  it('creates the project in the account, refusing what the browser made up', async () => {
    const create = vi.fn<IProjectManagementService['create']>(() =>
      Promise.resolve({ kind: 'limitReached' }),
    );
    state.create = create;

    await expect(createProject(DEMO_ACCOUNT_ID, CHANGES)).resolves.toEqual({
      kind: 'limitReached',
    });
    await expect(
      createProject(DEMO_ACCOUNT_ID, { ...CHANGES, allowedOrigins: [] }),
    ).resolves.toEqual({ kind: 'invalid' });
    await expect(createProject('not-an-account', CHANGES)).rejects.toThrow(
      'A project is created in an account named by its id.',
    );
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(DEMO_ACCOUNT_ID, CHANGES);
  });

  it('sends an expired session back to sign-in', async () => {
    state.create = () => Promise.reject(new UnauthenticatedError());

    await expect(createProject(DEMO_ACCOUNT_ID, CHANGES)).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});
