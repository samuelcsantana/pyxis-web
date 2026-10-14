export const ACCESS_TOKEN_LIFETIMES = [30, 90, 365] as const;
export type AccessTokenLifetime = (typeof ACCESS_TOKEN_LIFETIMES)[number];
export const DEFAULT_ACCESS_TOKEN_LIFETIME: AccessTokenLifetime = 90;
export const MAX_ACCESS_TOKEN_NAME_LENGTH = 64;
export const MAX_LIVE_ACCESS_TOKENS = 10;

export interface AccessToken {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly expiresAt: string;
}

export interface CreatedAccessToken extends AccessToken {
  readonly token: string;
}

export interface NewAccessToken {
  readonly name: string;
  readonly lifetimeDays: AccessTokenLifetime;
}

export type CreateAccessTokenOutcome =
  { readonly kind: 'created'; readonly token: CreatedAccessToken } | { readonly kind: 'tooMany' };

export function isAccessTokenLifetime(days: number): days is AccessTokenLifetime {
  return ACCESS_TOKEN_LIFETIMES.some((lifetime) => lifetime === days);
}

export function canCreateAccessToken(tokens: readonly AccessToken[]): boolean {
  return tokens.length < MAX_LIVE_ACCESS_TOKENS;
}

export type AccessTokenNameProblem = 'missing' | 'tooLong';

export function accessTokenNameProblem(name: string): AccessTokenNameProblem | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'missing';
  }
  return trimmed.length > MAX_ACCESS_TOKEN_NAME_LENGTH ? 'tooLong' : null;
}
