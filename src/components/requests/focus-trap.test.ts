import { describe, expect, it } from 'vitest';
import { wrappedFocus } from './focus-trap';

function buttons(count: number): HTMLButtonElement[] {
  return Array.from({ length: count }, () => document.createElement('button'));
}

describe('wrappedFocus', () => {
  it('wraps from the last element to the first going forward', () => {
    const [first, middle, last] = buttons(3);
    const all = [first, middle, last].filter((button) => button !== undefined);

    expect(wrappedFocus(all, last ?? null, false)).toBe(first);
    expect(wrappedFocus(all, middle ?? null, false)).toBeUndefined();
  });

  it('wraps from the first element to the last going backward', () => {
    const [first, middle, last] = buttons(3);
    const all = [first, middle, last].filter((button) => button !== undefined);

    expect(wrappedFocus(all, first ?? null, true)).toBe(last);
    expect(wrappedFocus(all, middle ?? null, true)).toBeUndefined();
  });

  it('moves nothing when there is nothing to focus', () => {
    expect(wrappedFocus([], null, false)).toBeUndefined();
  });
});
