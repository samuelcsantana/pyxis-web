import { describe, expect, it, vi } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('lets crawlers into the live demo and points them at its sitemap', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://demo.pyxis-analytics.dev/sitemap.xml',
    });
  });

  it('keeps crawlers out of a dashboard with a real API, with no sitemap', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
