import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { featureRows } from '@/domain/features';
import { type PropertyKeyView, propertyKeyViews } from '@/domain/property-breakdown';
import { propertyBreakdownResponseSchema } from '@/domain/property-breakdown.schema';
import type { PropertySummaryView } from '@/domain/property-summary';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ExpandableFeatureRow, type LoadEventSummary } from './expandable-feature-row';
import { NumericSummary, NumericSummaryTable } from './numeric-summary';
import { PropertyBreakdown } from './property-breakdown';

const OVERALL: PropertySummaryView = {
  overall: { median: '33', middleHalf: '15 to 39', events: '6 events' },
  groups: [],
  other: null,
};

const BY_POST: PropertySummaryView = {
  ...OVERALL,
  groups: [
    { value: 'angular', median: '27', middleHalf: '15 to 39', events: '4 events' },
    { value: 'react', median: '40', middleHalf: '40 to 40', events: '1 event' },
  ],
  other: '1',
};

const KEYS = propertyKeyViews(
  propertyBreakdownResponseSchema.parse({
    name: 'article_read_100',
    events: 6,
    keys: [
      {
        key: 'seconds',
        events: 6,
        values: [
          { value: '33', count: 3, visits: 3 },
          { value: '15', count: 3, visits: 2 },
        ],
        other_count: 0,
      },
      {
        key: 'post',
        events: 6,
        values: [{ value: 'angular', count: 6, visits: 4 }],
        other_count: 0,
      },
    ],
  }),
  english,
);

describe('NumericSummary', () => {
  it('reads the median of the key, then splits it by the value of another key', async () => {
    const loadSummary = vi.fn((_key: string, by: string | null) =>
      Promise.resolve(by === null ? OVERALL : BY_POST),
    );
    renderWithMessages(
      <NumericSummary propertyKey="seconds" otherKeys={['post']} loadSummary={loadSummary} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Reading the median of seconds…');
    expect(await screen.findByText('33')).toBeVisible();
    expect(screen.getByText('15 to 39')).toBeVisible();
    expect(screen.queryByRole('table')).toBeNull();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Split by' }), 'post');

    const table = await screen.findByRole('table');
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((cell) => cell.textContent),
    ).toEqual(['angular', 'react', 'Other values']);
    expect(loadSummary).toHaveBeenLastCalledWith('seconds', 'post');

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Split by' }), 'No split');
    expect(loadSummary).toHaveBeenLastCalledWith('seconds', null);
  });

  it('offers to try again after a failure, and has no split without another key', async () => {
    const loadSummary = vi
      .fn<(key: string, by: string | null) => Promise<PropertySummaryView>>()
      .mockRejectedValueOnce(new Error('The API is unreachable.'))
      .mockResolvedValue({ overall: null, groups: [], other: null });
    renderWithMessages(
      <NumericSummary propertyKey="seconds" otherKeys={[]} loadSummary={loadSummary} />,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Could not read the median of seconds.');
    expect(screen.queryByRole('combobox')).toBeNull();

    await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(loadSummary).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText('Could not read the median of seconds.').catch(() => null),
    ).toBeNull();
  });

  it('drops an answer that arrives after the key changed', async () => {
    let settle: (view: PropertySummaryView) => void = () => undefined;
    const loadSummary = vi.fn(
      () =>
        new Promise<PropertySummaryView>((resolve) => {
          settle = resolve;
        }),
    );
    const { unmount } = renderWithMessages(
      <NumericSummary propertyKey="seconds" otherKeys={[]} loadSummary={loadSummary} />,
    );
    unmount();

    settle(OVERALL);
    await Promise.resolve();

    expect(loadSummary).toHaveBeenCalledTimes(1);
  });

  it('drops a failure that arrives after the key changed', async () => {
    let fail: (error: Error) => void = () => undefined;
    const loadSummary = vi.fn(
      () =>
        new Promise<PropertySummaryView>((_resolve, reject) => {
          fail = reject;
        }),
    );
    const { unmount } = renderWithMessages(
      <NumericSummary propertyKey="seconds" otherKeys={[]} loadSummary={loadSummary} />,
    );
    unmount();

    fail(new Error('late'));
    await Promise.resolve();

    expect(loadSummary).toHaveBeenCalledTimes(1);
  });
});

describe('the median in the property breakdown', () => {
  it('shows above a numeric key only, split by the other keys of the event', async () => {
    const loadSummary = vi.fn(() => Promise.resolve(OVERALL));
    renderWithMessages(
      <PropertyBreakdown
        eventLabel="Article read 100"
        state={{ status: 'ready', keys: KEYS }}
        onRetry={vi.fn()}
        valueHref={() => null}
        loadSummary={loadSummary}
      />,
    );

    expect(await screen.findByText('33')).toBeVisible();
    expect(loadSummary).toHaveBeenCalledTimes(1);
    expect(loadSummary).toHaveBeenCalledWith('seconds', null);
    expect(
      within(screen.getByRole('combobox', { name: 'Split by' })).getAllByRole('option'),
    ).toHaveLength(2);
  });

  it('asks the summary of the event of its row', async () => {
    const [row] = featureRows(
      [{ name: 'article_read_100', count: 6, visits: 4, daily: [6] }],
      'events',
      '',
      english,
    );
    if (row === undefined) {
      throw new Error('The fixture has a row.');
    }
    const loadSummary = vi.fn<LoadEventSummary>(() => Promise.resolve(OVERALL));
    renderWithMessages(
      <table>
        <tbody>
          <ExpandableFeatureRow
            row={row}
            visitsHref="/p1/visits?event=article_read_100"
            visitsPurpose={english.t('visitsLink.purpose')}
            loadProperties={(): Promise<readonly PropertyKeyView[]> => Promise.resolve(KEYS)}
            loadSummary={loadSummary}
          />
        </tbody>
      </table>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Properties of Article read 100' }));

    expect(await screen.findByText('15 to 39')).toBeVisible();
    expect(loadSummary).toHaveBeenCalledWith('article_read_100', 'seconds', null);
  });
});

describe('NumericSummaryTable', () => {
  it('has no row for the other values when every value is shown', () => {
    renderWithMessages(<NumericSummaryTable view={{ ...BY_POST, other: null }} by="post" />);

    expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual([
      'angular',
      'react',
    ]);
  });
});
