import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { DEMO_ACCOUNT_ID } from '../projects/demo-project-settings';
import { createAccountsService } from './accounts-service.factory';
import {
  BILLING_ERROR_CODES,
  HttpAccountsService,
  MY_ACCOUNTS_PATH,
} from './http-accounts-service';
import { DEMO_BILLING_URL, DEMO_WELCOME_URL, MockAccountsService } from './mock-accounts-service';

const NOW = new Date('2026-11-20T12:00:00.000Z');

function serviceWith(writer: Record<string, unknown>, reader: Record<string, unknown> = {}) {
  return new HttpAccountsService(reader as unknown as ApiReader, writer as unknown as ApiWriter);
}

type Post = (path: string, body: unknown, schema: unknown) => Promise<unknown>;

describe('HttpAccountsService', () => {
  it('lists the accounts of the signed-in admin', async () => {
    const get = vi.fn(() => Promise.resolve([]));

    await expect(serviceWith({}, { get }).list()).resolves.toEqual([]);
    expect(get).toHaveBeenCalledWith(MY_ACCOUNTS_PATH, expect.anything());
  });

  it('opens Checkout for an interval in the language of the page', async () => {
    const post = vi.fn<Post>(() => Promise.resolve('https://checkout.stripe.com/c/x'));

    await expect(serviceWith({ post }).checkout('a/1', 'year', 'pt-BR')).resolves.toEqual({
      kind: 'redirect',
      url: 'https://checkout.stripe.com/c/x',
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      '/v1/accounts/a%2F1/checkout',
      { interval: 'year', locale: 'pt-BR' },
    ]);
  });

  it('opens the billing portal in the language of the page', async () => {
    const post = vi.fn<Post>(() => Promise.resolve('https://billing.stripe.com/p/x'));

    await expect(serviceWith({ post }).portal('a1', 'es')).resolves.toEqual({
      kind: 'redirect',
      url: 'https://billing.stripe.com/p/x',
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual(['/v1/accounts/a1/portal', { locale: 'es' }]);
  });

  it.each([
    [BILLING_ERROR_CODES.noBillingYet, 409, 'noBillingYet'],
    [BILLING_ERROR_CODES.subscriptionExists, 409, 'subscriptionExists'],
    [BILLING_ERROR_CODES.unavailable, 503, 'unavailable'],
  ])('answers the refusal %s as %s', async (code, status, kind) => {
    const post = vi.fn(() => Promise.reject(new ApiRequestError('/v1/accounts/a1', status, code)));

    await expect(serviceWith({ post }).portal('a1', 'en')).resolves.toEqual({ kind });
  });

  it('answers unavailable when the API knows no Checkout, as while sign-up is closed', async () => {
    const post = vi.fn(() => Promise.reject(new ApiNotFoundError('/v1/accounts/a1/checkout')));

    await expect(serviceWith({ post }).checkout('a1', 'month', 'en')).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it.each([
    [new ApiRequestError('/v1/accounts/a1', 409, 'something_else')],
    [new ApiRequestError('/v1/accounts/a1', 500)],
    [new UnauthenticatedError()],
  ])('lets %s through', async (failure) => {
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).checkout('a1', 'month', 'en')).rejects.toBe(failure);
  });
});

describe('HttpAccountsService close', () => {
  it('closes an account with the e-mail typed again, trimmed', async () => {
    const post = vi.fn<Post>((_path, _body, schema) =>
      Promise.resolve(
        (schema as { parse(body: unknown): unknown }).parse({
          access_ends_at: '2026-11-20T12:00:00.000Z',
          deletion_on: '2026-12-20T12:00:00.000Z',
          refunded_amount: 3900,
        }),
      ),
    );

    await expect(serviceWith({ post }).close('a/1', ' owner@example.com ')).resolves.toEqual({
      kind: 'closed',
      accessEndsAt: '2026-11-20T12:00:00.000Z',
      deletionOn: '2026-12-20T12:00:00.000Z',
      refundedAmount: 3900,
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      '/v1/accounts/a%2F1/close',
      { confirm_email: 'owner@example.com' },
    ]);
  });

  it.each([
    [BILLING_ERROR_CODES.confirmationMismatch, 409, 'confirmationMismatch'],
    [BILLING_ERROR_CODES.accountEnded, 409, 'alreadyEnded'],
    [BILLING_ERROR_CODES.unavailable, 503, 'unavailable'],
  ])('answers the refusal %s as %s', async (code, status, kind) => {
    const post = vi.fn(() =>
      Promise.reject(new ApiRequestError('/v1/accounts/a1/close', status, code)),
    );

    await expect(serviceWith({ post }).close('a1', 'x@example.com')).resolves.toEqual({ kind });
  });

  it.each([[new ApiRequestError('/v1/accounts/a1/close', 500)], [new UnauthenticatedError()]])(
    'lets %s through',
    async (failure) => {
      const post = vi.fn(() => Promise.reject(failure));

      await expect(serviceWith({ post }).close('a1', 'x@example.com')).rejects.toBe(failure);
    },
  );
});

describe('MockAccountsService', () => {
  it('lists the demo account at the start of its free trial, owned by the demo admin', async () => {
    const [account] = await new MockAccountsService(() => NOW).list();

    expect(account).toMatchObject({
      id: DEMO_ACCOUNT_ID,
      role: 'owner',
      status: 'trialing',
      trialEndsAt: '2026-12-04T12:00:00.000Z',
      month: '2026-11',
      eventsThisMonth: 41_230,
      measuredAt: '2026-11-20T09:00:00.000Z',
    });
  });

  it('sends Checkout to the welcome page and the portal back to the account page', async () => {
    const service = new MockAccountsService();

    await expect(service.checkout()).resolves.toEqual({ kind: 'redirect', url: DEMO_WELCOME_URL });
    expect(DEMO_WELCOME_URL).toBe(`/welcome?account=${DEMO_ACCOUNT_ID}`);
    await expect(service.portal()).resolves.toEqual({ kind: 'redirect', url: DEMO_BILLING_URL });
  });

  it("closes the demo account only with the demo owner's address", async () => {
    const service = new MockAccountsService(() => NOW);

    await expect(service.close(DEMO_ACCOUNT_ID, ' Owner@Demo-Store.example ')).resolves.toEqual({
      kind: 'closed',
      accessEndsAt: NOW.toISOString(),
      deletionOn: '2026-12-20T12:00:00.000Z',
      refundedAmount: 0,
    });
    await expect(service.close(DEMO_ACCOUNT_ID, 'someone@example.com')).resolves.toEqual({
      kind: 'confirmationMismatch',
    });
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    const [account] = await new MockAccountsService().list();
    vi.useRealTimers();

    expect(account?.month).toBe('2026-11');
  });
});

describe('createAccountsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    expect(createAccountsService()).toBeInstanceOf(HttpAccountsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createAccountsService()).toBeInstanceOf(MockAccountsService);
  });
});
