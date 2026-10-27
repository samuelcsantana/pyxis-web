import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FREE_PLAN_CHECKOUT_COOKIE_NAME,
  FREE_PLAN_CHECKOUT_MAX_AGE_SECONDS,
  isBackFromFreePlanCheckout,
  rememberFreePlanCheckout,
} from './free-plan-checkout';

const jar = vi.hoisted(() => new Map<string, string>());
const set = vi.hoisted(() =>
  vi.fn((name: string, value: string) => {
    jar.set(name, value);
  }),
);

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = jar.get(name);
        return value === undefined ? undefined : { name, value };
      },
      set,
    }),
}));

describe('the Checkout opened from the free plan', () => {
  beforeEach(() => {
    jar.clear();
    set.mockClear();
  });

  it('is remembered for a day, for that account only, out of reach of scripts', async () => {
    await rememberFreePlanCheckout('a1');

    expect(set).toHaveBeenCalledWith(FREE_PLAN_CHECKOUT_COOKIE_NAME, 'a1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: FREE_PLAN_CHECKOUT_MAX_AGE_SECONDS,
    });
    expect(FREE_PLAN_CHECKOUT_MAX_AGE_SECONDS).toBe(86_400);
    await expect(isBackFromFreePlanCheckout('a1')).resolves.toBe(true);
    await expect(isBackFromFreePlanCheckout('a2')).resolves.toBe(false);
  });

  it('is not assumed without the cookie', async () => {
    await expect(isBackFromFreePlanCheckout('a1')).resolves.toBe(false);
  });
});
