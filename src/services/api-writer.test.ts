import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { ApiWriter } from './api-writer';
import { createApiWriter } from './api-writer.factory';

const API = 'https://api.pyxis.example.com';
const PATH = '/v1/projects/6f1d3c2a-8b4e/email-preferences';
const schema = z.object({ weekly_digest: z.boolean() });

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

describe('ApiWriter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    cookieStore.value = undefined;
  });

  it('puts a JSON body with the session cookie, never caches, and parses the answer', async () => {
    const fetchMock = answer(200, { weekly_digest: false });
    const lines: string[] = [];
    const ticks = [10, 52.4];

    await expect(
      new ApiWriter(
        API,
        () => Promise.resolve('token'),
        (line) => {
          lines.push(line);
        },
        () => ticks.shift() ?? 0,
      ).put(PATH, { weekly_digest: false }, schema),
    ).resolves.toEqual({ weekly_digest: false });
    expect(fetchMock).toHaveBeenCalledWith(`${API}${PATH}`, {
      method: 'PUT',
      headers: {
        cookie: 'pyxis_session=token',
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: '{"weekly_digest":false}',
      cache: 'no-store',
    });
    expect(lines.map((line) => JSON.parse(line) as unknown)).toEqual([
      {
        event: 'api_write',
        path: '/v1/projects/:projectId/email-preferences',
        status: 200,
        duration_ms: 42,
      },
    ]);
  });

  it('does not call the API without a session cookie', async () => {
    const fetchMock = answer(200, { weekly_digest: true });

    await expect(
      new ApiWriter(API, () => Promise.resolve(undefined)).put(PATH, {}, schema),
    ).rejects.toThrow(UnauthenticatedError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, UnauthenticatedError],
    [404, ApiNotFoundError],
    [400, ApiRequestError],
  ])('turns %i into its error', async (status, kind) => {
    answer(status);

    await expect(
      new ApiWriter(
        API,
        () => Promise.resolve('token'),
        () => undefined,
      ).put(PATH, {}, schema),
    ).rejects.toThrow(kind);
  });

  it('reads the session cookie of the request when built by the factory', async () => {
    cookieStore.value = 'from-the-request';
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const fetchMock = answer(200, { weekly_digest: true });

    await createApiWriter(API).put(PATH, { weekly_digest: true }, schema);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      cookie: 'pyxis_session=from-the-request',
    });
  });
});
