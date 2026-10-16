import { describe, expect, it, vi } from 'vitest';
import { isLandingHostname } from './landing-host';

const DEPLOYMENT = 'pyxis-demo-abc123-team.vercel.app';
const BRANCH = 'pyxis-demo-git-feat-x-team.vercel.app';

describe('isLandingHostname', () => {
  it('knows the main domain and nothing else in production', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('VERCEL_URL', DEPLOYMENT);

    expect(isLandingHostname('pyxis-analytics.dev')).toBe(true);
    expect(isLandingHostname(DEPLOYMENT)).toBe(false);
    expect(isLandingHostname('demo.pyxis-analytics.dev')).toBe(false);
    expect(isLandingHostname(undefined)).toBe(false);
  });

  it('also serves the home page on the addresses of a preview deployment', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('VERCEL_URL', DEPLOYMENT);
    vi.stubEnv('VERCEL_BRANCH_URL', BRANCH);

    expect(isLandingHostname(DEPLOYMENT)).toBe(true);
    expect(isLandingHostname(BRANCH)).toBe(true);
    expect(isLandingHostname('pyxis-analytics.dev')).toBe(true);
    expect(isLandingHostname('other.vercel.app')).toBe(false);
  });

  it('ignores preview addresses the platform left empty', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('VERCEL_URL', '');

    expect(isLandingHostname('')).toBe(false);
  });
});
