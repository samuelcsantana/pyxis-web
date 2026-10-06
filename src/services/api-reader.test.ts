import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { ApiReader } from './api-reader';
import { createApiReader } from './api-reader.factory';

const API = 'https://api.pyxis.example.com';
const schema = z.object({ ok: z.boolean() });

const cookieStore = vi.hoisted(() => ({ value: undefined as string | undefined }));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        name === 'pyxis_session' && cookieStore.value !== undefined
          ? { name, value: cookieStore.value }
          : undefined,
    }),
}));

function answer(status: number, body: unknown = null) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(new Response(body === null ? null : JSON.stringify(body), { status })),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('ApiReader', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    cookieStore.value = undefined;
  });

  it('forwards the session cookie, never caches, and parses the answer', async () => {
    const fetchMock = answer(200, { ok: true });

    await expect(
      new ApiReader(API, () => Promise.resolve('token')).get('/v1/me', schema),
    ).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/me`, {
      headers: { cookie: 'pyxis_session=token', accept: 'application/json' },
      cache: 'no-store',
    });
  });

  it('does not call the API without a session cookie', async () => {
    const fetchMock = answer(200, { ok: true });

    await expect(
      new ApiReader(API, () => Promise.resolve(undefined)).get('/v1/me', schema),
    ).rejects.toThrow(UnauthenticatedError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, UnauthenticatedError],
    [404, ApiNotFoundError],
    [503, ApiRequestError],
  ])('turns %i into its error', async (status, kind) => {
    answer(status);

    await expect(
      new ApiReader(API, () => Promise.resolve('token')).get('/v1/x', schema),
    ).rejects.toThrow(kind);
  });

  it('reads the session cookie of the request when built by the factory', async () => {
    cookieStore.value = 'from-the-request';
    const fetchMock = answer(200, { ok: true });

    await createApiReader(API).get('/v1/me', schema);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      cookie: 'pyxis_session=from-the-request',
      accept: 'application/json',
    });
  });
});
