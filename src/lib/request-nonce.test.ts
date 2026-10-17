import { describe, expect, it, vi } from 'vitest';
import { requestNonce } from './request-nonce';

const requestHeaders = vi.hoisted(() => new Headers());

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(requestHeaders),
}));

describe('requestNonce', () => {
  it('reads the nonce of the policy the proxy set on the request', async () => {
    requestHeaders.set(
      'Content-Security-Policy',
      "script-src 'self' 'nonce-YWJj' 'strict-dynamic'",
    );

    await expect(requestNonce()).resolves.toBe('YWJj');
  });

  it('returns nothing when the request carries no policy', async () => {
    requestHeaders.delete('Content-Security-Policy');

    await expect(requestNonce()).resolves.toBeUndefined();
  });
});
