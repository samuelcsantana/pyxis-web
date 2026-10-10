import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/domain/errors';
import { revokeSession } from './revoke-session';

const API = 'https://api.pyxis.example.com';
const TOKEN = 'C'.repeat(43);
const DASHBOARD = 'https://app.pyxis.example.com';

function answering(status: number) {
  return vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status })));
}

describe('revokeSession', () => {
  it('posts the logout with the token as the API cookie and the dashboard as the origin', async () => {
    const fetchMock = answering(204);

    await revokeSession(API, TOKEN, DASHBOARD, 'this-session', fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: `pyxis_session=${TOKEN}`,
        'content-type': 'application/json',
        origin: DASHBOARD,
      },
      body: '{}',
      cache: 'no-store',
    });
  });

  it('posts to logout-all when every session of the admin is to go', async () => {
    const fetchMock = answering(204);

    await revokeSession(API, TOKEN, DASHBOARD, 'everywhere', fetchMock);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/auth/logout-all`);
  });

  it('revokes this session only when no scope is named', async () => {
    const fetchMock = answering(204);
    vi.stubGlobal('fetch', fetchMock);

    await revokeSession(API, TOKEN, DASHBOARD);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/auth/logout`);
    vi.unstubAllGlobals();
  });

  it('sends no origin header when the request carried none', async () => {
    const fetchMock = answering(204);

    await revokeSession(API, TOKEN, null, 'this-session', fetchMock);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      cookie: `pyxis_session=${TOKEN}`,
      'content-type': 'application/json',
    });
  });

  it('reports a refusal with the path and the status', async () => {
    await expect(
      revokeSession(API, TOKEN, null, 'everywhere', answering(403)),
    ).rejects.toMatchObject({ path: '/v1/auth/logout-all', status: 403 });
    await expect(
      revokeSession(API, TOKEN, null, 'this-session', answering(403)),
    ).rejects.toBeInstanceOf(ApiRequestError);
  });
});
