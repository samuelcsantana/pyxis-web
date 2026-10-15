import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthenticatedError } from '@/domain/errors';
import type { IAccountsService } from '@/services/accounts/accounts-service.interface';
import { openBillingPortal, openCheckout } from './actions';

const ACCOUNT_ID = '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f';

const state = vi.hoisted<{ service: Pick<IAccountsService, 'checkout' | 'portal'> }>(() => ({
  service: {
    checkout: () => Promise.reject(new Error('checkout not set')),
    portal: () => Promise.reject(new Error('portal not set')),
  },
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({
    checkout: (accountId: string, interval: 'month' | 'year', locale: string) =>
      state.service.checkout(accountId, interval, locale),
    portal: (accountId: string, locale: string) => state.service.portal(accountId, locale),
  }),
}));

vi.mock('@/i18n/current-locale', () => ({
  currentLocale: () => Promise.resolve('pt-BR'),
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
}));

describe('billing actions', () => {
  beforeEach(() => {
    state.service = {
      checkout: vi.fn<IAccountsService['checkout']>(() =>
        Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' }),
      ),
      portal: vi.fn<IAccountsService['portal']>(() => Promise.resolve({ kind: 'noBillingYet' })),
    };
  });

  it('opens Checkout and the portal in the language of the page', async () => {
    await expect(openCheckout(ACCOUNT_ID, 'year')).resolves.toEqual({
      kind: 'redirect',
      url: 'https://checkout.stripe.com/c/x',
    });
    await expect(openBillingPortal(ACCOUNT_ID)).resolves.toEqual({ kind: 'noBillingYet' });
    expect(state.service.checkout).toHaveBeenCalledWith(ACCOUNT_ID, 'year', 'pt-BR');
    expect(state.service.portal).toHaveBeenCalledWith(ACCOUNT_ID, 'pt-BR');
  });

  it('refuses an account id or a plan the browser made up', async () => {
    await expect(openCheckout('not-an-account', 'month')).rejects.toThrow(
      'An account is named by its id.',
    );
    await expect(openCheckout(ACCOUNT_ID, 'weekly' as 'month')).rejects.toThrow(
      'A plan is billed monthly or yearly.',
    );
    await expect(openBillingPortal('not-an-account')).rejects.toThrow(
      'An account is named by its id.',
    );
    expect(state.service.checkout).not.toHaveBeenCalled();
    expect(state.service.portal).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.service.portal = () => Promise.reject(new UnauthenticatedError());

    await expect(openBillingPortal(ACCOUNT_ID)).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});
