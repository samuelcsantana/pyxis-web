import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, RateLimitedError } from '@/domain/errors';
import { openSignUpOf } from '@/domain/sign-up';
import { DEMO_SIGN_IN_CODE } from '../auth/mock-auth-service';
import { DEMO_ACCOUNT_ID } from '../projects/demo-project-settings';
import { HttpSignUpService, SIGN_UP_PATH } from './http-sign-up-service';
import { DEMO_TERMS_URL, DEMO_TERMS_VERSION, MockSignUpService } from './mock-sign-up-service';
import { createSignUpService } from './sign-up-service.factory';

vi.mock('@/app/sign-in/actions', () => ({ keepSession: () => Promise.resolve() }));

const API = 'https://api.pyxis.example.com';
const TOKEN = 'T'.repeat(43);
const ACCOUNT = '7d3f9b1e-5a2c-4e8d-9f6b-1c4a7e2d8b5f';

function answer(status: number, body: unknown = null) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(
      new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpSignUpService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads whether sign-up is open, never from a cache', async () => {
    const fetchMock = answer(200, {
      open: true,
      terms_version: '2026-11-01',
      terms_url: 'https://pyxis.example.com/terms',
      free_plan: 'open',
    });

    await expect(new HttpSignUpService(API, vi.fn()).status()).resolves.toEqual({
      open: true,
      termsVersion: '2026-11-01',
      termsUrl: 'https://pyxis.example.com/terms',
      freePlan: 'open',
    });
    expect(fetchMock).toHaveBeenCalledWith(`${API}${SIGN_UP_PATH}`, { cache: 'no-store' });
  });

  it('lets a failed status read through', async () => {
    answer(503);

    await expect(new HttpSignUpService(API, vi.fn()).status()).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });

  it('asks for a code with the trimmed address and the page language, without credentials', async () => {
    const fetchMock = answer(202);

    await new HttpSignUpService(API, vi.fn()).requestCode(' ana@example.com ', 'pt-BR');

    expect(fetchMock).toHaveBeenCalledWith(`${API}${SIGN_UP_PATH}/code`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      body: '{"email":"ana@example.com","locale":"pt-BR"}',
    });
  });

  it('turns too many attempts into the rate-limit error', async () => {
    answer(429);

    await expect(
      new HttpSignUpService(API, vi.fn()).requestCode('ana@example.com', 'en'),
    ).rejects.toBeInstanceOf(RateLimitedError);
  });

  it('verifies the code with the terms version, keeps the session and names the account', async () => {
    const fetchMock = answer(200, {
      email: 'ana@example.com',
      session_token: TOKEN,
      account_id: ACCOUNT,
      account_status: 'free',
      free_place: 'placed',
    });
    const keep = vi.fn(() => Promise.resolve());

    await expect(
      new HttpSignUpService(API, keep).verify('ana@example.com', '123456', '2026-11-01'),
    ).resolves.toEqual({
      kind: 'verified',
      accountId: ACCOUNT,
      accountStatus: 'free',
      freePlace: 'placed',
    });
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      '{"email":"ana@example.com","code":"123456","terms_version":"2026-11-01"}',
    );
    expect(keep).toHaveBeenCalledWith(TOKEN);
  });

  it.each([
    [400, { error: 'invalid_code' }, 'invalidCode'],
    [404, { error: 'sign_up_closed' }, 'closed'],
    [409, { error: 'terms_outdated' }, 'termsOutdated'],
  ])('answers %i as %s', async (status, body, kind) => {
    answer(status, body);
    const keep = vi.fn();

    await expect(
      new HttpSignUpService(API, keep).verify('ana@example.com', '123456', '2026-11-01'),
    ).resolves.toEqual({ kind });
    expect(keep).not.toHaveBeenCalled();
  });

  it.each([
    [409, { error: 'something_else' }],
    [409, 'not json'],
    [409, { error: 7 }],
    [500, null],
  ])('lets %i with %j through', async (status, body) => {
    answer(status, body);

    await expect(
      new HttpSignUpService(API, vi.fn()).verify('ana@example.com', '123456', '2026-11-01'),
    ).rejects.toBeInstanceOf(ApiRequestError);
  });
});

describe('MockSignUpService', () => {
  const service = new MockSignUpService();

  it('is open with invented terms and the free plan closed, sends nothing, and takes the demo code', async () => {
    await expect(service.status()).resolves.toEqual({
      open: true,
      termsVersion: DEMO_TERMS_VERSION,
      termsUrl: DEMO_TERMS_URL,
      freePlan: 'closed',
    });
    await expect(service.requestCode()).resolves.toBeUndefined();
    await expect(service.verify('x@example.com', DEMO_SIGN_IN_CODE)).resolves.toEqual({
      kind: 'verified',
      accountId: DEMO_ACCOUNT_ID,
      accountStatus: 'incomplete',
      freePlace: 'not_offered',
    });
    await expect(service.verify('x@example.com', '123456')).resolves.toEqual({
      kind: 'invalidCode',
    });
  });

  it.each([
    ['open', 'free', 'placed'],
    ['full', 'incomplete', 'waitlisted'],
  ] as const)(
    'starts the account as the API does with the free plan %s: %s, its free place %s',
    async (freePlan, accountStatus, freePlace) => {
      const withTheFreePlan = new MockSignUpService(freePlan);

      await expect(withTheFreePlan.status()).resolves.toMatchObject({ freePlan });
      await expect(withTheFreePlan.verify('x@example.com', DEMO_SIGN_IN_CODE)).resolves.toEqual({
        kind: 'verified',
        accountId: DEMO_ACCOUNT_ID,
        accountStatus,
        freePlace,
      });
    },
  );
});

describe('openSignUpOf', () => {
  it('opens only with a terms version and an address', () => {
    const open = {
      open: true,
      termsVersion: 'v',
      termsUrl: 'https://t',
      freePlan: 'full',
    } as const;

    expect(openSignUpOf(open)).toEqual({
      termsVersion: 'v',
      termsUrl: 'https://t',
      freePlan: 'full',
    });
    expect(openSignUpOf({ ...open, open: false })).toBeNull();
    expect(openSignUpOf({ ...open, termsVersion: null })).toBeNull();
    expect(openSignUpOf({ ...open, termsUrl: null })).toBeNull();
  });
});

describe('createSignUpService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);
    expect(createSignUpService()).toBeInstanceOf(HttpSignUpService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createSignUpService()).toBeInstanceOf(MockSignUpService);
  });
});
