import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewAccessToken } from '@/domain/access-tokens';
import type { Admin } from '@/domain/admin';
import type { EmailPreferences } from '@/domain/email-preferences';
import { UnauthenticatedError } from '@/domain/errors';
import type { IAccessTokensService } from '@/services/access-tokens/access-tokens-service.interface';
import type { IEmailPreferencesService } from '@/services/preferences/email-preferences-service.interface';
import type { ISessionsService } from '@/services/sessions/sessions-service.interface';
import {
  chooseEmailPreferences,
  createAccessToken,
  endSession,
  revokeAccessToken,
} from './actions';

const state = vi.hoisted<{
  admin: unknown;
  choose: IEmailPreferencesService['choose'];
  end: ISessionsService['end'];
  create: IAccessTokensService['create'];
  revoke: IAccessTokensService['revoke'];
}>(() => ({
  admin: undefined,
  choose: () => Promise.reject(new Error('choose not set')),
  end: () => Promise.reject(new Error('end not set')),
  create: () => Promise.reject(new Error('create not set')),
  revoke: () => Promise.reject(new Error('revoke not set')),
}));

vi.mock('@/services/access-tokens/access-tokens-service.factory', () => ({
  createAccessTokensService: (): Pick<IAccessTokensService, 'create' | 'revoke'> => ({
    create: (request) => state.create(request),
    revoke: (tokenId) => state.revoke(tokenId),
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

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/preferences/email-preferences-service.factory', () => ({
  createEmailPreferencesService: (): Pick<IEmailPreferencesService, 'choose'> => ({
    choose: (projectId, preferences) => state.choose(projectId, preferences),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
};

beforeEach(() => {
  state.admin = ADMIN;
  state.choose = (_projectId, preferences) => Promise.resolve(preferences);
});

describe('chooseEmailPreferences', () => {
  it("saves the admin's choice for a project they can read and answers what was stored", async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>(() =>
      Promise.resolve({ weeklyDigest: false }),
    );
    state.choose = choose;

    await expect(chooseEmailPreferences('p-store', { weeklyDigest: false })).resolves.toEqual({
      weeklyDigest: false,
    });
    expect(choose).toHaveBeenCalledWith('p-store', { weeklyDigest: false });
  });

  it('answers not found for a project the admin cannot read, without saving', async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>();
    state.choose = choose;

    await expect(chooseEmailPreferences('p-other', { weeklyDigest: false })).rejects.toThrow(
      'not-found',
    );
    expect(choose).not.toHaveBeenCalled();
  });

  it('refuses a choice that is not a weekly digest on or off, since it comes from the browser', async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>();
    state.choose = choose;
    const forged = { weeklyDigest: 'yes', monthly: true } as unknown as EmailPreferences;

    await expect(chooseEmailPreferences('p-store', forged)).rejects.toThrow(
      'E-mail preferences need a weekly digest choice, on or off.',
    );
    expect(choose).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.choose = () => Promise.reject(new UnauthenticatedError());

    await expect(chooseEmailPreferences('p-store', { weeklyDigest: true })).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});

describe('endSession', () => {
  const SESSION_ID = '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e';

  beforeEach(() => {
    state.end = () => Promise.resolve();
  });

  it('ends the session for an admin who can read the project', async () => {
    const end = vi.fn<ISessionsService['end']>(() => Promise.resolve());
    state.end = end;

    await expect(endSession('p-store', SESSION_ID)).resolves.toBeUndefined();
    expect(end).toHaveBeenCalledWith(SESSION_ID);
  });

  it('answers not found for a project the admin cannot read, without ending anything', async () => {
    const end = vi.fn<ISessionsService['end']>();
    state.end = end;

    await expect(endSession('p-other', SESSION_ID)).rejects.toThrow('not-found');
    expect(end).not.toHaveBeenCalled();
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const end = vi.fn<ISessionsService['end']>();
    state.end = end;

    await expect(endSession('p-store', 'not-a-session')).rejects.toThrow(
      'A session is ended by its id.',
    );
    expect(end).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.end = () => Promise.reject(new UnauthenticatedError());

    await expect(endSession('p-store', SESSION_ID)).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
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

  it('creates the token for an admin who can read the project, its name trimmed', async () => {
    const create = vi.fn<IAccessTokensService['create']>(() => Promise.resolve(CREATED));
    state.create = create;

    await expect(
      createAccessToken('p-store', { name: ' Claude Code ', lifetimeDays: 90 }),
    ).resolves.toEqual(CREATED);
    expect(create).toHaveBeenCalledWith({ name: 'Claude Code', lifetimeDays: 90 });
  });

  it('answers not found for a project the admin cannot read, without creating anything', async () => {
    const create = vi.fn<IAccessTokensService['create']>();
    state.create = create;

    await expect(
      createAccessToken('p-other', { name: 'Claude Code', lifetimeDays: 90 }),
    ).rejects.toThrow('not-found');
    expect(create).not.toHaveBeenCalled();
  });

  it.each([
    [{ name: '   ', lifetimeDays: 90 }],
    [{ name: 'x'.repeat(65), lifetimeDays: 90 }],
    [{ name: 'Claude Code', lifetimeDays: 7 }],
    [{ name: 'Claude Code', lifetimeDays: 90, scope: 'write' }],
  ])('refuses %j, since it comes from the browser', async (forged) => {
    const create = vi.fn<IAccessTokensService['create']>();
    state.create = create;

    await expect(createAccessToken('p-store', forged as unknown as NewAccessToken)).rejects.toThrow(
      'An access token needs a name and a lifetime of 30, 90 or 365 days.',
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.create = () => Promise.reject(new UnauthenticatedError());

    await expect(
      createAccessToken('p-store', { name: 'Claude Code', lifetimeDays: 30 }),
    ).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
  });
});

describe('revokeAccessToken', () => {
  const TOKEN_ID = '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a';

  it('revokes the token for an admin who can read the project', async () => {
    const revoke = vi.fn<IAccessTokensService['revoke']>(() => Promise.resolve());
    state.revoke = revoke;

    await expect(revokeAccessToken('p-store', TOKEN_ID)).resolves.toBeUndefined();
    expect(revoke).toHaveBeenCalledWith(TOKEN_ID);
  });

  it('answers not found for a project the admin cannot read, without revoking anything', async () => {
    const revoke = vi.fn<IAccessTokensService['revoke']>();
    state.revoke = revoke;

    await expect(revokeAccessToken('p-other', TOKEN_ID)).rejects.toThrow('not-found');
    expect(revoke).not.toHaveBeenCalled();
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const revoke = vi.fn<IAccessTokensService['revoke']>();
    state.revoke = revoke;

    await expect(revokeAccessToken('p-store', 'not-a-token')).rejects.toThrow(
      'An access token is revoked by its id.',
    );
    expect(revoke).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.revoke = () => Promise.reject(new UnauthenticatedError());

    await expect(revokeAccessToken('p-store', TOKEN_ID)).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});
