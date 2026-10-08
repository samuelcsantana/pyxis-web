import { describe, expect, it } from 'vitest';
import type { DevicesReport, ValueShare } from './devices';
import { devicesCsvTable } from './devices-export';

function share(value: string, visits: number, conversions: number | null): ValueShare {
  return {
    value,
    visits,
    conversions,
    convertingVisits: conversions === null ? null : conversions - 1,
  };
}

const REPORT: DevicesReport = {
  deviceTypes: [share('mobile', 30, 4)],
  browsers: [share('chrome', 25, 3)],
  operatingSystems: [share('android', 20, 2)],
  countries: [share('BR', 28, 4), share('other', 2, 1)],
};

describe('devicesCsvTable', () => {
  it('writes every breakdown in one table, named in a dimension column', () => {
    expect(devicesCsvTable(REPORT)).toEqual({
      columns: ['dimension', 'value', 'visits', 'conversion_events', 'converting_visits'],
      rows: [
        ['device_type', 'mobile', 30, 4, 3],
        ['browser', 'chrome', 25, 3, 2],
        ['operating_system', 'android', 20, 2, 1],
        ['country', 'BR', 28, 4, 3],
        ['country', 'other', 2, 1, 0],
      ],
    });
  });

  it('leaves the conversion columns out for a project without a conversion event', () => {
    const table = devicesCsvTable({
      deviceTypes: [share('desktop', 10, null)],
      browsers: [],
      operatingSystems: [],
      countries: [],
    });

    expect(table).toEqual({
      columns: ['dimension', 'value', 'visits'],
      rows: [['device_type', 'desktop', 10]],
    });
  });
});
