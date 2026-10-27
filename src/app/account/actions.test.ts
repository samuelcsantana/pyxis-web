import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthenticatedError } from '@/domain/errors';
import { FREE_PLAN_CHECKOUT_COOKIE_NAME } from '@/lib/free-plan-checkout';
import type { IAccountsService } from '@/services/accounts/accounts-service.interface';
import {
  closeAccount,
  openBillingPortal,
  openCheckout,
  subscribeFromFreePlan,
  withdrawToFreePlan,
} from './actions';

const ACCOUNT_ID = '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f';

const state = vi.hoisted<{
  service: Pick<IAccountsService, 'checkout' | 'portal' | 'close' | 'withdraw'>;
  cookies: Map<string, string>;
}>(() => ({
  service: {
    checkout: () => Promise.reject(new Error('checkout not set')),
    portal: () => Promise.reject(new Error('portal not set')),
    close: () => Promise.reject(new Error('close not set')),
    withdraw: () => Promise.reject(new Error('withdraw not set')),
  },
  cookies: new Map(),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({
    checkout: (accountId: string, interval: 'month' | 'year', locale: string) =>
      state.service.checkout(accountId, interval, locale),
    portal: (accountId: string, locale: string) => state.service.portal(accountId, locale),
    close: (accountId: string, confirmEmail: string) =>
      state.service.close(accountId, confirmEmail),
    withdraw: (accountId: string) => state.service.withdraw(accountId),
  }),
}));

vi.mock('@/i18n/current-locale', () => ({
  currentLocale: () => Promise.resolve('pt-BR'),
}));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: () => undefined,
      set: (name: string, value: string) => {
        state.cookies.set(name, value);
      },
    }),
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

beforeEach(() => {
  state.service = {
    checkout: vi.fn<IAccountsService['checkout']>(() =>
      Promise.resolve({ kind: 'redirect', url: 'https://checkout.stripe.com/c/x' }),
    ),
    portal: vi.fn<IAccountsService['portal']>(() => Promise.resolve({ kind: 'noBillingYet' })),
    close: vi.fn<IAccountsService['close']>(() => Promise.resolve({ kind: 'alreadyEnded' })),
    withdraw: vi.fn<IAccountsService['withdraw']>(() =>
      Promise.resolve({ kind: 'withdrawn', refundedAmount: 3_900, fitBy: null }),
    ),
  };
  state.cookies.clear();
});

describe('billing actions', () => {
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

  it('opens Checkout from the free plan and remembers it for the welcome page', async () => {
    await expect(subscribeFromFreePlan(ACCOUNT_ID, 'month')).resolves.toEqual({
      kind: 'redirect',
      url: 'https://checkout.stripe.com/c/x',
    });
    expect(state.service.checkout).toHaveBeenCalledWith(ACCOUNT_ID, 'month', 'pt-BR');
    expect(state.cookies.get(FREE_PLAN_CHECKOUT_COOKIE_NAME)).toBe(ACCOUNT_ID);
  });

  it('remembers nothing when Checkout was not opened', async () => {
    state.service.checkout = () => Promise.resolve({ kind: 'unavailable' });

    await expect(subscribeFromFreePlan(ACCOUNT_ID, 'year')).resolves.toEqual({
      kind: 'unavailable',
    });
    expect(state.cookies.size).toBe(0);
  });

  it('sends an expired session back to sign-in', async () => {
    state.service.portal = () => Promise.reject(new UnauthenticatedError());

    await expect(openBillingPortal(ACCOUNT_ID)).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});

describe('closeAccount', () => {
  it('closes with the address trimmed, and refuses one that is not an address before asking', async () => {
    await expect(closeAccount(ACCOUNT_ID, ' owner@example.com ')).resolves.toEqual({
      kind: 'alreadyEnded',
    });
    await expect(closeAccount(ACCOUNT_ID, 'owner@')).resolves.toEqual({
      kind: 'confirmationMismatch',
    });
    await expect(closeAccount('not-an-account', 'owner@example.com')).rejects.toThrow(
      'An account is named by its id.',
    );
    expect(state.service.close).toHaveBeenCalledTimes(1);
    expect(state.service.close).toHaveBeenCalledWith(ACCOUNT_ID, 'owner@example.com');
  });
});

describe('withdrawToFreePlan', () => {
  it('withdraws the account it names', async () => {
    await expect(withdrawToFreePlan(ACCOUNT_ID)).resolves.toEqual({
      kind: 'withdrawn',
      refundedAmount: 3_900,
      fitBy: null,
    });
    expect(state.service.withdraw).toHaveBeenCalledWith(ACCOUNT_ID);
  });

  it('refuses an account id the browser made up before asking', async () => {
    await expect(withdrawToFreePlan('not-an-account')).rejects.toThrow(
      'An account is named by its id.',
    );
    expect(state.service.withdraw).not.toHaveBeenCalled();
  });
});
