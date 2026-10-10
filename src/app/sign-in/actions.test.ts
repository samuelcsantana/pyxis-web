import { beforeEach, describe, expect, it, vi } from 'vitest';
import { endAllSessions, endSession, keepSession } from './actions';

interface SetCookieCall {
  readonly name: string;
  readonly value: string;
  readonly options: Record<string, unknown>;
}

const state = vi.hoisted(() => ({
  cookieValue: undefined as string | undefined,
  setCalls: [] as SetCookieCall[],
  requestOrigin: null as string | null,
  revoked: [] as { baseUrl: string; token: string; origin: string | null; scope: string }[],
  revokeFails: false,
}));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        state.cookieValue === undefined ? undefined : { name, value: state.cookieValue },
      set: (name: string, value: string, options: Record<string, unknown>) => {
        state.setCalls.push({ name, value, options });
      },
    }),
  headers: () =>
    Promise.resolve(
      new Headers(state.requestOrigin === null ? {} : { origin: state.requestOrigin }),
    ),
}));

vi.mock('@/services/auth/revoke-session', () => ({
  revokeSession: (baseUrl: string, token: string, origin: string | null, scope: string) => {
    state.revoked.push({ baseUrl, token, origin, scope });
    return state.revokeFails ? Promise.reject(new Error('refused')) : Promise.resolve();
  },
}));

const API = 'https://api.pyxis.example.com';
const TOKEN = 'B'.repeat(43);
const HOST_ONLY = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
};

describe('keepSession', () => {
  beforeEach(() => {
    state.setCalls = [];
  });

  it('keeps a well-formed token in a host-only HttpOnly cookie for seven days', async () => {
    await keepSession(TOKEN);

    expect(state.setCalls).toEqual([
      {
        name: '__Host-pyxis_session',
        value: TOKEN,
        options: { ...HOST_ONLY, maxAge: 604_800 },
      },
    ]);
  });

  it.each([
    ['too short', 'abc'],
    ['padded', `${'B'.repeat(42)}=`],
    ['not a string', 42],
  ])('refuses a token that is %s and sets no cookie', async (_label, token) => {
    await expect(keepSession(token)).rejects.toThrow('no session token');
    expect(state.setCalls).toEqual([]);
  });
});

describe('endSession', () => {
  beforeEach(() => {
    state.setCalls = [];
    state.revoked = [];
    state.revokeFails = false;
    state.requestOrigin = 'https://app.pyxis.example.com';
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);
  });

  it('revokes the session on the API with the dashboard origin, then clears the cookie', async () => {
    state.cookieValue = TOKEN;

    await endSession();

    expect(state.revoked).toEqual([
      {
        baseUrl: API,
        token: TOKEN,
        origin: 'https://app.pyxis.example.com',
        scope: 'this-session',
      },
    ]);
    expect(state.setCalls).toEqual([
      { name: '__Host-pyxis_session', value: '', options: { ...HOST_ONLY, maxAge: 0 } },
    ]);
  });

  it('only clears the cookie when there is no session to revoke', async () => {
    state.cookieValue = undefined;

    await endSession();

    expect(state.revoked).toEqual([]);
    expect(state.setCalls).toHaveLength(1);
  });

  it('only clears the cookie in demo mode, where no API exists', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    state.cookieValue = TOKEN;

    await endSession();

    expect(state.revoked).toEqual([]);
    expect(state.setCalls).toHaveLength(1);
  });

  it('keeps the cookie when the API refuses the revocation, so the failure is visible', async () => {
    state.cookieValue = TOKEN;
    state.revokeFails = true;

    await expect(endSession()).rejects.toThrow('refused');
    expect(state.setCalls).toEqual([]);
  });
});

describe('endAllSessions', () => {
  beforeEach(() => {
    state.setCalls = [];
    state.revoked = [];
    state.revokeFails = false;
    state.requestOrigin = 'https://app.pyxis.example.com';
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);
  });

  it('revokes every session of the admin on the API, then clears the cookie', async () => {
    state.cookieValue = TOKEN;

    await endAllSessions();

    expect(state.revoked).toEqual([
      { baseUrl: API, token: TOKEN, origin: 'https://app.pyxis.example.com', scope: 'everywhere' },
    ]);
    expect(state.setCalls).toEqual([
      { name: '__Host-pyxis_session', value: '', options: { ...HOST_ONLY, maxAge: 0 } },
    ]);
  });

  it('keeps the cookie when the API refuses, like signing out of one device', async () => {
    state.cookieValue = TOKEN;
    state.revokeFails = true;

    await expect(endAllSessions()).rejects.toThrow('refused');
    expect(state.setCalls).toEqual([]);
  });
});
