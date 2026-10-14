import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const request = vi.hoisted(() => ({ host: 'pyxis-analytics.dev' }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers({ host: request.host })),
}));

describe('GET /llms.txt', () => {
  beforeEach(() => {
    request.host = 'pyxis-analytics.dev';
  });

  it('describes Pyxis for language models on the home page domain', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    const text = await response.text();
    expect(text.startsWith('# Pyxis\n\n> Privacy-first product analytics.')).toBe(true);
    expect(text).toContain('npm install pyxis-analytics');
  });

  it('answers 404 on the live demo, which is not the home page', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    request.host = 'demo.pyxis-analytics.dev';

    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.body).toBeNull();
  });

  it('answers 404 on the dashboard', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect((await GET()).status).toBe(404);
  });
});
