import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/api-config';

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}
