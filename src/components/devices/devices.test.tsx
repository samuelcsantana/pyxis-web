import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  browserLabel,
  countryLabel,
  deviceConversions,
  deviceTypeLabel,
  regionRows,
  type RegionShare,
  shareRows,
  type ValueShare,
} from '@/domain/devices';
import { CountriesTable } from './countries-table';
import { DeviceConversionList } from './device-conversion-list';
import { RegionsTable } from './regions-table';
import { segmentColor, ShareDonut } from './share-donut';
import { english } from '@/test-utils/english';

const DEVICE_TYPES: readonly ValueShare[] = [
  { value: 'mobile', visits: 620, conversions: 23, convertingVisits: null },
  { value: 'desktop', visits: 340, conversions: 20, convertingVisits: null },
  { value: 'other', visits: 40, conversions: 1, convertingVisits: null },
];

const BROWSERS: readonly ValueShare[] = [
  { value: 'chrome', visits: 600, conversions: 30, convertingVisits: null },
  { value: 'safari', visits: 400, conversions: 9, convertingVisits: null },
];

describe('ShareDonut', () => {
  it('lists every value with its visits and share beside the donut', () => {
    const { container } = render(
      <ShareDonut
        id="device-type"
        title="Device type"
        rows={shareRows(DEVICE_TYPES, deviceTypeLabel, english)}
        i18n={english}
      />,
    );

    const table = screen.getByRole('table', { name: 'Device type' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(rows[1]).toHaveTextContent('Mobile62062.0%');
    expect(rows[3]).toHaveTextContent('Other404.0%');
    expect(container.querySelectorAll('svg circle')).toHaveLength(4);
    expect(within(table).queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();
  });

  it('lets the keyboard reach and scroll the table when its words make it wider than the panel', () => {
    render(
      <ShareDonut
        id="browser"
        title="Besturingssysteem"
        rows={shareRows(BROWSERS, browserLabel, english)}
        i18n={english}
      />,
    );

    const region = screen.getByRole('region', { name: 'Besturingssysteem · Table' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveClass('overflow-x-auto');
    expect(within(region).getByRole('table', { name: 'Besturingssysteem' })).toBeInTheDocument();
  });

  it('links the values it is given a link for, by their visible name', () => {
    render(
      <ShareDonut
        id="device-type"
        title="Device type"
        rows={shareRows(DEVICE_TYPES, deviceTypeLabel, english)}
        visitsHref={(value) => (value === 'other' ? null : `/p1/visits?device=${value}`)}
        i18n={english}
      />,
    );

    const table = screen.getByRole('table', { name: 'Device type' });
    expect(within(table).getByRole('link', { name: 'Desktop: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?device=desktop',
    );
    expect(within(table).getAllByRole('link')).toHaveLength(2);
  });

  it('adds the conversion rate of each value when asked and a conversion event is set', () => {
    render(
      <ShareDonut
        id="browser"
        title="Browser"
        rows={shareRows(BROWSERS, browserLabel, english)}
        withConversionRate
        i18n={english}
      />,
    );

    const table = screen.getByRole('table', { name: 'Browser' });
    expect(within(table).getByRole('columnheader', { name: 'Conversion rate' })).toBeVisible();
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Chrome60060.0%5.0%');
  });

  it('leaves the conversion rate out when the project has no conversion event', () => {
    render(
      <ShareDonut
        id="browser"
        title="Browser"
        rows={shareRows(
          BROWSERS.map((share) => ({ ...share, conversions: null })),
          browserLabel,
          english,
        )}
        withConversionRate
        i18n={english}
      />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();
  });

  it('paints "other" in the neutral color, and values past the palette too', () => {
    const rows = shareRows(
      ['chrome', 'safari', 'firefox', 'edge', 'opera', 'samsung'].map((value) => ({
        value,
        visits: 1,
        conversions: null,
        convertingVisits: null,
      })),
      browserLabel,
      english,
    );

    expect(rows.map((row, index) => segmentColor(row, index).stroke)).toEqual([
      'stroke-sky',
      'stroke-violet',
      'stroke-accent',
      'stroke-teal',
      'stroke-ok',
      'stroke-slate',
    ]);
    expect(
      segmentColor(
        {
          value: 'other',
          label: 'Other',
          visits: '1',
          counted: 1,
          share: '50.0%',
          fraction: 0.5,
          conversionRate: null,
        },
        0,
      ).stroke,
    ).toBe('stroke-slate');
  });
});

describe('DeviceConversionList', () => {
  it('shows the conversion rate of each device with its totals', () => {
    render(
      <DeviceConversionList
        conversions={deviceConversions(DEVICE_TYPES, english)}
        conversionEvent="signup_completed"
        i18n={english}
      />,
    );

    expect(screen.getByText('signup_completed')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveTextContent('Desktop5.9% · 20 of 340 visits');
  });
});

describe('CountriesTable', () => {
  it('names each country beside its code, with visits and share', () => {
    render(
      <CountriesTable
        rows={shareRows(
          [
            { value: 'BR', visits: 90, conversions: null, convertingVisits: null },
            { value: 'other', visits: 10, conversions: null, convertingVisits: null },
          ],
          countryLabel,
          english,
        )}
        i18n={english}
      />,
    );

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('BRBrazil9090.0%');
    expect(rows[2]).toHaveTextContent('··Other countries1010.0%');
    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();
  });

  it('adds the conversion rate of each country when asked and a conversion event is set', () => {
    render(
      <CountriesTable
        rows={shareRows(
          [
            { value: 'BR', visits: 90, conversions: 9, convertingVisits: 6 },
            { value: 'other', visits: 10, conversions: 0, convertingVisits: 0 },
          ],
          countryLabel,
          english,
        )}
        withConversionRate
        i18n={english}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Conversion rate' })).toBeVisible();
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('BRBrazil9090.0%6.7%');
    expect(rows[2]).toHaveTextContent('··Other countries1010.0%0.0%');
  });
});

function region(value: string | null, name: string | null, visits: number): RegionShare {
  return { value, name, visits, conversions: 0, convertingVisits: 0 };
}

const REGIONS: readonly RegionShare[] = [
  region('BR-SP', 'São Paulo', 60),
  region('PT-11', 'Lisboa', 20),
  region('other', null, 15),
  region(null, null, 5),
];

describe('RegionsTable', () => {
  it('names each region beside its code, with its country when the list spans several', () => {
    render(<RegionsTable rows={regionRows(REGIONS, english)} i18n={english} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Regions' })).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('SPSão PauloBrazil6060.0%');
    expect(rows[2]).toHaveTextContent('11LisboaPortugal2020.0%');
    expect(rows[3]).toHaveTextContent('··Other regions1515.0%');
    expect(rows[4]).toHaveTextContent('—Unknown55.0%');
    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('links each region to its visits, never the other or unknown rows', () => {
    render(
      <RegionsTable
        rows={regionRows(REGIONS, english)}
        visitsHref={(code) => (code === 'PT-11' ? null : `/p1/visits?region=${code}`)}
        i18n={english}
      />,
    );

    const table = within(screen.getByRole('table', { name: 'Regions' }));
    expect(table.getByRole('link', { name: 'São Paulo: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?region=BR-SP',
    );
    expect(table.getAllByRole('link')).toHaveLength(1);
  });

  it('adds the conversion rate of each region when asked and a conversion event is set', () => {
    render(
      <RegionsTable
        rows={regionRows(
          [{ value: 'BR-SP', name: 'São Paulo', visits: 50, conversions: 4, convertingVisits: 2 }],
          english,
        )}
        withConversionRate
        i18n={english}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Conversion rate' })).toBeVisible();
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('SPSão Paulo50100.0%4.0%');
  });
});
