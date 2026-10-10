import { ApiRequestError } from '@/domain/errors';
import { API_SESSION_COOKIE_NAME } from '@/lib/session-cookie';

export const LOGOUT_PATH = '/v1/auth/logout';
export const LOGOUT_EVERYWHERE_PATH = '/v1/auth/logout-all';

export type RevocationScope = 'this-session' | 'everywhere';

const PATH_BY_SCOPE: Readonly<Record<RevocationScope, string>> = {
  'this-session': LOGOUT_PATH,
  everywhere: LOGOUT_EVERYWHERE_PATH,
};

export async function revokeSession(
  baseUrl: string,
  token: string,
  dashboardOrigin: string | null,
  scope: RevocationScope = 'this-session',
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const path = PATH_BY_SCOPE[scope];
  const response = await fetchImpl(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      cookie: `${API_SESSION_COOKIE_NAME}=${token}`,
      'content-type': 'application/json',
      ...(dashboardOrigin === null ? {} : { origin: dashboardOrigin }),
    },
    body: '{}',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new ApiRequestError(path, response.status);
  }
}
