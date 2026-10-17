import { headers } from 'next/headers';
import { CONTENT_SECURITY_POLICY_HEADER, nonceOf } from './security-headers';

export async function requestNonce(): Promise<string | undefined> {
  return nonceOf((await headers()).get(CONTENT_SECURITY_POLICY_HEADER));
}
