import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import {
  DASHBOARD_FILTER_PARAMETERS,
  dashboardFilterParameters,
  dashboardFilterQuery,
  dashboardFiltersOf,
  type DashboardFilters,
  hasDashboardFilters,
  NO_DASHBOARD_FILTERS,
  withDashboardFilters,
} from './dashboard-filters';

const EVERY_FILTER: DashboardFilters = {
  paths: ['/pricing', '/blog/*'],
  event: 'signup_completed',
  property: 'plan=pro',
  channel: 'paid',
  device: 'desktop',
  browser: 'firefox',
  os: 'linux',
  identity: 'anonymous',
  country: 'PT',
  region: 'PT-11',
  source: 'newsletter',
  campaign: 'launch',
  failed: true,
};

describe('dashboardFiltersOf', () => {
  it('reads every filter the dashboard keeps, and no request route', () => {
    expect(
      dashboardFiltersOf(
        {
          path: '/pricing',
          path2: ' /blog/* ',
          event: 'signup_completed',
          property: 'plan=pro',
          channel: 'paid',
          device: 'desktop',
          browser: 'firefox',
          os: 'linux',
          identity: 'anonymous',
          country: 'pt',
          region: 'pt-11',
          source: 'newsletter',
          campaign: 'launch',
          failed: 'true',
        },
        english,
      ),
    ).toEqual({ filters: EVERY_FILTER, problems: [] });
  });

  it('leaves out a browser or a system it does not know, without a problem to show', () => {
    expect(dashboardFiltersOf({ browser: 'netscape', os: 'beos' }, english)).toEqual({
      filters: NO_DASHBOARD_FILTERS,
      problems: [],
    });
  });

  it('takes a browser and a system given once, ignoring a repeated name', () => {
    expect(
      dashboardFiltersOf({ browser: ['chrome', 'safari'], os: 'other' }, english).filters,
    ).toEqual({ ...NO_DASHBOARD_FILTERS, os: 'other' });
  });

  it('names each malformed filter once and leaves it out', () => {
    const reading = dashboardFiltersOf(
      {
        path: 'pricing',
        path2: 'blog',
        property: 'plan=pro',
        country: 'Brazil',
        region: 'SP',
        source: 'x'.repeat(129),
        campaign: 'y'.repeat(65),
      },
      english,
    );

    expect(reading.filters).toEqual(NO_DASHBOARD_FILTERS);
    expect(reading.problems).toHaveLength(6);
  });
});

describe('dashboardFilterParameters', () => {
  it('writes every filter back in the order of the list, pages one per field', () => {
    const written = dashboardFilterParameters(EVERY_FILTER);

    expect(written).toEqual({
      path: '/pricing',
      path2: '/blog/*',
      event: 'signup_completed',
      property: 'plan=pro',
      channel: 'paid',
      device: 'desktop',
      browser: 'firefox',
      os: 'linux',
      identity: 'anonymous',
      country: 'PT',
      region: 'PT-11',
      source: 'newsletter',
      campaign: 'launch',
      failed: 'true',
    });
    expect(Object.keys(written)).toEqual(
      DASHBOARD_FILTER_PARAMETERS.filter((name) => name !== 'path3'),
    );
  });

  it('writes nothing without filters', () => {
    expect(dashboardFilterParameters(NO_DASHBOARD_FILTERS)).toEqual({});
  });
});

describe('hasDashboardFilters', () => {
  it('is true for any one filter, the failed flag included, and false for none', () => {
    expect(hasDashboardFilters(NO_DASHBOARD_FILTERS)).toBe(false);
    expect(hasDashboardFilters({ ...NO_DASHBOARD_FILTERS, failed: true })).toBe(true);
    expect(hasDashboardFilters({ ...NO_DASHBOARD_FILTERS, os: 'ios' })).toBe(true);
  });
});

describe('dashboardFilterQuery', () => {
  it('sends the pages as a repeated path, as the API reads them, and the rest once each', () => {
    const query = dashboardFilterQuery(EVERY_FILTER);

    expect(query.getAll('path')).toEqual(['/pricing', '/blog/*']);
    expect(query.has('path2')).toBe(false);
    expect(Object.fromEntries([...query].filter(([name]) => name !== 'path'))).toEqual({
      event: 'signup_completed',
      property: 'plan=pro',
      channel: 'paid',
      device: 'desktop',
      browser: 'firefox',
      os: 'linux',
      identity: 'anonymous',
      country: 'PT',
      region: 'PT-11',
      source: 'newsletter',
      campaign: 'launch',
      failed: 'true',
    });
  });

  it('is empty without filters', () => {
    expect(dashboardFilterQuery(NO_DASHBOARD_FILTERS).toString()).toBe('');
  });
});

describe('withDashboardFilters', () => {
  it('replaces the filters of a query and keeps everything else', () => {
    expect(
      withDashboardFilters('range=7d&metric=visits&device=mobile&path2=%2Fa', {
        ...NO_DASHBOARD_FILTERS,
        os: 'ios',
      }),
    ).toBe('range=7d&metric=visits&os=ios');
  });
});
