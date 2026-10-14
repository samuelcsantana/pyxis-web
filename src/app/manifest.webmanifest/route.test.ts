import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /manifest.webmanifest', () => {
  it('answers the manifest of the app with the web app manifest type', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/manifest+json');
    expect(await response.json()).toMatchObject({
      name: 'Pyxis',
      start_url: '/',
      display: 'standalone',
    });
  });
});
