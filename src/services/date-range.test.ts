import { describe, expect, it } from 'vitest';
import { rangeQuery } from './date-range';

describe('rangeQuery', () => {
  it('writes the dates as query parameters', () => {
    expect(rangeQuery({ from: '2026-09-01', to: '2026-09-30' })).toBe(
      'from=2026-09-01&to=2026-09-30',
    );
  });
});
