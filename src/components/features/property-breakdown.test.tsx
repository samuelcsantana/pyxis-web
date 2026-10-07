import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { featureRows } from '@/domain/features';
import {
  propertyBreakdownResponseSchema,
  type PropertyKeyView,
  propertyKeyViews,
} from '@/domain/property-breakdown';
import { ExpandableFeatureRow } from './expandable-feature-row';
import { FeatureTable } from './feature-table';
import { PropertyBreakdown } from './property-breakdown';

const KEYS = propertyKeyViews(
  propertyBreakdownResponseSchema.parse({
    name: 'calculator_result_shown',
    events: 10,
    keys: [
      {
        key: 'calculator',
        events: 10,
        values: [
          { value: 'ifood', count: 6, visits: 5 },
          { value: '99food', count: 3, visits: 3 },
        ],
        other_count: 1,
      },
    ],
  }),
);

const [ROW] = featureRows(
  [{ name: 'calculator_result_shown', count: 10, visits: 8, daily: [4, 6] }],
  'events',
  '',
);

function renderRow(loadProperties: (name: string) => Promise<readonly PropertyKeyView[]>) {
  if (ROW === undefined) {
    throw new Error('The fixture has a row.');
  }
  return render(
    <table>
      <tbody>
        <ExpandableFeatureRow row={ROW} loadProperties={loadProperties} />
      </tbody>
    </table>,
  );
}

const toggleName = 'Properties of Calculator result shown';

describe('PropertyBreakdown', () => {
  it('says it is loading', () => {
    render(
      <PropertyBreakdown
        eventLabel="Cta clicked"
        state={{ status: 'loading' }}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading the properties of Cta clicked…');
  });

  it('offers to try again after a failure', async () => {
    const onRetry = vi.fn();
    render(
      <PropertyBreakdown eventLabel="Cta clicked" state={{ status: 'error' }} onRetry={onRetry} />,
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
      />,
    );

    const table = screen.getByRole('table', { name: 'calculator · carried by 10 events' });
    const rows = within(table).getAllByRole('row');
    expect(rows.map((row) => row.textContent)).toEqual([
      'ValueShareCountVisits',
      'ifood60%65',
      '99food30%33',
      'Other values10%1—',
    ]);
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
    );
    render(
      <PropertyBreakdown
        eventLabel="Report exported"
        state={{ status: 'ready', keys }}
        onRetry={vi.fn()}
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
    );
    const { rerender } = render(
      <FeatureTable kind="events" rows={rows} query="" loadProperties={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Properties of Cta clicked' })).toBeInTheDocument();

    rerender(
      <FeatureTable
        kind="screens"
        rows={featureRows([{ name: '/orders', count: 3, visits: 2, daily: [1, 2] }], 'screens', '')}
        query=""
        loadProperties={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /^Properties of/ })).toBeNull();
  });
});
