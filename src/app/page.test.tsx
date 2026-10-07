import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import HomePage from './page';

const state = vi.hoisted<{ admin: unknown; failure: Error | undefined }>(() => ({
  admin: undefined,
  failure: undefined,
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
});

describe('HomePage', () => {
  it('opens the first project the admin may read', async () => {
    await expect(HomePage()).rejects.toThrow('redirect:/p-store/overview');
  });

  it('explains an account without projects', async () => {
    state.admin = { ...ADMIN, projects: [] };

    render(await HomePage());

    expect(screen.getByRole('heading', { level: 1, name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
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
