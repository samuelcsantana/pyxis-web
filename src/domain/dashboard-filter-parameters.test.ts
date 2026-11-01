import { describe, expect, it } from 'vitest';
import { hasDashboardFilterIn, withAddedFilter } from './dashboard-filter-parameters';

describe('hasDashboardFilterIn', () => {
  it('finds a dashboard filter with a value, and ignores the period, other names and blanks', () => {
    expect(hasDashboardFilterIn(new URLSearchParams('range=7d&os=ios'))).toBe(true);
    expect(hasDashboardFilterIn(new URLSearchParams('range=7d&metric=visits&route=GET+%2F'))).toBe(
      false,
    );
    expect(hasDashboardFilterIn(new URLSearchParams('device=%20&path='))).toBe(false);
  });
});

describe('withAddedFilter', () => {
  it('sets the field, keeping the period, the other filters and what the screen holds', () => {
    expect(withAddedFilter('range=7d&os=ios&kind=reads', 'country', 'BR')).toBe(
      'range=7d&os=ios&kind=reads&country=BR',
    );
    expect(withAddedFilter('range=7d&country=PT', 'country', 'BR')).toBe('range=7d&country=BR');
  });

  it('drops the property of the event it replaces', () => {
    expect(withAddedFilter('event=signup&property=plan%3Dpro', 'event', 'checkout')).toBe(
      'event=checkout',
    );
  });

  it('fills the pages in order, replaces the last of three, and keeps a page already there', () => {
    expect(withAddedFilter('range=7d', 'path', '/pricing')).toBe('range=7d&path=%2Fpricing');
    expect(withAddedFilter('path=%2Fa&path2=%20', 'path', '/b')).toBe('path=%2Fa&path2=%2Fb');
    expect(withAddedFilter('path=%2Fa&path2=%2Fb&path3=%2Fc', 'path', '/d')).toBe(
      'path=%2Fa&path2=%2Fb&path3=%2Fd',
    );
    expect(withAddedFilter('path=%2Fa&path2=%2Fb', 'path', '/a')).toBe('path=%2Fa&path2=%2Fb');
  });
});
