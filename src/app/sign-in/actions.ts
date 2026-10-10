'use server';

import { cookies, headers } from 'next/headers';
import { isSessionToken } from '@/domain/session-token';
import { apiBaseUrl } from '@/lib/api-config';
import {
  SESSION_COOKIE_ATTRIBUTES,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/session-cookie';
import { revokeSession } from '@/services/auth/revoke-session';

export async function keepSession(token: unknown): Promise<void> {
  if (!isSessionToken(token)) {
    throw new Error('The sign-in answered no session token.');
  }
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_ATTRIBUTES,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  const baseUrl = apiBaseUrl();
  if (token !== undefined && baseUrl !== undefined) {
    await revokeSession(baseUrl, token, (await headers()).get('origin'));
  }
  store.set(SESSION_COOKIE_NAME, '', { ...SESSION_COOKIE_ATTRIBUTES, maxAge: 0 });
}
