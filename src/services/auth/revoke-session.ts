import { ApiRequestError } from '@/domain/errors';
import { API_SESSION_COOKIE_NAME } from '@/lib/session-cookie';

export const LOGOUT_PATH = '/v1/auth/logout';

export async function revokeSession(
  baseUrl: string,
  token: string,
  dashboardOrigin: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const response = await fetchImpl(`${baseUrl}${LOGOUT_PATH}`, {
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
    throw new ApiRequestError(LOGOUT_PATH, response.status);
  }
}
