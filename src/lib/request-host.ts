import { headers } from 'next/headers';
import { LANDING_HOST } from './site';

const FORWARDED_HOST_HEADER = 'x-forwarded-host';
const HOST_HEADER = 'host';

export function hostnameOf(host: string | null): string | undefined {
  if (host === null || host === '') {
    return undefined;
  }
  try {
    return new URL(`http://${host}`).hostname;
  } catch {
    return undefined;
  }
}

export async function isOnLandingHost(): Promise<boolean> {
  const requestHeaders = await headers();
  const host = requestHeaders.get(FORWARDED_HOST_HEADER) ?? requestHeaders.get(HOST_HEADER);
  return hostnameOf(host) === LANDING_HOST;
}
