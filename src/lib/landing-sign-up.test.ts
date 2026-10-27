import { describe, expect, it, vi } from 'vitest';
import {
  bestEffortOpenSignUp,
  SIGN_UP_STATUS_REVALIDATE_SECONDS,
  SIGN_UP_STATUS_TIMEOUT_MS,
} from './landing-sign-up';

const API = 'https://api.pyxis.example.com';

function answering(body: unknown, status = 200) {
  return vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  );
}

const OPEN = {
  open: true,
  terms_version: '1.1',
  terms_url: 'https://pyxis-analytics.dev/termos',
  free_plan: 'closed',
};

const OPEN_SIGN_UP = {
  termsVersion: '1.1',
  termsUrl: 'https://pyxis-analytics.dev/termos',
  freePlan: 'closed',
};

describe('whether the home page and sign-in offer to sign up, and on which plan', () => {
  it('asks the API, cached for five minutes and given up after two seconds', async () => {
    const fetcher = answering(OPEN);

    await expect(bestEffortOpenSignUp(API, fetcher)).resolves.toEqual(OPEN_SIGN_UP);

    expect(fetcher).toHaveBeenCalledWith(`${API}/v1/auth/sign-up`, {
      next: { revalidate: SIGN_UP_STATUS_REVALIDATE_SECONDS },
      signal: expect.any(AbortSignal) as AbortSignal,
    });
    expect(SIGN_UP_STATUS_REVALIDATE_SECONDS).toBe(300);
    expect(SIGN_UP_STATUS_TIMEOUT_MS).toBe(2_000);
  });

  it.each(['open', 'full'] as const)('says the free plan is %s', async (freePlan) => {
    await expect(
      bestEffortOpenSignUp(API, answering({ ...OPEN, free_plan: freePlan })),
    ).resolves.toEqual({ ...OPEN_SIGN_UP, freePlan });
  });

  it('is closed while the API keeps sign-up closed or has no terms to accept', async () => {
    await expect(
      bestEffortOpenSignUp(API, answering({ open: false, terms_version: null, terms_url: null })),
    ).resolves.toBeNull();
    await expect(
      bestEffortOpenSignUp(API, answering({ ...OPEN, terms_url: null })),
    ).resolves.toBeNull();
  });

  it('shows it closed, and says why, when the API refuses, breaks its answer or is away', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(bestEffortOpenSignUp(API, answering({}, 404))).resolves.toBeNull();
    await expect(bestEffortOpenSignUp(API, answering({ open: 'yes' }))).resolves.toBeNull();
    await expect(
      bestEffortOpenSignUp(API, () => Promise.reject(new Error('timeout'))),
    ).resolves.toBeNull();

    expect(warn).toHaveBeenCalledWith('sign-up status: the API answered 404, showing it closed');
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it('asks the API the home page measurement uses by default', async () => {
    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_ENDPOINT', 'http://localhost:3101');
    const fetcher = vi.fn<typeof fetch>(() => Promise.resolve(new Response(JSON.stringify(OPEN))));
    vi.stubGlobal('fetch', fetcher);

    await expect(bestEffortOpenSignUp()).resolves.toEqual(OPEN_SIGN_UP);
    expect(fetcher.mock.calls[0]?.[0]).toBe('http://localhost:3101/v1/auth/sign-up');
  });
});
