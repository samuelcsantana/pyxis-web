import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/domain/errors';
import { revokeSession } from './revoke-session';

const API = 'https://api.pyxis.example.com';
const TOKEN = 'C'.repeat(43);

function answering(status: number) {
  return vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status })));
}

describe('revokeSession', () => {
  it('posts the logout with the token as the API cookie and the dashboard as the origin', async () => {
    const fetchMock = answering(204);

    await revokeSession(API, TOKEN, 'https://app.pyxis.example.com', fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: `pyxis_session=${TOKEN}`,
        'content-type': 'application/json',
        origin: 'https://app.pyxis.example.com',
      },
      body: '{}',
      cache: 'no-store',
    });
  });

  it('sends no origin header when the request carried none', async () => {
    const fetchMock = answering(204);

    await revokeSession(API, TOKEN, null, fetchMock);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      cookie: `pyxis_session=${TOKEN}`,
      'content-type': 'application/json',
    });
  });

  it('reports a refusal with the path and the status', async () => {
    await expect(revokeSession(API, TOKEN, null, answering(403))).rejects.toMatchObject({
      path: '/v1/auth/logout',
      status: 403,
    });
    await expect(revokeSession(API, TOKEN, null, answering(403))).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });
});
