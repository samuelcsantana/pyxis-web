import { describe, expect, it } from 'vitest';
import {
  type AccessToken,
  accessTokenNameProblem,
  canCreateAccessToken,
  isAccessTokenLifetime,
  MAX_LIVE_ACCESS_TOKENS,
} from './access-tokens';
import { createdAccessTokenResponseSchema } from './access-tokens.schema';

const TOKEN: AccessToken = {
  id: '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a',
  name: 'Claude Code',
  createdAt: '2026-10-02T12:00:00.000Z',
  lastUsedAt: null,
  expiresAt: '2026-12-31T12:00:00.000Z',
};

describe('access tokens', () => {
  it.each([
    [30, true],
    [90, true],
    [365, true],
    [7, false],
    [0, false],
  ])('knows whether %i days is a lifetime the API accepts', (days, accepted) => {
    expect(isAccessTokenLifetime(days)).toBe(accepted);
  });

  it('allows a new token only below ten live ones', () => {
    expect(
      canCreateAccessToken(Array.from({ length: MAX_LIVE_ACCESS_TOKENS - 1 }, () => TOKEN)),
    ).toBe(true);
    expect(canCreateAccessToken(Array.from({ length: MAX_LIVE_ACCESS_TOKENS }, () => TOKEN))).toBe(
      false,
    );
  });

  it.each([
    ['', 'missing'],
    ['   ', 'missing'],
    ['x'.repeat(65), 'tooLong'],
    [` ${'x'.repeat(64)} `, null],
    ['Claude Code', null],
  ])('judges the name %j', (name, problem) => {
    expect(accessTokenNameProblem(name)).toBe(problem);
  });

  it('reads a created token as one never used yet', () => {
    expect(
      createdAccessTokenResponseSchema.parse({
        id: TOKEN.id,
        name: 'Claude Code',
        token: `pyxis_at_${'A'.repeat(32)}`,
        created_at: TOKEN.createdAt,
        expires_at: TOKEN.expiresAt,
      }),
    ).toEqual({ ...TOKEN, token: `pyxis_at_${'A'.repeat(32)}` });
  });
});
