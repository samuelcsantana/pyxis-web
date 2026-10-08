import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  browserLabel,
  countryLabel,
  deviceConversions,
  deviceTypeLabel,
  shareRows,
  type ValueShare,
} from '@/domain/devices';
import { CountriesTable } from './countries-table';
import { DeviceConversionList } from './device-conversion-list';
import { segmentColor, ShareDonut } from './share-donut';

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
        rows={shareRows(DEVICE_TYPES, deviceTypeLabel)}
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

  it('links the values it is given a link for, by their visible name', () => {
    render(
      <ShareDonut
        id="device-type"
        title="Device type"
        rows={shareRows(DEVICE_TYPES, deviceTypeLabel)}
        visitsHref={(value) => (value === 'other' ? null : `/p1/visits?device=${value}`)}
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
        rows={shareRows(BROWSERS, browserLabel)}
        withConversionRate
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
        )}
        withConversionRate
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
        conversions={deviceConversions(DEVICE_TYPES)}
        conversionEvent="signup_completed"
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
        )}
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
        )}
        withConversionRate
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Conversion rate' })).toBeVisible();
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('BRBrazil9090.0%6.7%');
    expect(rows[2]).toHaveTextContent('··Other countries1010.0%0.0%');
  });
});
