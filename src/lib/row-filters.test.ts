import { describe, expect, it } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { english } from '@/test-utils/english';
import { rowFiltersOf, screenRowFilters } from './row-filters';

describe('rowFiltersOf', () => {
  it('links to the screen with one more filter, named for a screen reader and on hover', () => {
    const filterOf = rowFiltersOf('/p1/devices', 'range=7d', NO_DASHBOARD_FILTERS, english);

    expect(filterOf({ browser: 'safari' }, 'Safari')).toEqual({
      href: '/p1/devices?range=7d&browser=safari',
      active: false,
      label: 'Filter by Safari',
      title: 'Filter every screen by Safari',
    });
  });

  it('links to the screen without the filter when it is on, the address bare when nothing is left', () => {
    const filterOf = rowFiltersOf(
      '/p1/devices',
      '',
      { ...NO_DASHBOARD_FILTERS, browser: 'safari' },
      english,
    );

    expect(filterOf({ browser: 'safari' }, 'Safari')).toEqual({
      href: '/p1/devices',
      active: true,
      label: 'Remove filter Safari',
      title: 'Remove filter Safari',
    });
  });
});

describe('screenRowFilters', () => {
  it('keeps the period and the screen parameters of the page address, whatever their shape', () => {
    const filterOf = screenRowFilters(
      'p1',
      'features',
      { range: '7d', kind: 'events', steps: ['a', 'b'], q: undefined, count: 3 },
      NO_DASHBOARD_FILTERS,
      english,
    );

    expect(filterOf({ event: 'cta_clicked' }, 'Cta clicked').href).toBe(
      '/p1/features?range=7d&kind=events&event=cta_clicked',
    );
  });
});
