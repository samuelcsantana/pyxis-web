import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewAccessToken } from '@/domain/access-tokens';
import type { Admin } from '@/domain/admin';
import type { EmailPreferences } from '@/domain/email-preferences';
import { UnauthenticatedError } from '@/domain/errors';
import type { IAccessTokensService } from '@/services/access-tokens/access-tokens-service.interface';
import type { IConnectionsService } from '@/services/connections/connections-service.interface';
import type { IEmailPreferencesService } from '@/services/preferences/email-preferences-service.interface';
import type { IProjectManagementService } from '@/services/project-management/project-management-service.interface';
import type { IProjectPeopleService } from '@/services/project-people/project-people-service.interface';
import type { ISessionsService } from '@/services/sessions/sessions-service.interface';
import {
  requestProjectExport,
  addProjectPerson,
  chooseEmailPreferences,
  createAccessToken,
  createProjectKey,
  deleteProject,
  endSession,
  removeProjectPerson,
  revokeAccessToken,
  revokeConnection,
  revokeProjectKey,
  updateProject,
} from './actions';

const state = vi.hoisted<{
  admin: unknown;
  choose: IEmailPreferencesService['choose'];
  end: ISessionsService['end'];
  create: IAccessTokensService['create'];
  revoke: IAccessTokensService['revoke'];
  disconnect: IConnectionsService['revoke'];
  management: Omit<IProjectManagementService, 'create'>;
  people: Pick<IProjectPeopleService, 'add' | 'remove'>;
}>(() => ({
  admin: undefined,
  choose: () => Promise.reject(new Error('choose not set')),
  end: () => Promise.reject(new Error('end not set')),
  create: () => Promise.reject(new Error('create not set')),
  revoke: () => Promise.reject(new Error('revoke not set')),
  disconnect: () => Promise.reject(new Error('disconnect not set')),
  management: {
    update: () => Promise.reject(new Error('update not set')),
    createKey: () => Promise.reject(new Error('createKey not set')),
    revokeKey: () => Promise.reject(new Error('revokeKey not set')),
    delete: () => Promise.reject(new Error('delete not set')),
  },
  people: {
    add: () => Promise.reject(new Error('add not set')),
    remove: () => Promise.reject(new Error('remove not set')),
  },
}));

vi.mock('@/services/exports/exports-service.factory', () => ({
  createExportsService: () => ({
    request: (projectId: string) => Promise.resolve({ kind: 'unavailable', projectId }),
  }),
}));

vi.mock('@/services/project-people/project-people-service.factory', () => ({
  createProjectPeopleService: (): Pick<IProjectPeopleService, 'add' | 'remove'> => ({
    add: (projectId, email, locale) => state.people.add(projectId, email, locale),
    remove: (projectId, adminUserId) => state.people.remove(projectId, adminUserId),
  }),
}));

vi.mock('@/services/project-management/project-management-service.factory', () => ({
  createProjectManagementService: (): Omit<IProjectManagementService, 'create'> => ({
    update: (projectId, changes) => state.management.update(projectId, changes),
    createKey: (projectId, kind) => state.management.createKey(projectId, kind),
    revokeKey: (projectId, keyId) => state.management.revokeKey(projectId, keyId),
    delete: (projectId, confirmName) => state.management.delete(projectId, confirmName),
  }),
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

const revalidated = vi.hoisted(() => ({ paths: [] as (readonly [string, string | undefined])[] }));

vi.mock('next/cache', () => ({
  revalidatePath: (path: string, type?: string) => {
    revalidated.paths.push([path, type]);
  },
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
  email: 'owner@example.com',
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

describe('revokeConnection', () => {
  const CONNECTION_ID = '5e1a7c9d-6f8b-4a0c-9d5e-7f9a1b3c5d6e';

  it('revokes the connected app for an admin who can read the project', async () => {
    const disconnect = vi.fn<IConnectionsService['revoke']>(() => Promise.resolve());
    state.disconnect = disconnect;

    await expect(revokeConnection('p-store', CONNECTION_ID)).resolves.toBeUndefined();
    expect(disconnect).toHaveBeenCalledWith(CONNECTION_ID);
  });

  it('answers not found for a project the admin cannot read, without revoking anything', async () => {
    const disconnect = vi.fn<IConnectionsService['revoke']>();
    state.disconnect = disconnect;

    await expect(revokeConnection('p-other', CONNECTION_ID)).rejects.toThrow('not-found');
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('refuses an id that is not a UUID, since it comes from the browser', async () => {
    const disconnect = vi.fn<IConnectionsService['revoke']>();
    state.disconnect = disconnect;

    await expect(revokeConnection('p-store', '../tokens')).rejects.toThrow(
      'A connected app is revoked by its id.',
    );
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.disconnect = () => Promise.reject(new UnauthenticatedError());

    await expect(revokeConnection('p-store', CONNECTION_ID)).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});

describe('the owner managing a project', () => {
  const KEY_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';
  const CHANGES = {
    name: 'Shop',
    allowedOrigins: ['https://shop.example.com'],
    timezone: 'UTC',
    conversionEvent: null,
  };

  function management(overrides: Partial<IProjectManagementService>) {
    const mocks = {
      update: vi.fn<IProjectManagementService['update']>(() => Promise.resolve({ kind: 'saved' })),
      createKey: vi.fn<IProjectManagementService['createKey']>(() =>
        Promise.resolve({ kind: 'tooMany' }),
      ),
      revokeKey: vi.fn<IProjectManagementService['revokeKey']>(() =>
        Promise.resolve({ kind: 'revoked' }),
      ),
      delete: vi.fn<IProjectManagementService['delete']>(() =>
        Promise.resolve({ kind: 'deleted' }),
      ),
    };
    state.management = {
      update: overrides.update ?? mocks.update,
      createKey: mocks.createKey,
      revokeKey: mocks.revokeKey,
      delete: overrides.delete ?? mocks.delete,
    };
    return mocks;
  }

  beforeEach(() => {
    revalidated.paths.length = 0;
  });

  it('passes each change of a readable project to the API', async () => {
    const service = management({});

    await expect(updateProject('p-store', CHANGES)).resolves.toEqual({ kind: 'saved' });
    await expect(createProjectKey('p-store', 'secret')).resolves.toEqual({ kind: 'tooMany' });
    await expect(revokeProjectKey('p-store', KEY_ID)).resolves.toEqual({ kind: 'revoked' });
    await expect(deleteProject('p-store', 'Demo Store')).resolves.toEqual({ kind: 'deleted' });
    expect(service.update).toHaveBeenCalledWith('p-store', CHANGES);
    expect(service.createKey).toHaveBeenCalledWith('p-store', 'secret');
    expect(service.revokeKey).toHaveBeenCalledWith('p-store', KEY_ID);
    expect(service.delete).toHaveBeenCalledWith('p-store', 'Demo Store');
    expect(revalidated.paths).toEqual([
      ['/[projectId]', 'layout'],
      ['/[projectId]', 'layout'],
    ]);
  });

  it('drops no visited screen when the API kept the project as it was', async () => {
    management({
      update: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      delete: () => Promise.resolve({ kind: 'deletionOnHold' }),
    });

    await expect(updateProject('p-store', CHANGES)).resolves.toEqual({
      kind: 'subscriptionRequired',
    });
    await expect(deleteProject('p-store', 'Demo Store')).resolves.toEqual({
      kind: 'deletionOnHold',
    });
    expect(revalidated.paths).toEqual([]);
  });

  it('answers not found for a project the admin cannot read, changing nothing', async () => {
    const service = management({});

    await expect(updateProject('p-other', CHANGES)).rejects.toThrow('not-found');
    await expect(createProjectKey('p-other', 'public')).rejects.toThrow('not-found');
    await expect(revokeProjectKey('p-other', KEY_ID)).rejects.toThrow('not-found');
    await expect(deleteProject('p-other', 'Other')).rejects.toThrow('not-found');
    expect(service.update).not.toHaveBeenCalled();
    expect(service.createKey).not.toHaveBeenCalled();
    expect(service.revokeKey).not.toHaveBeenCalled();
    expect(service.delete).not.toHaveBeenCalled();
  });

  it('refuses what the browser sent wrong before calling the API', async () => {
    const service = management({});

    await expect(updateProject('p-store', { ...CHANGES, allowedOrigins: [] })).resolves.toEqual({
      kind: 'invalid',
    });
    await expect(createProjectKey('p-store', 'private' as 'public')).rejects.toThrow(
      'A project key is public or secret.',
    );
    await expect(revokeProjectKey('p-store', 'not-a-key')).rejects.toThrow(
      'A project key is revoked by its id.',
    );
    await expect(deleteProject('p-store', '')).resolves.toEqual({ kind: 'nameMismatch' });
    expect(service.update).not.toHaveBeenCalled();
    expect(service.createKey).not.toHaveBeenCalled();
    expect(service.revokeKey).not.toHaveBeenCalled();
    expect(service.delete).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    management({ update: () => Promise.reject(new UnauthenticatedError()) });

    await expect(updateProject('p-store', CHANGES)).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});

describe('the owner adding and removing people', () => {
  const PERSON_ID = 'a03c5e7f-9b1d-4c4e-9f6a-8b0c2d4e6f8a';

  function people() {
    const mocks = {
      add: vi.fn<IProjectPeopleService['add']>(() => Promise.resolve({ kind: 'limitReached' })),
      remove: vi.fn<IProjectPeopleService['remove']>(() => Promise.resolve({ kind: 'removed' })),
    };
    state.people = { add: mocks.add, remove: mocks.remove };
    return mocks;
  }

  it('adds a trimmed address with the language of the page, and removes someone by id', async () => {
    const service = people();

    await expect(addProjectPerson('p-store', ' ana@example.com ')).resolves.toEqual({
      kind: 'limitReached',
    });
    await expect(removeProjectPerson('p-store', PERSON_ID)).resolves.toEqual({ kind: 'removed' });
    expect(service.add).toHaveBeenCalledWith('p-store', 'ana@example.com', 'en');
    expect(service.remove).toHaveBeenCalledWith('p-store', PERSON_ID);
  });

  it('refuses what the browser sent wrong, and projects the admin cannot read', async () => {
    const service = people();

    await expect(addProjectPerson('p-store', 'ana@')).resolves.toEqual({ kind: 'invalidEmail' });
    await expect(removeProjectPerson('p-store', 'someone')).rejects.toThrow(
      'A person is removed by their id.',
    );
    await expect(addProjectPerson('p-other', 'ana@example.com')).rejects.toThrow('not-found');
    await expect(removeProjectPerson('p-other', PERSON_ID)).rejects.toThrow('not-found');
    expect(service.add).not.toHaveBeenCalled();
    expect(service.remove).not.toHaveBeenCalled();
  });
});

describe('requestProjectExport', () => {
  it('asks for an export of a project the admin can read, and not of another', async () => {
    await expect(requestProjectExport('p-store')).resolves.toEqual({
      kind: 'unavailable',
      projectId: 'p-store',
    });
    await expect(requestProjectExport('p-other')).rejects.toThrow('not-found');
  });
});
