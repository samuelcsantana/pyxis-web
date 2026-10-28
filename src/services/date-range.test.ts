import { describe, expect, it } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { rangeQuery, reportQuery } from './date-range';

describe('rangeQuery', () => {
  it('writes the dates as query parameters', () => {
    expect(rangeQuery({ from: '2026-09-01', to: '2026-09-30' })).toBe(
      'from=2026-09-01&to=2026-09-30',
    );
  });
});

describe('reportQuery', () => {
  it('writes only the dates when no filter is on, as an unfiltered report asks', () => {
    expect(
      reportQuery({ from: '2026-09-01', to: '2026-09-30', filters: NO_DASHBOARD_FILTERS }),
    ).toBe('from=2026-09-01&to=2026-09-30');
  });

  it('adds the filters after the dates, the pages as a repeated path', () => {
    expect(
      reportQuery({
        from: '2026-09-01',
        to: '2026-09-30',
        filters: { ...NO_DASHBOARD_FILTERS, paths: ['/a', '/b/*'], device: 'mobile', failed: true },
      }),
    ).toBe('from=2026-09-01&to=2026-09-30&path=%2Fa&path=%2Fb%2F*&device=mobile&failed=true');
  });
});
