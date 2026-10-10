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
        name === '__Host-pyxis_session' && cookieStore.value !== undefined
          ? { name, value: cookieStore.value }
          : undefined,
    }),
  headers: () => Promise.resolve(new Headers({ origin: 'https://app.pyxis.example.com' })),
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
      origin: 'https://app.pyxis.example.com',
    });
  });

  it('names no origin when the writer was given none', async () => {
    const fetchMock = answer(200, { weekly_digest: true });

    await new ApiWriter(
      API,
      () => Promise.resolve('token'),
      () => undefined,
    ).put(PATH, { weekly_digest: true }, schema);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).not.toHaveProperty('origin');
  });
});

describe('ApiWriter delete', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deletes with the session cookie and accepts an empty answer, logging the session route as a template', async () => {
    const fetchMock = answer(204);
    const lines: string[] = [];
    const path = '/v1/me/sessions/6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e';

    await expect(
      new ApiWriter(
        API,
        () => Promise.resolve('token'),
        (line) => {
          lines.push(line);
        },
        () => 0,
      ).delete(path),
    ).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(`${API}${path}`, {
      method: 'DELETE',
      headers: { cookie: 'pyxis_session=token', accept: 'application/json' },
      cache: 'no-store',
    });
    expect(lines).toEqual([
      JSON.stringify({
        event: 'api_write',
        path: '/v1/me/sessions/:sessionId',
        status: 204,
        duration_ms: 0,
      }),
    ]);
  });

  it('turns a 404 of a delete into the not-found error', async () => {
    answer(404);

    await expect(
      new ApiWriter(
        API,
        () => Promise.resolve('token'),
        () => undefined,
      ).delete('/v1/me/sessions/x'),
    ).rejects.toBeInstanceOf(ApiNotFoundError);
  });
});
