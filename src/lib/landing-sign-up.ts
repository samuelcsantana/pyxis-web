import { openSignUpOf } from '@/domain/sign-up';
import { signUpStatusOf } from '@/domain/sign-up.schema';
import { landingIngestionUrl } from './landing-measurement-config';

export const SIGN_UP_STATUS_PATH = '/v1/auth/sign-up';
export const SIGN_UP_STATUS_REVALIDATE_SECONDS = 300;
export const SIGN_UP_STATUS_TIMEOUT_MS = 2_000;

type Fetcher = (
  input: string,
  init: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;

export async function bestEffortSignUpIsOpen(
  apiOrigin: string = landingIngestionUrl(),
  fetcher: Fetcher = fetch,
): Promise<boolean> {
  try {
    const response = await fetcher(`${apiOrigin}${SIGN_UP_STATUS_PATH}`, {
      next: { revalidate: SIGN_UP_STATUS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(SIGN_UP_STATUS_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.warn(
        `sign-up status: the API answered ${String(response.status)}, showing it closed`,
      );
      return false;
    }
    return openSignUpOf(signUpStatusOf(await response.json())) !== null;
  } catch (error) {
    console.warn('sign-up status: could not read it, showing it closed', error);
    return false;
  }
}
