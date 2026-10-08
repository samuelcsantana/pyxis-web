import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { featureRows } from '@/domain/features';
import { type PropertyKeyView, propertyKeyViews } from '@/domain/property-breakdown';
import { propertyBreakdownResponseSchema } from '@/domain/property-breakdown.schema';
import { ExpandableFeatureRow } from './expandable-feature-row';
import { FeatureTable } from './feature-table';
import { PropertyBreakdown } from './property-breakdown';
import { english } from '@/test-utils/english';

const KEYS = propertyKeyViews(
  propertyBreakdownResponseSchema.parse({
    name: 'calculator_result_shown',
    events: 10,
    keys: [
      {
        key: 'calculator',
        events: 10,
        values: [
          { value: 'shipping', count: 6, visits: 5 },
          { value: 'margin', count: 3, visits: 3 },
        ],
        other_count: 1,
      },
    ],
  }),
  english,
);

const [ROW] = featureRows(
  [{ name: 'calculator_result_shown', count: 10, visits: 8, daily: [4, 6] }],
  'events',
  '',
  english,
);

function renderRow(loadProperties: (name: string) => Promise<readonly PropertyKeyView[]>) {
  if (ROW === undefined) {
    throw new Error('The fixture has a row.');
  }
  return render(
    <table>
      <tbody>
        <ExpandableFeatureRow
          row={ROW}
          visitsHref={EVENT_VISITS}
          visitsPurpose={english.t('visitsLink.purpose')}
          loadProperties={loadProperties}
        />
      </tbody>
    </table>,
  );
}

const toggleName = 'Properties of Calculator result shown';
const EVENT_VISITS = '/p1/visits?range=7d&event=calculator_result_shown';

function valueHref(key: string, value: string): string | null {
  return value === 'margin' ? null : `/p1/visits?property=${key}%3D${value}`;
}

describe('PropertyBreakdown', () => {
  it('says it is loading', () => {
    render(
      <PropertyBreakdown
        eventLabel="CTA clicked"
        state={{ status: 'loading' }}
        onRetry={vi.fn()}
        valueHref={valueHref}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading the properties of CTA clicked…');
  });

  it('offers to try again after a failure', async () => {
    const onRetry = vi.fn();
    render(
      <PropertyBreakdown
        eventLabel="CTA clicked"
        state={{ status: 'error' }}
        onRetry={onRetry}
        valueHref={valueHref}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load the properties');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('says when the event carried no properties', () => {
    render(
      <PropertyBreakdown
        eventLabel="Product created"
        state={{ status: 'ready', keys: [] }}
        onRetry={vi.fn()}
        valueHref={valueHref}
      />,
    );

    expect(
      screen.getByText('Product created carried no properties in this period.'),
    ).toBeInTheDocument();
  });

  it('shows one table per key, its values and the other values', () => {
    render(
      <PropertyBreakdown
        eventLabel="Calculator result shown"
        state={{ status: 'ready', keys: KEYS }}
        onRetry={vi.fn()}
        valueHref={valueHref}
      />,
    );

    const table = screen.getByRole('table', { name: 'calculator · carried by 10 events' });
    const rows = within(table).getAllByRole('row');
    expect(rows.map((row) => row.textContent)).toEqual([
      'ValueShareCountVisits',
      'shipping60.0%65',
      'margin30.0%33',
      'Other values10.0%1—',
    ]);
  });

  it('links each value it can filter by to the visits whose event carried it', () => {
    render(
      <PropertyBreakdown
        eventLabel="Calculator result shown"
        state={{ status: 'ready', keys: KEYS }}
        onRetry={vi.fn()}
        valueHref={valueHref}
      />,
    );

    const table = screen.getByRole('table', { name: 'calculator · carried by 10 events' });
    expect(within(table).getAllByRole('link')).toHaveLength(1);
    expect(
      within(table).getByRole('link', {
        name: 'shipping: see the visits where calculator is shipping',
      }),
    ).toHaveAttribute('href', '/p1/visits?property=calculator%3Dshipping');
  });

  it('leaves out the other values when every value is shown', () => {
    const keys = propertyKeyViews(
      propertyBreakdownResponseSchema.parse({
        name: 'report_exported',
        events: 5,
        keys: [
          {
            key: 'format',
            events: 5,
            values: [
              { value: 'pdf', count: 3, visits: 2 },
              { value: 'csv', count: 2, visits: 2 },
            ],
            other_count: 0,
          },
        ],
      }),
      english,
    );
    render(
      <PropertyBreakdown
        eventLabel="Report exported"
        state={{ status: 'ready', keys }}
        onRetry={vi.fn()}
        valueHref={() => null}
      />,
    );

    const table = screen.getByRole('table', { name: 'format · carried by 5 events' });
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((cell) => cell.textContent),
    ).toEqual(['pdf', 'csv']);
  });
});

describe('ExpandableFeatureRow', () => {
  it('loads the properties the first time it opens, and keeps them across toggles', async () => {
    const loadProperties = vi.fn(() => Promise.resolve(KEYS));
    renderRow(loadProperties);
    const toggle = screen.getByRole('button', { name: toggleName });

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(loadProperties).toHaveBeenCalledWith('calculator_result_shown');
    expect(await screen.findByRole('table', { name: /^calculator/ })).toBeVisible();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('table', { name: /^calculator/ })).not.toBeInTheDocument();

    await userEvent.click(toggle);
    expect(screen.getByRole('table', { name: /^calculator/ })).toBeVisible();
    expect(loadProperties).toHaveBeenCalledOnce();
  });

  it('controls the details row it opens', async () => {
    renderRow(() => Promise.resolve(KEYS));
    const toggle = screen.getByRole('button', { name: toggleName });

    await userEvent.click(toggle);

    const details = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(details).not.toBeNull();
    expect(details).toBeVisible();
  });

  it('fills the row it opened and edges its panel, and lets go once closed', async () => {
    renderRow(() => Promise.resolve(KEYS));
    const toggle = screen.getByRole('button', { name: toggleName });
    const row = toggle.closest('tr');
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');

    await userEvent.click(toggle);
    expect(row).toHaveClass('bg-soft');
    expect(panel?.querySelector('td')).toHaveClass('bg-soft', 'border-l-violet');

    await userEvent.click(toggle);
    expect(row).not.toHaveClass('bg-soft');
  });

  it('asks once while a request is running, even if toggled again', async () => {
    const loadProperties = vi.fn(() => new Promise<readonly PropertyKeyView[]>(() => undefined));
    const { unmount } = renderRow(loadProperties);
    const toggle = screen.getByRole('button', { name: toggleName });

    await userEvent.click(toggle);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await userEvent.click(toggle);
    await userEvent.click(toggle);

    expect(loadProperties).toHaveBeenCalledOnce();
    unmount();
  });

  it('says so when the properties fail to load, and loads them again on retry', async () => {
    const loadProperties = vi
      .fn<(name: string) => Promise<readonly PropertyKeyView[]>>()
      .mockRejectedValueOnce(new Error('503'))
      .mockResolvedValueOnce(KEYS);
    renderRow(loadProperties);

    await userEvent.click(screen.getByRole('button', { name: toggleName }));
    await userEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('table', { name: /^calculator/ })).toBeVisible();
    expect(loadProperties).toHaveBeenCalledTimes(2);
  });

  it('loads again when reopened after a failure', async () => {
    const loadProperties = vi
      .fn<(name: string) => Promise<readonly PropertyKeyView[]>>()
      .mockRejectedValueOnce(new Error('503'))
      .mockResolvedValueOnce([]);
    renderRow(loadProperties);
    const toggle = screen.getByRole('button', { name: toggleName });

    await userEvent.click(toggle);
    await screen.findByRole('alert');
    await userEvent.click(toggle);
    await userEvent.click(toggle);

    expect(
      await screen.findByText('Calculator result shown carried no properties in this period.'),
    ).toBeInTheDocument();
    expect(loadProperties).toHaveBeenCalledTimes(2);
  });

  it('links the event and each value to the visits, keeping the period', async () => {
    renderRow(() => Promise.resolve(KEYS));

    expect(
      screen.getByRole('link', { name: 'Calculator result shown: see its visits' }),
    ).toHaveAttribute('href', EVENT_VISITS);
    await userEvent.click(screen.getByRole('button', { name: toggleName }));

    expect(
      await screen.findByRole('link', {
        name: 'margin: see the visits where calculator is margin',
      }),
    ).toHaveAttribute('href', `${EVENT_VISITS}&property=calculator%3Dmargin`);
  });

  it('leaves a value the Visits filter could not read unlinked', async () => {
    const longValue = 'x'.repeat(101);
    const keys = propertyKeyViews(
      propertyBreakdownResponseSchema.parse({
        name: 'calculator_result_shown',
        events: 1,
        keys: [
          {
            key: 'note',
            events: 1,
            values: [{ value: longValue, count: 1, visits: 1 }],
            other_count: 0,
          },
        ],
      }),
      english,
    );
    renderRow(() => Promise.resolve(keys));

    await userEvent.click(screen.getByRole('button', { name: toggleName }));

    const table = await screen.findByRole('table', { name: /^note/ });
    expect(within(table).getByRole('rowheader')).toHaveTextContent(longValue);
    expect(within(table).queryByRole('link')).not.toBeInTheDocument();
  });

  it('can go away before it was ever opened', () => {
    const { unmount } = renderRow(() => Promise.resolve(KEYS));

    expect(() => {
      unmount();
    }).not.toThrow();
  });
});

describe('FeatureTable with a property loader', () => {
  it('lets each event open its properties, and leaves screens as they are', () => {
    const rows = featureRows(
      [{ name: 'cta_clicked', count: 3, visits: 2, daily: [1, 2] }],
      'events',
      '',
      english,
    );
    const { rerender } = render(
      <FeatureTable
        kind="events"
        rows={rows}
        query=""
        visitsHref={() => EVENT_VISITS}
        loadProperties={vi.fn()}
        i18n={english}
      />,
    );

    expect(screen.getByRole('button', { name: 'Properties of CTA clicked' })).toBeInTheDocument();

    rerender(
      <FeatureTable
        kind="screens"
        rows={featureRows(
          [{ name: '/orders', count: 3, visits: 2, daily: [1, 2] }],
          'screens',
          '',
          english,
        )}
        query=""
        visitsHref={() => EVENT_VISITS}
        loadProperties={vi.fn()}
        i18n={english}
      />,
    );

    expect(screen.queryByRole('button', { name: /^Properties of/ })).toBeNull();
  });
});
