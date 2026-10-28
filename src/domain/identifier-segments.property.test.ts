import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { PROPERTY_RUN } from '@/test-utils/property-run';
import { identifierSegments } from './identifier-segments';

const SEPARATORS = ['/', '_', '.', '-', '=', ':'] as const;

function isSeparator(character: string): boolean {
  return SEPARATORS.some((separator) => separator === character);
}

function hasSeparator(text: string): boolean {
  return SEPARATORS.some((separator) => text.includes(separator));
}

const anyCodePoint = fc.string({ unit: 'binary', minLength: 1, maxLength: 1 });
const identifier = fc.string({ unit: fc.oneof(fc.constantFrom(...SEPARATORS), anyCodePoint) });

describe('identifierSegments over generated identifiers', () => {
  it('loses nothing: the segments join back into the text, and none is empty', () => {
    fc.assert(
      fc.property(identifier, (text) => {
        const segments = identifierSegments(text);

        expect(segments.join('')).toBe(text);
        expect(segments.every((segment) => segment !== '')).toBe(true);
      }),
      PROPERTY_RUN,
    );
  });

  it('cuts right after every separator and nowhere else', () => {
    fc.assert(
      fc.property(identifier, (text) => {
        const segments = identifierSegments(text);
        const bodies = segments.map((segment) => segment.slice(0, -1));

        expect(bodies.some(hasSeparator)).toBe(false);
        expect(segments.slice(0, -1).every((segment) => isSeparator(segment.slice(-1)))).toBe(true);
      }),
      PROPERTY_RUN,
    );
  });
});
