import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, InvalidCodeError, RateLimitedError } from '@/domain/errors';
import { createAuthService } from './auth-service.factory';
import { HttpAuthService } from './http-auth-service';
import { DEMO_SIGN_IN_CODE, MockAuthService } from './mock-auth-service';

const API = 'https://api.pyxis.example.com';

function answer(status: number) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status })));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpAuthService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the email with credentials so the API can set its cookie', async () => {
    const fetchMock = answer(202);

    await new HttpAuthService(API).requestCode('ana@example.com');

    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/auth/request-code`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'ana@example.com' }),
    });
  });

  it('posts the email and the code to verify them', async () => {
    const fetchMock = answer(200);

    await new HttpAuthService(API).verifyCode('ana@example.com', '123456');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/auth/verify-code`);
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({ email: 'ana@example.com', code: '123456' }),
    );
  });

  it('turns a refused code into InvalidCodeError', async () => {
    answer(400);

    await expect(new HttpAuthService(API).verifyCode('ana@example.com', '000001')).rejects.toThrow(
      InvalidCodeError,
    );
  });

  it('keeps any other failure of the verification as it is', async () => {
    answer(503);

    await expect(new HttpAuthService(API).verifyCode('ana@example.com', '123456')).rejects.toThrow(
      ApiRequestError,
    );
  });

  it('turns 429 into RateLimitedError', async () => {
    answer(429);

    await expect(new HttpAuthService(API).requestCode('ana@example.com')).rejects.toThrow(
      RateLimitedError,
    );
  });

  it('reports which call failed and how', async () => {
    answer(403);

    await expect(new HttpAuthService(API).signOut()).rejects.toMatchObject({
      path: '/v1/auth/logout',
      status: 403,
    });
  });
});

describe('MockAuthService', () => {
  it('sends nothing and accepts only the demo code', async () => {
    const service = new MockAuthService();

    await expect(service.requestCode()).resolves.toBeUndefined();
    await expect(service.verifyCode('any@example.com', DEMO_SIGN_IN_CODE)).resolves.toBeUndefined();
    await expect(service.verifyCode('any@example.com', '123456')).rejects.toThrow(InvalidCodeError);
    await expect(service.signOut()).resolves.toBeUndefined();
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
