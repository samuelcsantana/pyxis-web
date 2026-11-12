import { beforeEach, describe, expect, it, vi } from 'vitest';
import robots from './robots';

const request = vi.hoisted(() => ({ host: 'demo.pyxis-analytics.dev' }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers({ host: request.host })),
}));

describe('robots', () => {
  beforeEach(() => {
    request.host = 'demo.pyxis-analytics.dev';
  });

  it('lets crawlers into the screens of the live demo and points them at its sitemap', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const { rules, sitemap } = await robots();

    expect(rules).toMatchObject({ userAgent: '*', allow: '/' });
    expect(sitemap).toBe('https://demo.pyxis-analytics.dev/sitemap.xml');
  });

  it('keeps crawlers of the live demo away from filtered addresses and CSV exports', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const { rules } = await robots();

    expect(rules).toMatchObject({ disallow: ['/*?', '/*/export'] });
  });

  it('points crawlers of the main domain at the home page sitemap', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    request.host = 'pyxis-analytics.dev';

    await expect(robots()).resolves.toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://pyxis-analytics.dev/sitemap.xml',
    });
  });

  it('keeps crawlers out of a dashboard with a real API, with no sitemap', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    request.host = 'pyxis-analytics.dev';

    await expect(robots()).resolves.toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
