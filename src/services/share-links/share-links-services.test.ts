import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { HttpShareLinksService, SHARE_LINK_ERROR_CODES } from './http-share-links-service';
import {
  DEMO_SHARE_LINK_IDS,
  DEMO_SHARE_TOKEN,
  MockShareLinksService,
} from './mock-share-links-service';
import { createShareLinksService } from './share-links-service.factory';

const NOW = new Date('2026-11-05T12:00:00.000Z');
const PROJECT = 'p/1';
const LINKS_PATH = '/v1/projects/p%2F1/share-links';
const CREATED = {
  id: DEMO_SHARE_LINK_IDS.created,
  name: 'Board',
  createdAt: NOW.toISOString(),
  expiresAt: null,
  token: DEMO_SHARE_TOKEN,
};

function serviceWith(writer: Partial<ApiWriter>, reader: Partial<ApiReader> = {}) {
  return new HttpShareLinksService(reader as ApiReader, writer as ApiWriter);
}

describe('HttpShareLinksService', () => {
  it('reads the links of the project', async () => {
    const get = vi.fn<(path: string, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>([]),
    );

    await expect(serviceWith({}, { get } as Partial<ApiReader>).list(PROJECT)).resolves.toEqual([]);
    expect(get.mock.calls[0]?.[0]).toBe(LINKS_PATH);
  });

  it('creates a link with its name and expiry in the API shape', async () => {
    const post = vi.fn<(path: string, body: unknown, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>(CREATED),
    );

    const outcome = await serviceWith({ post } as Partial<ApiWriter>).create(PROJECT, {
      name: 'Board',
      expiresAt: '2026-12-05T12:00:00.000Z',
    });

    expect(outcome).toEqual({ kind: 'created', link: CREATED });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      LINKS_PATH,
      { name: 'Board', expires_at: '2026-12-05T12:00:00.000Z' },
    ]);
  });

  it.each([
    ['planRequired', 403, SHARE_LINK_ERROR_CODES.planRequired],
    ['limitReached', 409, SHARE_LINK_ERROR_CODES.limitReached],
  ] as const)('answers %s when the API refuses with its code', async (kind, status, code) => {
    const post = vi.fn(() => Promise.reject(new ApiRequestError(LINKS_PATH, status, code)));

    await expect(
      serviceWith({ post }).create(PROJECT, { name: 'Board', expiresAt: null }),
    ).resolves.toEqual({ kind });
  });

  it.each([
    ['another refusal', new ApiRequestError(LINKS_PATH, 400, 'invalid_share_link')],
    ['an ended session', new UnauthenticatedError()],
  ])('lets %s through when creating', async (_, failure) => {
    const post = vi.fn(() => Promise.reject(failure));

    await expect(
      serviceWith({ post }).create(PROJECT, { name: 'x', expiresAt: null }),
    ).rejects.toBe(failure);
  });

  it('revokes a link by deleting it, with its id escaped in the path', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());

    await serviceWith({ delete: remove }).revoke(PROJECT, '4d0f/odd');

    expect(remove).toHaveBeenCalledWith(`${LINKS_PATH}/4d0f%2Fodd`);
  });

  it('treats a link already gone as revoked, and lets any other failure through', async () => {
    const gone = vi.fn(() => Promise.reject(new ApiNotFoundError(LINKS_PATH)));
    const failure = new UnauthenticatedError();
    const ended = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ delete: gone }).revoke(PROJECT, 'x')).resolves.toBeUndefined();
    await expect(serviceWith({ delete: ended }).revoke(PROJECT, 'x')).rejects.toBe(failure);
  });
});

describe('MockShareLinksService', () => {
  it('lists an expired invented link and one that never expires', async () => {
    const links = await new MockShareLinksService(() => NOW).list();

    expect(links.map((link) => [link.name, link.expiresAt])).toEqual([
      ['Agency pitch', '2026-10-26T12:00:00.000Z'],
      ['Monthly board report', null],
    ]);
  });

  it('creates an invented link that opens the demo', async () => {
    const outcome = await new MockShareLinksService(() => NOW).create(PROJECT, {
      name: 'Board',
      expiresAt: null,
    });

    expect(outcome).toEqual({ kind: 'created', link: CREATED });
  });

  it('revokes nothing, and does not mind', async () => {
    await expect(new MockShareLinksService().revoke()).resolves.toBeUndefined();
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    const [first] = await new MockShareLinksService().list();

    expect(first?.createdAt).toBe('2026-09-26T12:00:00.000Z');
    vi.useRealTimers();
  });
});

describe('createShareLinksService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createShareLinksService()).toBeInstanceOf(HttpShareLinksService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createShareLinksService()).toBeInstanceOf(MockShareLinksService);
  });
});
