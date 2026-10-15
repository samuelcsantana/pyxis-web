import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { exportDownloadHref, exportHref, isDownloadable } from '@/domain/exports';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { createExportsService } from './exports-service.factory';
import { EXPORT_ERROR_CODES, HttpExportsService } from './http-exports-service';
import { DEMO_EXPORT_FILE, DEMO_EXPORT_ID, MockExportsService } from './mock-exports-service';

const NOW = new Date('2026-11-20T12:00:00.000Z');
const WIRE = {
  id: 'e1',
  status: 'pending',
  requested_at: '2026-11-20T12:00:00.000Z',
  finished_at: null,
  event_count: null,
  available_until: null,
  download_url: null,
};
const PENDING = {
  id: 'e1',
  status: 'pending',
  requestedAt: '2026-11-20T12:00:00.000Z',
  finishedAt: null,
  eventCount: null,
  availableUntil: null,
  downloadUrl: null,
} as const;

type Call = (
  path: string,
  body: unknown,
  schema: { parse(body: unknown): unknown },
) => Promise<unknown>;

function serviceWith(writer: Record<string, unknown>, reader: Record<string, unknown> = {}) {
  return new HttpExportsService(reader as unknown as ApiReader, writer as unknown as ApiWriter);
}

describe('HttpExportsService', () => {
  it('asks for an export, saying whether one was already waiting', async () => {
    const post = vi.fn<Call>((_path, _body, schema) =>
      Promise.resolve(schema.parse({ export: WIRE, requested: false })),
    );

    await expect(serviceWith({ post }).request('p/1')).resolves.toEqual({
      kind: 'requested',
      export: PENDING,
      alreadyWaiting: true,
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual(['/v1/projects/p%2F1/exports', {}]);
  });

  it.each([
    [EXPORT_ERROR_CODES.limitReached, 429, 'limitReached'],
    [EXPORT_ERROR_CODES.unavailable, 503, 'unavailable'],
  ])('answers the refusal %s as %s', async (code, status, kind) => {
    const post = vi.fn(() => Promise.reject(new ApiRequestError('/x', status, code)));

    await expect(serviceWith({ post }).request('p1')).resolves.toEqual({ kind });
  });

  it('lets any other failure through', async () => {
    const failure = new UnauthenticatedError();
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).request('p1')).rejects.toBe(failure);
  });

  it('reads an export of a project, both ids escaped', async () => {
    const get = vi.fn((_: string, schema: { parse(body: unknown): unknown }) =>
      Promise.resolve(schema.parse(WIRE)),
    );

    await expect(serviceWith({}, { get }).get('p/1', 'e/1')).resolves.toEqual(PENDING);
    expect(get.mock.calls[0]?.[0]).toBe('/v1/projects/p%2F1/exports/e%2F1');
  });
});

describe('MockExportsService', () => {
  const service = new MockExportsService(() => NOW);

  it('starts an invented export and finds it ready, with the demo file', async () => {
    await expect(service.request()).resolves.toMatchObject({
      kind: 'requested',
      alreadyWaiting: false,
      export: { id: DEMO_EXPORT_ID, status: 'pending' },
    });
    await expect(service.get()).resolves.toMatchObject({
      id: DEMO_EXPORT_ID,
      status: 'done',
      eventCount: 12_480,
      availableUntil: '2026-11-27T12:00:00.000Z',
      downloadUrl: DEMO_EXPORT_FILE,
    });
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    const found = await new MockExportsService().get();
    vi.useRealTimers();

    expect(found.finishedAt).toBe(NOW.toISOString());
  });
});

describe('export addresses and downloads', () => {
  it('builds the page and download addresses of an export', () => {
    expect(exportHref('p/1', 'e1')).toBe('/p%2F1/exports/e1');
    expect(exportDownloadHref('p1', 'e1')).toBe('/p1/exports/e1/download');
  });

  it('downloads only a finished file that is still kept', () => {
    const done = {
      ...PENDING,
      status: 'done',
      downloadUrl: 'https://s3.example.com/x',
      availableUntil: '2026-11-27T12:00:00.000Z',
    } as const;

    expect(isDownloadable(done, NOW)).toBe(true);
    expect(isDownloadable({ ...done, availableUntil: '2026-11-19T12:00:00.000Z' }, NOW)).toBe(
      false,
    );
    expect(isDownloadable({ ...done, availableUntil: null }, NOW)).toBe(false);
    expect(isDownloadable({ ...done, downloadUrl: null }, NOW)).toBe(false);
    expect(isDownloadable({ ...done, status: 'failed' }, NOW)).toBe(false);
  });
});

describe('createExportsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    expect(createExportsService()).toBeInstanceOf(HttpExportsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createExportsService()).toBeInstanceOf(MockExportsService);
  });
});
