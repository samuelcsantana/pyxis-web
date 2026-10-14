import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const request = vi.hoisted(() => ({ awaited: 0 }));

vi.mock('next/server', () => ({
  connection: () => {
    request.awaited += 1;
    return Promise.resolve();
  },
}));

describe('GET /manifest.webmanifest', () => {
  beforeEach(() => {
    request.awaited = 0;
  });

  it('describes the dashboard as an installable app when it talks to a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/manifest+json');
    expect(await response.json()).toMatchObject({
      id: '/',
      name: 'Pyxis',
      start_url: '/',
      display: 'standalone',
    });
  });

  it('stays prerendered on the dashboard, where the answer never changes', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    await GET();

    expect(request.awaited).toBe(0);
  });

  it('answers 404 in demo mode, so neither the demo nor the home page offers an install', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.body).toBeNull();
  });

  it('answers the 404 at request time, because a host can serve a prerendered 404 as a 200', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    await GET();

    expect(request.awaited).toBe(1);
  });
});
