import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEMO_PROTECTED_SHARE_TOKEN,
  DEMO_SHARE_PASSWORD,
  DEMO_SHARE_TOKEN,
  DEMO_SHARE_UNLOCK,
} from '@/services/share-links/mock-share-links-service';
import { GET, POST } from './route';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

function get(path: string, token: string, report?: readonly string[], headers?: HeadersInit) {
  return GET(new Request(`http://localhost${path}`, { headers }), {
    params: Promise.resolve(report === undefined ? { token } : { token, report }),
  });
}

function post(token: string, report: readonly string[] | undefined, body: string) {
  return POST(new Request(`http://localhost/v1/shared/${token}/unlock`, { method: 'POST', body }), {
    params: Promise.resolve(report === undefined ? { token } : { token, report }),
  });
}

describe('GET /v1/shared/[token]', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('serves the demo card and reports in the demo, never stored', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const card = await get(`/v1/shared/${DEMO_SHARE_TOKEN}`, DEMO_SHARE_TOKEN);
    const report = await get(
      `/v1/shared/${DEMO_SHARE_TOKEN}/devices?from=2026-10-30&to=2026-11-05`,
      DEMO_SHARE_TOKEN,
      ['devices'],
    );

    expect(card.status).toBe(200);
    expect(card.headers.get('cache-control')).toBe('no-store');
    await expect(card.json()).resolves.toHaveProperty('project.name', 'My site');
    expect(report.status).toBe(200);
  });

  it('answers the API 404 to any other token in the demo', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const closed = await get('/v1/shared/x', `pyxis_sh_${'A'.repeat(32)}`);

    expect(closed.status).toBe(404);
    await expect(closed.json()).resolves.toHaveProperty('error', 'share_link_not_found');
  });

  it('is not there at all when the dashboard reads a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const response = await get(`/v1/shared/${DEMO_SHARE_TOKEN}`, DEMO_SHARE_TOKEN);

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('');
  });
});

describe('the protected demo link on /v1/shared/[token]', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('unlocks with the demo password and opens the card with the unlock as a Bearer', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const unlocked = await post(
      DEMO_PROTECTED_SHARE_TOKEN,
      ['unlock'],
      JSON.stringify({ password: DEMO_SHARE_PASSWORD }),
    );
    const locked = await get(
      `/v1/shared/${DEMO_PROTECTED_SHARE_TOKEN}`,
      DEMO_PROTECTED_SHARE_TOKEN,
    );
    const card = await get(
      `/v1/shared/${DEMO_PROTECTED_SHARE_TOKEN}`,
      DEMO_PROTECTED_SHARE_TOKEN,
      undefined,
      { authorization: `Bearer ${DEMO_SHARE_UNLOCK}` },
    );

    expect(unlocked.status).toBe(200);
    expect(unlocked.headers.get('cache-control')).toBe('no-store');
    await expect(unlocked.json()).resolves.toHaveProperty('unlock', DEMO_SHARE_UNLOCK);
    await expect(locked.json()).resolves.toEqual({ password_required: true });
    await expect(card.json()).resolves.toHaveProperty('project.name', 'My site');
  });

  it.each([
    ['a wrong password', JSON.stringify({ password: 'guess' })],
    ['a body without a password', JSON.stringify({ secret: DEMO_SHARE_PASSWORD })],
    ['a body that is not JSON', 'pyxis-demo'],
    ['a body that is not an object', JSON.stringify(DEMO_SHARE_PASSWORD)],
  ])('refuses %s', async (_, body) => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const response = await post(DEMO_PROTECTED_SHARE_TOKEN, ['unlock'], body);

    expect(response.status).toBe(401);
  });

  it.each([
    ['another path than unlock', ['overview'], ''],
    ['the link itself', undefined, ''],
  ])('takes no POST on %s', async (_, report, api) => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', api);

    const response = await post(DEMO_PROTECTED_SHARE_TOKEN, report, '{}');

    expect(response.status).toBe(404);
  });

  it('takes no unlock when the dashboard reads a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const response = await post(DEMO_PROTECTED_SHARE_TOKEN, ['unlock'], '{"password":"x"}');

    expect(response.status).toBe(404);
  });

  it('reads no Bearer from another kind of authorization', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const response = await get(
      `/v1/shared/${DEMO_PROTECTED_SHARE_TOKEN}`,
      DEMO_PROTECTED_SHARE_TOKEN,
      undefined,
      { authorization: `Basic ${DEMO_SHARE_UNLOCK}` },
    );

    await expect(response.json()).resolves.toEqual({ password_required: true });
  });
});
