import { describe, expect, it } from 'vitest';
import { apiOriginFrom, buildContentSecurityPolicy, buildSecurityHeaders } from './security-headers';

describe('apiOriginFrom', () => {
  it('keeps only the origin of the API URL', () => {
    expect(apiOriginFrom('https://api.pyxis.example.com/v1/batch')).toBe(
      'https://api.pyxis.example.com',
    );
  });

  it.each([
    ['unset', undefined],
    ['empty', ''],
    ['not a URL', 'not a url'],
  ])('returns nothing when the value is %s', (_label, value) => {
    expect(apiOriginFrom(value)).toBeUndefined();
  });
});

describe('buildContentSecurityPolicy', () => {
  it('allows connections to the API origin when there is one', () => {
    const policy = buildContentSecurityPolicy({
      apiOrigin: 'https://api.pyxis.example.com',
      isDev: false,
    });

    expect(policy).toContain("connect-src 'self' https://api.pyxis.example.com");
  });

  it('allows connections to this origin only without an API', () => {
    const policy = buildContentSecurityPolicy({ isDev: false });

    expect(policy).toContain("connect-src 'self';");
  });

  it('allows eval only in development, for React Refresh', () => {
    expect(buildContentSecurityPolicy({ isDev: true })).toContain("'unsafe-eval'");
    expect(buildContentSecurityPolicy({ isDev: false })).not.toContain("'unsafe-eval'");
  });

  it('forbids plugins, base hijacking, foreign form targets and framing', () => {
    const policy = buildContentSecurityPolicy({ isDev: false });

    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("form-action 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});

describe('buildSecurityHeaders', () => {
  it('sends the CSP with the other hardening headers', () => {
    const headers = buildSecurityHeaders({ isDev: false });

    expect(headers.map((header) => header.key)).toEqual([
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Strict-Transport-Security',
    ]);
    expect(headers[0]?.value).toBe(buildContentSecurityPolicy({ isDev: false }));
  });
});
