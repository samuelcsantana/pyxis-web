import { describe, expect, it } from 'vitest';
import { hasDashboardFilterIn } from './dashboard-filter-parameters';

describe('hasDashboardFilterIn', () => {
  it('finds a dashboard filter with a value, and ignores the period, other names and blanks', () => {
    expect(hasDashboardFilterIn(new URLSearchParams('range=7d&os=ios'))).toBe(true);
    expect(hasDashboardFilterIn(new URLSearchParams('range=7d&metric=visits&route=GET+%2F'))).toBe(
      false,
    );
    expect(hasDashboardFilterIn(new URLSearchParams('device=%20&path='))).toBe(false);
  });
});
