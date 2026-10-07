import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { ApiReader, pathTemplate } from './api-reader';
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

describe('the read log', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function loggingReader(ticks: number[]) {
    const lines: string[] = [];
    const reader = new ApiReader(
      API,
      () => Promise.resolve('token'),
      (line) => {
        lines.push(line);
      },
      () => ticks.shift() ?? 0,
    );
    return { reader, logged: () => lines.map((line) => JSON.parse(line) as unknown) };
  }

  it('writes one line per read: path template, status and duration, no id or query value', async () => {
    answer(200, { ok: true });
    const { reader, logged } = loggingReader([100, 142.6]);

    await reader.get('/v1/projects/6f1d3c2a-8b4e/overview?from=2026-09-01&to=2026-09-30', schema);

    expect(logged()).toEqual([
      { event: 'api_read', path: '/v1/projects/:projectId/overview', status: 200, duration_ms: 43 },
    ]);
  });

  it('logs a read the API refused with its status, then throws as before', async () => {
    answer(404);
    const { reader, logged } = loggingReader([0, 12]);

    await expect(reader.get('/v1/projects/p-1/funnel?steps=%5B%5D', schema)).rejects.toThrow(
      ApiNotFoundError,
    );
    expect(logged()).toEqual([
      { event: 'api_read', path: '/v1/projects/:projectId/funnel', status: 404, duration_ms: 12 },
    ]);
  });

  it('logs a read that got no answer as status 0 and lets the error through', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(() => Promise.reject(new TypeError('fetch failed'))),
    );
    const { reader, logged } = loggingReader([5, 3005]);

    await expect(reader.get('/v1/me', schema)).rejects.toThrow('fetch failed');
    expect(logged()).toEqual([{ event: 'api_read', path: '/v1/me', status: 0, duration_ms: 3000 }]);
  });

  it('writes to the console unless told otherwise', async () => {
    answer(200, { ok: true });
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    await new ApiReader(API, () => Promise.resolve('token')).get('/v1/me', schema);

    expect(info).toHaveBeenCalledOnce();
    expect(JSON.parse(String(info.mock.calls[0]?.[0]))).toMatchObject({
      event: 'api_read',
      path: '/v1/me',
      status: 200,
    });
  });
});

describe('pathTemplate', () => {
  it('drops the query and the project id, and keeps the rest of the route', () => {
    expect(pathTemplate('/v1/me')).toBe('/v1/me');
    expect(pathTemplate('/v1/projects/p%201/features/properties?name=cta_clicked')).toBe(
      '/v1/projects/:projectId/features/properties',
    );
    expect(pathTemplate('/v1/projects/p1?x=1')).toBe('/v1/projects/:projectId');
  });
});
