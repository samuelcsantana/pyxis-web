import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/session-cookie';

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}
