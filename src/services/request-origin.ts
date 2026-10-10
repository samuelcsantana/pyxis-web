import { headers } from 'next/headers';

export async function requestOrigin(): Promise<string | null> {
  return (await headers()).get('origin');
}
