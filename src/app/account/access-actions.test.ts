import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewAccessToken } from '@/domain/access-tokens';
import { UnauthenticatedError } from '@/domain/errors';
import type { IAccessTokensService } from '@/services/access-tokens/access-tokens-service.interface';
import type { IConnectionsService } from '@/services/connections/connections-service.interface';
import type { ISessionsService } from '@/services/sessions/sessions-service.interface';
import {
  createAccessToken,
  endSession,
  revokeAccessToken,
  revokeConnection,
} from './access-actions';

const state = vi.hoisted<{
  end: ISessionsService['end'];
  create: IAccessTokensService['create'];
  revoke: IAccessTokensService['revoke'];
  disconnect: IConnectionsService['revoke'];
}>(() => ({
  end: () => Promise.reject(new Error('end not set')),
  create: () => Promise.reject(new Error('create not set')),
  revoke: () => Promise.reject(new Error('revoke not set')),
  disconnect: () => Promise.reject(new Error('disconnect not set')),
}));

vi.mock('@/services/access-tokens/access-tokens-service.factory', () => ({
  createAccessTokensService: (): Pick<IAccessTokensService, 'create' | 'revoke'> => ({
    create: (request) => state.create(request),
    revoke: (tokenId) => state.revoke(tokenId),
  }),
}));

vi.mock('@/services/connections/connections-service.factory', () => ({
  createConnectionsService: (): Pick<IConnectionsService, 'revoke'> => ({
    revoke: (connectionId) => state.disconnect(connectionId),
  }),
}));

vi.mock('@/services/sessions/sessions-service.factory', () => ({
  createSessionsService: (): Pick<ISessionsService, 'end'> => ({
    end: (sessionId) => state.end(sessionId),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

describe('endSession', () => {
  const SESSION_ID = '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e';

  beforeEach(() => {
    state.end = () => Promise.resolve();
  });

  it('ends the session named by its id', async () => {
    const end = vi.fn<ISessionsService['end']>(() => Promise.resolve());
    state.end = end;

    await expect(endSession(SESSION_ID)).resolves.toBeUndefined();
    expect(end).toHaveBeenCalledWith(SESSION_ID);
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const end = vi.fn<ISessionsService['end']>();
    state.end = end;

    await expect(endSession('not-a-session')).rejects.toThrow('A session is ended by its id.');
    expect(end).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.end = () => Promise.reject(new UnauthenticatedError());

    await expect(endSession(SESSION_ID)).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});

describe('createAccessToken', () => {
  const CREATED = {
    kind: 'created',
    token: {
      id: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
      name: 'Claude Code',
      token: `pyxis_at_${'A'.repeat(32)}`,
      createdAt: '2026-10-14T12:00:00.000Z',
      lastUsedAt: null,
      expiresAt: '2027-01-12T12:00:00.000Z',
    },
  } as const;

  it('creates the token with its name trimmed and answers what the API created', async () => {
    const create = vi.fn<IAccessTokensService['create']>(() => Promise.resolve(CREATED));
    state.create = create;

    await expect(createAccessToken({ name: ' Claude Code ', lifetimeDays: 90 })).resolves.toEqual(
      CREATED,
    );
    expect(create).toHaveBeenCalledWith({ name: 'Claude Code', lifetimeDays: 90 });
  });

  it.each([
    [{ name: '   ', lifetimeDays: 90 }],
    [{ name: 'x'.repeat(65), lifetimeDays: 90 }],
    [{ name: 'Claude Code', lifetimeDays: 7 }],
    [{ name: 'Claude Code', lifetimeDays: 90, scope: 'write' }],
  ])('refuses %j, since it comes from the browser', async (forged) => {
    const create = vi.fn<IAccessTokensService['create']>();
    state.create = create;

    await expect(createAccessToken(forged as unknown as NewAccessToken)).rejects.toThrow(
      'An access token needs a name and a lifetime of 30, 90 or 365 days.',
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.create = () => Promise.reject(new UnauthenticatedError());

    await expect(createAccessToken({ name: 'Claude Code', lifetimeDays: 30 })).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});

describe('revokeAccessToken', () => {
  const TOKEN_ID = '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a';

  it('revokes the token named by its id', async () => {
    const revoke = vi.fn<IAccessTokensService['revoke']>(() => Promise.resolve());
    state.revoke = revoke;

    await expect(revokeAccessToken(TOKEN_ID)).resolves.toBeUndefined();
    expect(revoke).toHaveBeenCalledWith(TOKEN_ID);
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const revoke = vi.fn<IAccessTokensService['revoke']>();
    state.revoke = revoke;

    await expect(revokeAccessToken('not-a-token')).rejects.toThrow(
      'An access token is revoked by its id.',
    );
    expect(revoke).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.revoke = () => Promise.reject(new UnauthenticatedError());

    await expect(revokeAccessToken(TOKEN_ID)).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});

describe('revokeConnection', () => {
  const CONNECTION_ID = '5e1a7c9d-6f8b-4a0c-9d5e-7f9a1b3c5d6e';

  it('revokes the connected app named by its id', async () => {
    const disconnect = vi.fn<IConnectionsService['revoke']>(() => Promise.resolve());
    state.disconnect = disconnect;

    await expect(revokeConnection(CONNECTION_ID)).resolves.toBeUndefined();
    expect(disconnect).toHaveBeenCalledWith(CONNECTION_ID);
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const disconnect = vi.fn<IConnectionsService['revoke']>();
    state.disconnect = disconnect;

    await expect(revokeConnection('../tokens')).rejects.toThrow(
      'A connected app is revoked by its id.',
    );
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.disconnect = () => Promise.reject(new UnauthenticatedError());

    await expect(revokeConnection(CONNECTION_ID)).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});
