import { describe, expect, it } from 'vitest';
import { isSessionToken } from './session-token';

describe('isSessionToken', () => {
  it('accepts 43 base64url characters, the shape of the API session token', () => {
    expect(isSessionToken(`${'a'.repeat(20)}_-${'Z9'.repeat(10)}k`)).toBe(true);
  });

  it.each([
    ['shorter', 'a'.repeat(42)],
    ['longer', 'a'.repeat(44)],
    ['padded', `${'a'.repeat(42)}=`],
    ['with a plus', `${'a'.repeat(42)}+`],
    ['not a string', 43],
    ['missing', undefined],
  ])('rejects a value that is %s', (_label, value) => {
    expect(isSessionToken(value)).toBe(false);
  });
});
