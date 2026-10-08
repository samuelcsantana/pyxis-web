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
  operatingSystemLabel,
  shareRows,
  shareSummary,
} from './devices';
import { devicesResponseSchema } from './devices.schema';

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
    expect(report.browsers[0]?.value).toBe('samsung');
  });
});

describe('labels', () => {
  it('name the known devices, browsers and systems, and "other" as Other', () => {
    expect(deviceTypeLabel('mobile')).toBe('Mobile');
    expect(browserLabel('samsung')).toBe('Samsung Internet');
    expect(operatingSystemLabel('ios')).toBe('iOS');
    expect(operatingSystemLabel('other')).toBe('Other');
  });

  it('show a value they do not know as it came', () => {
    expect(browserLabel('vivaldi')).toBe('vivaldi');
  });

  it('name a country from its code, and the rest as other countries', () => {
    expect(countryLabel('BR')).toBe('Brazil');
    expect(countryLabel('other')).toBe('Other countries');
    expect(countryCode('BR')).toBe('BR');
    expect(countryCode('other')).toBe('··');
  });

  it('keep a value that is not a region code as it came', () => {
    expect(countryLabel('Brazil')).toBe('Brazil');
    expect(countryLabel('XX')).toBe('XX');
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

describe('shareRows and shareSummary', () => {
  it('give every value its visits and share of the total', () => {
    const rows = shareRows(devicesResponseSchema.parse(WIRE).countries, countryLabel);

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
    expect(shareSummary('Country', rows)).toBe('Country: Brazil 75.0%, Other countries 25.0%.');
    expect(countsConversions(rows)).toBe(true);
  });

  it('rate the visits that converted when the API counts them', () => {
    const [row] = shareRows(
      [{ value: 'chrome', visits: 100, conversions: 9, convertingVisits: 6 }],
      browserLabel,
    );

    expect(row?.conversionRate).toBe('6.0%');
  });

  it('have no conversion rate when the project has no conversion event', () => {
    const rows = shareRows(
      [{ value: 'chrome', visits: 100, conversions: null, convertingVisits: null }],
      browserLabel,
    );

    expect(rows[0]?.conversionRate).toBeNull();
    expect(countsConversions(rows)).toBe(false);
  });

  it('show dashes, not NaN, when nobody visited', () => {
    const [row] = shareRows(
      [{ value: 'mobile', visits: 0, conversions: null, convertingVisits: null }],
      deviceTypeLabel,
    );

    expect(row?.share).toBe('—');
    expect(row?.fraction).toBe(0);
  });
});

describe('deviceConversions', () => {
  it('gives the conversion rate of each device type with its totals', () => {
    const [mobile, desktop] = deviceConversions(devicesResponseSchema.parse(WIRE).deviceTypes);

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
    const [mobile] = deviceConversions([
      { value: 'mobile', visits: 100, conversions: 9, convertingVisits: 6 },
    ]);

    expect(mobile).toMatchObject({ rate: '6.0%', detail: '6 of 100 visits' });
  });

  it('is empty when the project has no conversion event', () => {
    expect(
      deviceConversions([
        { value: 'mobile', visits: 10, conversions: null, convertingVisits: null },
      ]),
    ).toEqual([]);
  });

  it('shows a dash for a device type without visits', () => {
    const [none] = deviceConversions([
      { value: 'tablet', visits: 0, conversions: 0, convertingVisits: null },
    ]);

    expect(none?.rate).toBe('—');
    expect(none?.barWidth).toBe('0.0%');
  });
});
