import { describe, expect, it } from 'vitest';
import {
  browserLabel,
  countsConversions,
  countryCode,
  countryLabel,
  deviceConversions,
  deviceTypeLabel,
  type DevicesWire,
  hasVisits,
  isRegionCode,
  operatingSystemLabel,
  placeLabel,
  regionRows,
  shareRows,
} from './devices';
import { devicesResponseSchema } from './devices.schema';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';

const WIRE: DevicesWire = {
  device_types: [
    { value: 'mobile', visits: 2950, conversions: 108 },
    { value: 'desktop', visits: 1618, conversions: 96 },
    { value: 'tablet', visits: 190, conversions: 8 },
  ],
  browsers: [{ value: 'samsung', visits: 10, conversions: 1 }],
  operating_systems: [{ value: 'macos', visits: 10, conversions: 1 }],
  countries: [
    { value: 'BR', visits: 30, conversions: 2 },
    { value: 'other', visits: 10, conversions: 0 },
  ],
  regions: [
    { value: 'BR-SP', name: 'São Paulo', visits: 20, conversions: 2, converting_visits: 1 },
    { value: 'other', name: null, visits: 10, conversions: 0, converting_visits: 0 },
  ],
};

describe('devicesResponseSchema', () => {
  it('maps the wire names to the dashboard ones', () => {
    const report = devicesResponseSchema.parse(WIRE);

    expect(report.deviceTypes[0]).toEqual({
      value: 'mobile',
      visits: 2950,
      conversions: 108,
      convertingVisits: null,
    });
    expect(report.operatingSystems[0]?.value).toBe('macos');
    expect(
      devicesResponseSchema.parse({
        ...WIRE,
        browsers: [{ value: 'safari', visits: 10, conversions: 3, converting_visits: 2 }],
      }).browsers[0]?.convertingVisits,
    ).toBe(2);
    expect(report.countries).toHaveLength(2);
    expect(report.regions[0]).toEqual({
      value: 'BR-SP',
      name: 'São Paulo',
      visits: 20,
      conversions: 2,
      convertingVisits: 1,
    });
    expect(report.browsers[0]?.value).toBe('samsung');
  });
});

describe('labels', () => {
  it('name the known devices, browsers and systems, and "other" as Other', () => {
    expect(deviceTypeLabel('mobile', english)).toBe('Mobile');
    expect(browserLabel('samsung', english)).toBe('Samsung Internet');
    expect(operatingSystemLabel('ios', english)).toBe('iOS');
    expect(operatingSystemLabel('other', english)).toBe('Other');
  });

  it('show a value they do not know as it came', () => {
    expect(browserLabel('vivaldi', english)).toBe('vivaldi');
  });

  it('name a country from its code, and the rest as other countries', () => {
    expect(countryLabel('BR', english)).toBe('Brazil');
    expect(countryLabel('other', english)).toBe('Other countries');
    expect(countryCode('BR')).toBe('BR');
    expect(countryCode('other')).toBe('··');
  });

  it('keep a value that is not a country code as it came', () => {
    expect(countryLabel('Brazil', english)).toBe('Brazil');
    expect(countryLabel('XX', english)).toBe('XX');
  });

  it('place a visit by its region and country, or by its country alone', () => {
    expect(placeLabel('BR', 'São Paulo', english)).toBe('São Paulo, Brazil');
    expect(placeLabel('BR', 'São Paulo', portuguese)).toBe('São Paulo, Brasil');
    expect(placeLabel('PT', null, english)).toBe('Portugal');
    expect(placeLabel(null, null, english)).toBeNull();
  });

  it('tell a region code, the country code then the region, from anything else', () => {
    expect(isRegionCode('BR-SP')).toBe(true);
    expect(isRegionCode('MX-CMX')).toBe(true);
    expect(isRegionCode('PT-11')).toBe(true);
    expect(isRegionCode('SP')).toBe(false);
    expect(isRegionCode('br-sp')).toBe(false);
    expect(isRegionCode('BR-ABCD')).toBe(false);
  });
});

describe('regionRows', () => {
  const regions = devicesResponseSchema.parse({
    ...WIRE,
    regions: [
      { value: 'BR-SP', name: 'São Paulo', visits: 60, conversions: 6, converting_visits: 3 },
      { value: 'PT-11', name: null, visits: 20, conversions: 0, converting_visits: 0 },
      { value: 'other', name: null, visits: 15, conversions: 1, converting_visits: 1 },
      { value: null, name: null, visits: 5, conversions: 0, converting_visits: 0 },
    ],
  }).regions;

  it('show the region part of the code, the name, the share and what each row filters by', () => {
    expect(regionRows(regions, english)).toEqual([
      {
        key: 'BR-SP',
        code: 'SP',
        label: 'São Paulo',
        country: 'Brazil',
        filterValue: 'BR-SP',
        visits: '60',
        share: '60.0%',
        fraction: 0.6,
        conversionRate: '5.0%',
      },
      {
        key: 'PT-11',
        code: '11',
        label: 'PT-11',
        country: 'Portugal',
        filterValue: 'PT-11',
        visits: '20',
        share: '20.0%',
        fraction: 0.2,
        conversionRate: '0.0%',
      },
      {
        key: 'other',
        code: '··',
        label: 'Other regions',
        country: null,
        filterValue: null,
        visits: '15',
        share: '15.0%',
        fraction: 0.15,
        conversionRate: '6.7%',
      },
      {
        key: 'unknown',
        code: '—',
        label: 'Unknown',
        country: null,
        filterValue: null,
        visits: '5',
        share: '5.0%',
        fraction: 0.05,
        conversionRate: '0.0%',
      },
    ]);
  });

  it('show dashes, not NaN, when nobody visited', () => {
    const [row] = regionRows(
      [{ value: 'BR-SP', name: 'São Paulo', visits: 0, conversions: null, convertingVisits: null }],
      english,
    );

    expect(row).toMatchObject({ share: '—', fraction: 0 });
  });

  it('leave the country out when every region is in the same one', () => {
    const rows = regionRows(
      [
        { value: 'BR-SP', name: 'São Paulo', visits: 3, conversions: null, convertingVisits: null },
        {
          value: 'BR-RJ',
          name: 'Rio de Janeiro',
          visits: 1,
          conversions: null,
          convertingVisits: null,
        },
      ],
      english,
    );

    expect(rows.map((row) => row.country)).toEqual([null, null]);
    expect(rows.map((row) => row.conversionRate)).toEqual([null, null]);
    expect(countsConversions(rows)).toBe(false);
  });
});

describe('hasVisits', () => {
  it('is true when a device type had a visit', () => {
    expect(hasVisits(devicesResponseSchema.parse(WIRE))).toBe(true);
  });

  it('is false for a period without visits', () => {
    expect(hasVisits(devicesResponseSchema.parse({ ...WIRE, device_types: [] }))).toBe(false);
  });
});

describe('shareRows', () => {
  it('give every value its visits and share of the total', () => {
    const rows = shareRows(devicesResponseSchema.parse(WIRE).countries, countryLabel, english);

    expect(rows).toEqual([
      {
        value: 'BR',
        label: 'Brazil',
        visits: '30',
        share: '75.0%',
        fraction: 0.75,
        conversionRate: '6.7%',
      },
      {
        value: 'other',
        label: 'Other countries',
        visits: '10',
        share: '25.0%',
        fraction: 0.25,
        conversionRate: '0.0%',
      },
    ]);
    expect(countsConversions(rows)).toBe(true);
  });

  it('rate the visits that converted when the API counts them', () => {
    const [row] = shareRows(
      [{ value: 'chrome', visits: 100, conversions: 9, convertingVisits: 6 }],
      browserLabel,
      english,
    );

    expect(row?.conversionRate).toBe('6.0%');
  });

  it('have no conversion rate when the project has no conversion event', () => {
    const rows = shareRows(
      [{ value: 'chrome', visits: 100, conversions: null, convertingVisits: null }],
      browserLabel,
      english,
    );

    expect(rows[0]?.conversionRate).toBeNull();
    expect(countsConversions(rows)).toBe(false);
  });

  it('show dashes, not NaN, when nobody visited', () => {
    const [row] = shareRows(
      [{ value: 'mobile', visits: 0, conversions: null, convertingVisits: null }],
      deviceTypeLabel,
      english,
    );

    expect(row?.share).toBe('—');
    expect(row?.fraction).toBe(0);
  });
});

describe('deviceConversions', () => {
  it('gives the conversion rate of each device type with its totals', () => {
    const [mobile, desktop] = deviceConversions(
      devicesResponseSchema.parse(WIRE).deviceTypes,
      english,
    );

    expect(desktop).toEqual({
      label: 'Desktop',
      rate: '5.9%',
      detail: '96 of 1,618 visits',
      barWidth: '100.0%',
    });
    expect(mobile?.rate).toBe('3.7%');
    expect(mobile?.barWidth).toBe('61.7%');
  });

  it('rates the visits that converted when the API counts them', () => {
    const [mobile] = deviceConversions(
      [{ value: 'mobile', visits: 100, conversions: 9, convertingVisits: 6 }],
      english,
    );

    expect(mobile).toMatchObject({ rate: '6.0%', detail: '6 of 100 visits' });
  });

  it('is empty when the project has no conversion event', () => {
    expect(
      deviceConversions(
        [{ value: 'mobile', visits: 10, conversions: null, convertingVisits: null }],
        english,
      ),
    ).toEqual([]);
  });

  it('shows a dash for a device type without visits', () => {
    const [none] = deviceConversions(
      [{ value: 'tablet', visits: 0, conversions: 0, convertingVisits: null }],
      english,
    );

    expect(none?.rate).toBe('—');
    expect(none?.barWidth).toBe('0.0%');
  });
});
