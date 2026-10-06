import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/api-config';
import { ApiReader } from './api-reader';

async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export function createApiReader(baseUrl: string): ApiReader {
  return new ApiReader(baseUrl, sessionToken);
}
