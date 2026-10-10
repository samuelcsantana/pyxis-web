export const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function isSessionToken(value: unknown): value is string {
  return typeof value === 'string' && SESSION_TOKEN_PATTERN.test(value);
}
