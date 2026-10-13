import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hostnameOf, isOnLandingHost } from './request-host';

const request = vi.hoisted((): { headers: Record<string, string> } => ({ headers: {} }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers(request.headers)),
}));

describe('request host', () => {
  beforeEach(() => {
    request.headers = {};
  });

  it('reads the host name without its port', () => {
    expect(hostnameOf('pyxis-analytics.dev')).toBe('pyxis-analytics.dev');
    expect(hostnameOf('pyxis-analytics.dev:3101')).toBe('pyxis-analytics.dev');
  });

  it('reads nothing from a missing, empty or malformed host', () => {
    expect(hostnameOf(null)).toBeUndefined();
    expect(hostnameOf('')).toBeUndefined();
    expect(hostnameOf('bad host')).toBeUndefined();
  });

  it('knows a request for the main domain, from the forwarded host first', async () => {
    request.headers = { 'x-forwarded-host': 'pyxis-analytics.dev', host: 'internal.vercel.app' };

    await expect(isOnLandingHost()).resolves.toBe(true);
  });

  it('falls back to the host header, port included', async () => {
    request.headers = { host: 'pyxis-analytics.dev:3101' };

    await expect(isOnLandingHost()).resolves.toBe(true);
  });

  it('tells the demo host and a request with no host apart from the main domain', async () => {
    request.headers = { host: 'demo.pyxis-analytics.dev' };
    await expect(isOnLandingHost()).resolves.toBe(false);

    request.headers = {};
    await expect(isOnLandingHost()).resolves.toBe(false);
  });
});
