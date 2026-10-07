import { describe, expect, it, vi } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('lets crawlers into the live demo', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(robots().rules).toEqual({ userAgent: '*', allow: '/' });
  });

  it('keeps crawlers out of a dashboard with a real API', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' });
  });
});
