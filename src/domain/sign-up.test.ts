import { describe, expect, it } from 'vitest';
import { requestedIntervalOf } from './sign-up';

describe('the billing interval a link asks for', () => {
  it('is yearly only when the link says so, monthly otherwise', () => {
    expect(requestedIntervalOf('year')).toBe('year');
    expect(requestedIntervalOf('month')).toBe('month');
    expect(requestedIntervalOf(undefined)).toBe('month');
    expect(requestedIntervalOf('weekly')).toBe('month');
    expect(requestedIntervalOf(['year', 'month'])).toBe('month');
  });
});
