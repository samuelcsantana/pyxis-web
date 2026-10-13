import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isOnLandingHost } from './request-host';

const request = vi.hoisted((): { headers: Record<string, string> } => ({ headers: {} }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers(request.headers)),
}));

describe('isOnLandingHost', () => {
  beforeEach(() => {
    request.headers = {};
  });

  it('knows a request for the main domain, port or not', async () => {
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
