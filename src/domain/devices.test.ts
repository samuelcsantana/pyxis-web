import { describe, expect, it } from 'vitest';
import {
  browserLabel,
  cityRows,
  countsConversions,
  countryCode,
  countryLabel,
  deviceConversions,
  deviceTypeLabel,
  type DevicesWire,
  hasNamedCity,
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
  cities: [
    {
      value: 'Campinas',
      region: 'BR-SP',
      region_name: 'São Paulo',
      visits: 12,
      conversions: 1,
      converting_visits: 1,
    },
    {
      value: null,
      region: null,
      region_name: null,
      visits: 18,
      conversions: 1,
      converting_visits: 0,
    },
  ],
  reach: {
    visits: 30,
    continents: 1,
    countries: 1,
    regions: 1,
    cities: 1,
    top_country: { value: 'BR', visits: 30 },
    top_region: { value: 'BR-SP', name: 'São Paulo', visits: 20 },
  },
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
    expect(report.cities[0]).toEqual({
      value: 'Campinas',
      region: 'BR-SP',
      regionName: 'São Paulo',
      visits: 12,
      conversions: 1,
      convertingVisits: 1,
    });
    expect(report.reach).toEqual({
      visits: 30,
      continents: 1,
      countries: 1,
      regions: 1,
      cities: 1,
      topCountry: { value: 'BR', visits: 30 },
      topRegion: { value: 'BR-SP', name: 'São Paulo', visits: 20 },
    });
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

  it('place a visit by its city, region and country, or by as much of them as is known', () => {
    const feira = { country: 'BR', regionName: 'Bahia', city: 'Feira de Santana' };
    expect(placeLabel(feira, english)).toBe('Feira de Santana, Bahia, Brazil');
    expect(placeLabel(feira, portuguese)).toBe('Feira de Santana, Bahia, Brasil');
    expect(placeLabel({ ...feira, city: null }, english)).toBe('Bahia, Brazil');
    expect(placeLabel({ ...feira, regionName: null }, english)).toBe('Feira de Santana, Brazil');
    expect(placeLabel({ country: 'PT', regionName: null, city: null }, english)).toBe('Portugal');
    expect(placeLabel({ country: null, regionName: null, city: null }, english)).toBeNull();
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
        counted: 60,
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
        counted: 20,
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
        counted: 15,
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
        counted: 5,
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

describe('cityRows', () => {
  const cities = devicesResponseSchema.parse({
    ...WIRE,
    cities: [
      {
        value: 'Feira de Santana',
        region: 'BR-BA',
        region_name: 'Bahia',
        visits: 50,
        conversions: 6,
        converting_visits: 4,
      },
      {
        value: 'Sintra',
        region: 'PT-11',
        region_name: null,
        visits: 20,
        conversions: 0,
        converting_visits: 0,
      },
      {
        value: 'other',
        region: null,
        region_name: null,
        visits: 20,
        conversions: 1,
        converting_visits: 1,
      },
      {
        value: null,
        region: null,
        region_name: null,
        visits: 10,
        conversions: 0,
        converting_visits: 0,
      },
    ],
  }).cities;

  it('name each city with its region and country, its share and what its row filters by', () => {
    expect(cityRows(cities, english)).toEqual([
      {
        key: 'BR-BA|Feira de Santana',
        label: 'Feira de Santana',
        place: 'Bahia, Brazil',
        filterValue: { region: 'BR-BA', city: 'Feira de Santana' },
        visits: '50',
        counted: 50,
        share: '50.0%',
        fraction: 0.5,
        conversionRate: '8.0%',
      },
      {
        key: 'PT-11|Sintra',
        label: 'Sintra',
        place: 'PT-11, Portugal',
        filterValue: { region: 'PT-11', city: 'Sintra' },
        visits: '20',
        counted: 20,
        share: '20.0%',
        fraction: 0.2,
        conversionRate: '0.0%',
      },
      {
        key: 'other',
        label: 'Other cities',
        place: null,
        filterValue: null,
        visits: '20',
        counted: 20,
        share: '20.0%',
        fraction: 0.2,
        conversionRate: '5.0%',
      },
      {
        key: 'unknown',
        label: 'Unknown',
        place: null,
        filterValue: null,
        visits: '10',
        counted: 10,
        share: '10.0%',
        fraction: 0.1,
        conversionRate: '0.0%',
      },
    ]);
  });

  it('name the other cities and the unknown ones in the language of the dashboard', () => {
    expect(cityRows(cities, portuguese).map((row) => row.label)).toEqual([
      'Feira de Santana',
      'Sintra',
      'Outras cidades',
      'Não identificada',
    ]);
  });

  it('leave the country out when every city is in the same one, and give no rate without one', () => {
    const rows = cityRows(
      [
        {
          value: 'Salvador',
          region: 'BR-BA',
          regionName: 'Bahia',
          visits: 3,
          conversions: null,
          convertingVisits: null,
        },
        {
          value: 'Niterói',
          region: 'BR-RJ',
          regionName: 'Rio de Janeiro',
          visits: 1,
          conversions: null,
          convertingVisits: null,
        },
      ],
      english,
    );

    expect(rows.map((row) => row.place)).toEqual(['Bahia', 'Rio de Janeiro']);
    expect(rows.map((row) => row.conversionRate)).toEqual([null, null]);
    expect(countsConversions(rows)).toBe(false);
  });

  it('keep a region the dashboard cannot read as a code without naming its country', () => {
    const rows = cityRows(
      [
        {
          value: 'Atlantis',
          region: 'atlantic',
          regionName: null,
          visits: 1,
          conversions: null,
          convertingVisits: null,
        },
        {
          value: 'Feira de Santana',
          region: 'BR-BA',
          regionName: 'Bahia',
          visits: 1,
          conversions: null,
          convertingVisits: null,
        },
        {
          value: 'Sintra',
          region: 'PT-11',
          regionName: 'Lisboa',
          visits: 1,
          conversions: null,
          convertingVisits: null,
        },
      ],
      english,
    );

    expect(rows.map((row) => row.place)).toEqual(['atlantic', 'Bahia, Brazil', 'Lisboa, Portugal']);
  });

  it('show dashes, not NaN, when nobody visited', () => {
    const [row] = cityRows(
      [
        {
          value: null,
          region: null,
          regionName: null,
          visits: 0,
          conversions: null,
          convertingVisits: null,
        },
      ],
      english,
    );

    expect(row).toMatchObject({ share: '—', fraction: 0 });
  });
});

describe('hasNamedCity', () => {
  it('is true when a city has a name and a region', () => {
    expect(hasNamedCity(devicesResponseSchema.parse(WIRE).cities)).toBe(true);
  });

  it('is false when the cities are only the other and the unknown ones, or none', () => {
    const unnamed = devicesResponseSchema
      .parse(WIRE)
      .cities.map((share) => ({ ...share, value: share.value === null ? null : 'other' }))
      .map((share) => ({ ...share, region: null }));

    expect(hasNamedCity(unnamed)).toBe(false);
    expect(hasNamedCity([])).toBe(false);
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
        counted: 30,
        share: '75.0%',
        fraction: 0.75,
        conversionRate: '6.7%',
      },
      {
        value: 'other',
        label: 'Other countries',
        visits: '10',
        counted: 10,
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
