import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { createAccessTokensService } from './access-tokens-service.factory';
import { ACCESS_TOKENS_PATH, HttpAccessTokensService } from './http-access-tokens-service';
import {
  DEMO_ACCESS_TOKEN_IDS,
  DEMO_CREATED_ACCESS_TOKEN,
  MockAccessTokensService,
} from './mock-access-tokens-service';

const NOW = new Date('2026-10-14T12:00:00.000Z');

const CREATED = {
  id: DEMO_ACCESS_TOKEN_IDS.created,
  name: 'Claude Code',
  token: DEMO_CREATED_ACCESS_TOKEN,
  createdAt: NOW.toISOString(),
  lastUsedAt: null,
  expiresAt: '2027-01-12T12:00:00.000Z',
};

function serviceWith(writer: Partial<ApiWriter>, reader: Partial<ApiReader> = {}) {
  return new HttpAccessTokensService(reader as ApiReader, writer as ApiWriter);
}

describe('HttpAccessTokensService', () => {
  it('reads the tokens of the signed-in admin', async () => {
    const get = vi.fn<(path: string, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>([]),
    );

    await expect(serviceWith({}, { get } as Partial<ApiReader>).list()).resolves.toEqual([]);
    expect(get.mock.calls[0]?.[0]).toBe(ACCESS_TOKENS_PATH);
  });

  it('creates a token with a trimmed name and its lifetime in days', async () => {
    const post = vi.fn<(path: string, body: unknown, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>(CREATED),
    );

    const outcome = await serviceWith({ post } as Partial<ApiWriter>).create({
      name: '  Claude Code ',
      lifetimeDays: 90,
    });

    expect(outcome).toEqual({ kind: 'created', token: CREATED });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      ACCESS_TOKENS_PATH,
      { name: 'Claude Code', expires_in_days: 90 },
    ]);
  });

  it('answers tooMany when the API refuses an eleventh token', async () => {
    const post = vi.fn(() => Promise.reject(new ApiRequestError(ACCESS_TOKENS_PATH, 409)));

    await expect(
      serviceWith({ post }).create({ name: 'One more', lifetimeDays: 30 }),
    ).resolves.toEqual({ kind: 'tooMany' });
  });

  it.each([
    ['another refusal', new ApiRequestError(ACCESS_TOKENS_PATH, 400)],
    ['an ended session', new UnauthenticatedError()],
  ])('lets %s through when creating', async (_, failure) => {
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).create({ name: 'x', lifetimeDays: 30 })).rejects.toBe(
      failure,
    );
  });

  it('revokes a token by deleting it, with its id escaped in the path', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());

    await serviceWith({ delete: remove }).revoke('1a7c/odd');

    expect(remove).toHaveBeenCalledWith(`${ACCESS_TOKENS_PATH}/1a7c%2Fodd`);
  });

  it('treats a token already gone as revoked', async () => {
    const remove = vi.fn(() => Promise.reject(new ApiNotFoundError(ACCESS_TOKENS_PATH)));

    await expect(serviceWith({ delete: remove }).revoke('gone')).resolves.toBeUndefined();
  });

  it('lets any other failure of a revoke through', async () => {
    const failure = new UnauthenticatedError();
    const remove = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ delete: remove }).revoke('x')).rejects.toBe(failure);
  });
});

describe('MockAccessTokensService', () => {
  it('lists two invented tokens, one used two hours ago and one never used', async () => {
    const tokens = await new MockAccessTokensService(() => NOW).list();

    expect(tokens.map((token) => [token.name, token.lastUsedAt])).toEqual([
      ['Claude Code', '2026-10-14T10:00:00.000Z'],
      ['Monthly report script', null],
    ]);
  });

  it('creates an invented token that expires after the chosen days', async () => {
    const outcome = await new MockAccessTokensService(() => NOW).create({
      name: ' Cursor ',
      lifetimeDays: 365,
    });

    expect(outcome).toEqual({
      kind: 'created',
      token: {
        id: DEMO_ACCESS_TOKEN_IDS.created,
        name: 'Cursor',
        token: DEMO_CREATED_ACCESS_TOKEN,
        createdAt: '2026-10-14T12:00:00.000Z',
        lastUsedAt: null,
        expiresAt: '2027-10-14T12:00:00.000Z',
      },
    });
  });

  it('revokes nothing, and does not mind', async () => {
    await expect(new MockAccessTokensService().revoke()).resolves.toBeUndefined();
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    const [first] = await new MockAccessTokensService().list();

    expect(first?.createdAt).toBe('2026-10-02T12:00:00.000Z');
    vi.useRealTimers();
  });
});

describe('createAccessTokensService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createAccessTokensService()).toBeInstanceOf(HttpAccessTokensService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createAccessTokensService()).toBeInstanceOf(MockAccessTokensService);
  });
});
