import { cookies } from 'next/headers';

export const FREE_PLAN_CHECKOUT_COOKIE_NAME = 'pyxis_free_plan_checkout';
export const FREE_PLAN_CHECKOUT_MAX_AGE_SECONDS = 24 * 60 * 60;

export async function rememberFreePlanCheckout(accountId: string): Promise<void> {
  (await cookies()).set(FREE_PLAN_CHECKOUT_COOKIE_NAME, accountId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: FREE_PLAN_CHECKOUT_MAX_AGE_SECONDS,
  });
}

export async function isBackFromFreePlanCheckout(accountId: string): Promise<boolean> {
  return (await cookies()).get(FREE_PLAN_CHECKOUT_COOKIE_NAME)?.value === accountId;
}
