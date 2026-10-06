export const SESSION_COOKIE_NAME = 'pyxis_session';

export function apiBaseUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_PYXIS_API_URL?.trim();
  if (configured === undefined || configured === '') {
    return undefined;
  }
  return configured.endsWith('/') ? configured.slice(0, -1) : configured;
}

export function isDemoMode(): boolean {
  return apiBaseUrl() === undefined;
}
