import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';

describe('GET /manifest.webmanifest', () => {
  it('describes the dashboard as an installable app when it talks to a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/manifest+json');
    expect(await response.json()).toMatchObject({
      id: '/',
      name: 'Pyxis',
      start_url: '/',
      display: 'standalone',
    });
  });

  it('answers 404 in demo mode, so neither the demo nor the home page offers an install', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const response = GET();

    expect(response.status).toBe(404);
    expect(response.body).toBeNull();
  });
});
