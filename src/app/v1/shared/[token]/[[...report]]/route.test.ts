import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEMO_SHARE_TOKEN } from '@/services/share-links/mock-share-links-service';
import { GET } from './route';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

function get(path: string, token: string, report?: readonly string[]) {
  return GET(new Request(`http://localhost${path}`), {
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
