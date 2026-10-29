import { describe, expect, it } from 'vitest';
import type { DevicesReport, RegionShare, ValueShare } from './devices';
import { devicesCsvTable } from './devices-export';

function share(value: string, visits: number, conversions: number | null): ValueShare {
  return {
    value,
    visits,
    conversions,
    convertingVisits: conversions === null ? null : conversions - 1,
  };
}

function region(
  value: string | null,
  name: string | null,
  visits: number,
  conversions: number | null,
): RegionShare {
  return { ...share('', visits, conversions), value, name };
}

const NO_REACH: DevicesReport['reach'] = {
  visits: 0,
  continents: 0,
  countries: 0,
  regions: 0,
  cities: 0,
  topCountry: null,
  topRegion: null,
};

const REPORT: DevicesReport = {
  deviceTypes: [share('mobile', 30, 4)],
  browsers: [share('chrome', 25, 3)],
  operatingSystems: [share('android', 20, 2)],
  countries: [share('BR', 28, 4), share('other', 2, 1)],
  regions: [
    region('BR-SP', 'São Paulo', 20, 3),
    region('other', null, 8, 1),
    region(null, null, 2, 1),
  ],
  cities: [],
  reach: NO_REACH,
};

describe('devicesCsvTable', () => {
  it('writes every breakdown in one table, named in a dimension column, regions with their name', () => {
    expect(devicesCsvTable(REPORT)).toEqual({
      columns: ['dimension', 'value', 'name', 'visits', 'conversion_events', 'converting_visits'],
      rows: [
        ['device_type', 'mobile', null, 30, 4, 3],
        ['browser', 'chrome', null, 25, 3, 2],
        ['operating_system', 'android', null, 20, 2, 1],
        ['country', 'BR', null, 28, 4, 3],
        ['country', 'other', null, 2, 1, 0],
        ['region', 'BR-SP', 'São Paulo', 20, 3, 2],
        ['region', 'other', null, 8, 1, 0],
        ['region', null, null, 2, 1, 0],
      ],
    });
  });

  it('leaves the conversion and name columns out when nothing fills them', () => {
    const table = devicesCsvTable({
      deviceTypes: [share('desktop', 10, null)],
      browsers: [],
      operatingSystems: [],
      countries: [],
      regions: [region(null, null, 10, null)],
      cities: [],
      reach: NO_REACH,
    });

    expect(table).toEqual({
      columns: ['dimension', 'value', 'visits'],
      rows: [
        ['device_type', 'desktop', 10],
        ['region', null, 10],
      ],
    });
  });
});
