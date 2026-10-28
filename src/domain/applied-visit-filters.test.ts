import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import {
  appliedVisitFilters,
  changedVisitFilterFields,
  filteredPeriodLabel,
} from './applied-visit-filters';
import { NO_DASHBOARD_FILTERS } from './dashboard-filters';
import { NO_VISIT_FILTERS, type VisitFilters, visitFilterParameters } from './visits';

const EVERY_FILTER: VisitFilters = {
  paths: ['/pricing', '/blog/*'],
  event: 'signup_completed',
  property: 'plan=pro',
  channel: 'paid',
  device: 'mobile',
  browser: 'samsung',
  os: 'android',
  identity: 'identified',
  country: 'BR',
  region: 'BR-SP',
  source: 'google',
  campaign: 'spring_sale',
  route: 'POST /orders',
  failed: true,
};

describe('appliedVisitFilters', () => {
  it('lists nothing when no filter is applied', () => {
    expect(appliedVisitFilters(NO_VISIT_FILTERS, english)).toEqual([]);
  });

  it('names every applied filter with its value, in the order of the form', () => {
    const applied = appliedVisitFilters(EVERY_FILTER, english);

    expect(applied.map(({ key, label, value, code }) => ({ key, label, value, code }))).toEqual([
      { key: 'path', label: 'Viewed page', value: '/pricing', code: true },
      { key: 'path2', label: 'And page', value: '/blog/*', code: true },
      { key: 'event', label: 'Had event', value: 'signup_completed', code: true },
      { key: 'property', label: 'With property', value: 'plan=pro', code: true },
      { key: 'channel', label: 'Channel', value: 'Paid', code: false },
      { key: 'device', label: 'Device', value: 'Mobile', code: false },
      { key: 'browser', label: 'Browser', value: 'Samsung Internet', code: false },
      { key: 'os', label: 'System', value: 'Android', code: false },
      { key: 'identity', label: 'Account', value: 'Identified', code: false },
      { key: 'country', label: 'Country', value: 'Brazil', code: false },
      { key: 'region', label: 'Region', value: 'BR-SP', code: true },
      { key: 'source', label: 'Source', value: 'google', code: true },
      { key: 'campaign', label: 'Campaign', value: 'spring_sale', code: true },
      { key: 'route', label: 'Made request', value: 'POST /orders', code: true },
      { key: 'failed', label: 'With a failed request', value: null, code: false },
    ]);
  });

  it('removes one filter at a time, the event taking its property with it', () => {
    const without = Object.fromEntries(
      appliedVisitFilters(EVERY_FILTER, english).map((filter) => [
        filter.key,
        visitFilterParameters(filter.without),
      ]),
    );

    expect(without.path).toMatchObject({ path: '/blog/*' });
    expect(without.path).not.toHaveProperty('path2');
    expect(without.event).not.toHaveProperty('event');
    expect(without.event).not.toHaveProperty('property');
    expect(without.property).toMatchObject({ event: 'signup_completed' });
    expect(without.property).not.toHaveProperty('property');
    for (const key of [
      'channel',
      'device',
      'browser',
      'os',
      'identity',
      'country',
      'region',
      'source',
      'campaign',
      'route',
    ]) {
      expect(without[key]).not.toHaveProperty(key);
      expect(Object.keys(without[key] ?? {})).toHaveLength(
        Object.keys(visitFilterParameters(EVERY_FILTER)).length - 1,
      );
    }
    expect(without.failed).not.toHaveProperty('failed');
  });
});

describe('changedVisitFilterFields', () => {
  const applied = visitFilterParameters({
    ...NO_VISIT_FILTERS,
    channel: 'paid',
    country: 'BR',
    region: 'BR-SP',
  });

  it('finds no change when the form holds what is applied, spaces and case aside', () => {
    expect(
      changedVisitFilterFields(applied, { channel: 'paid', country: ' br ', region: 'br-sp' }),
    ).toEqual([]);
  });

  it('names each field whose value differs from the applied one', () => {
    expect(
      changedVisitFilterFields(applied, {
        channel: 'email',
        country: 'BR',
        region: 'BR-RJ',
        event: 'cta_clicked',
      }),
    ).toEqual(['event', 'channel', 'region']);
  });

  it('counts a field left empty against an applied value as changed', () => {
    expect(changedVisitFilterFields(applied, {})).toEqual(['channel', 'country', 'region']);
  });
});

describe('filteredPeriodLabel', () => {
  it('keeps the period alone without filters', () => {
    expect(filteredPeriodLabel('Sep 30 to Oct 6', NO_DASHBOARD_FILTERS, english)).toBe(
      'Sep 30 to Oct 6',
    );
  });

  it('names every filter after the period, a flag by its label alone', () => {
    expect(
      filteredPeriodLabel(
        'Sep 30 to Oct 6',
        { ...NO_DASHBOARD_FILTERS, device: 'mobile', os: 'ios', failed: true },
        english,
      ),
    ).toBe('Sep 30 to Oct 6, filtered to Device: Mobile, System: iOS, With a failed request');
  });
});
