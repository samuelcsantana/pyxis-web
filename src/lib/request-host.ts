import { headers } from 'next/headers';
import { requestHostname } from './host-name';
import { LANDING_HOST } from './site';

export async function isOnLandingHost(): Promise<boolean> {
  return requestHostname(await headers()) === LANDING_HOST;
}
