import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, InvalidCodeError, RateLimitedError } from '@/domain/errors';
import { createAuthService } from './auth-service.factory';
import {
  HttpAuthService,
  MalformedSignInAnswerError,
  type SessionKeeper,
} from './http-auth-service';
import { DEMO_SIGN_IN_CODE, MockAuthService } from './mock-auth-service';

const API = 'https://api.pyxis.example.com';
const TOKEN = 'A'.repeat(43);

function answer(status: number, body?: unknown) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(
      new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: body === undefined ? {} : { 'content-type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function sessionKeeper() {
  const kept: string[] = [];
  let ended = 0;
  const keeper: SessionKeeper = {
    keep: (token) => {
      kept.push(token);
      return Promise.resolve();
    },
    end: () => {
      ended += 1;
      return Promise.resolve();
    },
  };
  return { keeper, kept, endedTimes: () => ended };
}

function service(keeper: SessionKeeper = sessionKeeper().keeper) {
  return new HttpAuthService(API, keeper);
}

describe('HttpAuthService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the email without credentials: the API keeps no cookie on the browser', async () => {
    const fetchMock = answer(202);

    await service().requestCode('ana@example.com', 'en');

    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/auth/request-code`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'ana@example.com', locale: 'en' }),
    });
  });

  it('asks for the sign-in email in the language of the dashboard', async () => {
    const fetchMock = answer(202);

    await service().requestCode('ana@example.com', 'pt-BR');

    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({ email: 'ana@example.com', locale: 'pt-BR' }),
    );
  });

  it('posts the email and the code, then hands the session token to the keeper', async () => {
    const fetchMock = answer(200, { email: 'ana@example.com', session_token: TOKEN });
    const { keeper, kept } = sessionKeeper();

    await service(keeper).verifyCode('ana@example.com', '123456');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/auth/verify-code`);
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({ email: 'ana@example.com', code: '123456' }),
    );
    expect(kept).toEqual([TOKEN]);
  });

  it.each([
    ['a malformed token', { email: 'ana@example.com', session_token: 'short' }],
    ['no token', { email: 'ana@example.com' }],
    ['no object', 'signed in'],
    ['null', null],
  ])('keeps nothing when the sign-in answer carries %s', async (_label, body) => {
    answer(200, body);
    const { keeper, kept } = sessionKeeper();

    await expect(service(keeper).verifyCode('ana@example.com', '123456')).rejects.toThrow(
      MalformedSignInAnswerError,
    );
    expect(kept).toEqual([]);
  });

  it('turns a refused code into InvalidCodeError', async () => {
    answer(400);

    await expect(service().verifyCode('ana@example.com', '000001')).rejects.toThrow(
      InvalidCodeError,
    );
  });

  it('keeps any other failure of the verification as it is', async () => {
    answer(503);

    await expect(service().verifyCode('ana@example.com', '123456')).rejects.toThrow(
      ApiRequestError,
    );
  });

  it('turns 429 into RateLimitedError', async () => {
    answer(429);

    await expect(service().requestCode('ana@example.com', 'en')).rejects.toThrow(RateLimitedError);
  });

  it('signs out through the keeper, which holds the cookie, never from the browser', async () => {
    const fetchMock = answer(204);
    const { keeper, endedTimes } = sessionKeeper();

    await service(keeper).signOut();

    expect(endedTimes()).toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('MockAuthService', () => {
  it('sends nothing and accepts only the demo code', async () => {
    const mock = new MockAuthService();

    await expect(mock.requestCode()).resolves.toBeUndefined();
    await expect(mock.verifyCode('any@example.com', DEMO_SIGN_IN_CODE)).resolves.toBeUndefined();
    await expect(mock.verifyCode('any@example.com', '123456')).rejects.toThrow(InvalidCodeError);
    await expect(mock.signOut()).resolves.toBeUndefined();
  });
});

describe('createAuthService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createAuthService()).toBeInstanceOf(HttpAuthService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createAuthService()).toBeInstanceOf(MockAuthService);
  });
});
