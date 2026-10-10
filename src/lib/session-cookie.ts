export const SESSION_COOKIE_NAME = '__Host-pyxis_session';
export const API_SESSION_COOKIE_NAME = 'pyxis_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const SESSION_COOKIE_ATTRIBUTES = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;
