import { describe, expect, it } from 'vitest';
import {
  apiOriginFrom,
  buildContentSecurityPolicy,
  buildSecurityHeaders,
  createNonce,
} from './security-headers';

const NONCE = 'dGVzdC1ub25jZS12YWx1ZQ==';
const BASE64_OF_16_BYTES = /^[A-Za-z0-9+/]{22}==$/;

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

describe('createNonce', () => {
  it('encodes sixteen random bytes as base64, fresh every time', () => {
    const first = createNonce();
    const second = createNonce();

    expect(first).toMatch(BASE64_OF_16_BYTES);
    expect(second).toMatch(BASE64_OF_16_BYTES);
    expect(first).not.toBe(second);
  });
});

describe('buildContentSecurityPolicy', () => {
  it('allows scripts by nonce only, the ones they load included, never inline ones', () => {
    const policy = buildContentSecurityPolicy({ isDev: false, nonce: NONCE });

    expect(policy).toContain(`script-src 'self' 'nonce-${NONCE}' 'strict-dynamic';`);
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });

  it('allows connections to the API origin when there is one', () => {
    const policy = buildContentSecurityPolicy({
      apiOrigin: 'https://api.pyxis.example.com',
      isDev: false,
      nonce: NONCE,
    });

    expect(policy).toContain("connect-src 'self' https://api.pyxis.example.com");
  });

  it('allows connections to this origin only without an API', () => {
    const policy = buildContentSecurityPolicy({ isDev: false, nonce: NONCE });

    expect(policy).toContain("connect-src 'self';");
  });

  it('allows eval only in development, for React Refresh', () => {
    expect(buildContentSecurityPolicy({ isDev: true, nonce: NONCE })).toContain("'unsafe-eval'");
    expect(buildContentSecurityPolicy({ isDev: false, nonce: NONCE })).not.toContain(
      "'unsafe-eval'",
    );
  });

  it('forbids plugins, base hijacking, foreign form targets and framing', () => {
    const policy = buildContentSecurityPolicy({ isDev: false, nonce: NONCE });

    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("form-action 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});

describe('buildSecurityHeaders', () => {
  it('lists the hardening headers that need no request, leaving the CSP to the proxy', () => {
    const headers = buildSecurityHeaders();

    expect(headers.map((header) => header.key)).toEqual([
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Strict-Transport-Security',
    ]);
  });
});
