import { headers } from 'next/headers';
import { returnPathOf } from '@/components/shell/screens';

export const REQUESTED_PATH_HEADER = 'x-pyxis-requested-path';

export async function requestedScreenPath(): Promise<string | undefined> {
  return returnPathOf((await headers()).get(REQUESTED_PATH_HEADER));
}
