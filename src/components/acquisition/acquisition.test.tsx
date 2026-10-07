import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { type Source, sourceRows } from '@/domain/acquisition';
import { StatCard } from '@/components/ui/stat-card';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { ChannelChart } from './channel-chart';
import { SourcesTable } from './sources-table';

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const REPORT = demoAcquisitionReport('demo', WEEK);

const GOOGLE: Source = {
  source: 'google',
  medium: 'cpc',
  channel: 'paid',
  visits: 1200,
  conversions: 60,
  convertingVisits: null,
  fromAdClickVisits: 1100,
};

describe('ChannelChart', () => {
  it('stacks the active channels, with their totals beside the legend', () => {
    render(<ChannelChart days={REPORT.days} periodLabel="last 7 days" />);

    expect(screen.getByRole('img')).toHaveAccessibleName(/^Stacked bar chart of 7 days,/);
    expect(screen.getByText('Organic search')).toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });

  it('switches to a table of every day with its total', async () => {
    render(<ChannelChart days={REPORT.days} periodLabel="last 7 days" />);

    await userEvent.click(screen.getByRole('button', { name: 'View as table' }));

    const table = screen.getByRole('table', { name: 'Visits by channel per day, last 7 days' });
    const [header] = within(table).getAllByRole('row');
    expect(header).toHaveTextContent('DayPaidSocialOrganic searchReferralDirectTotal');
    const cells = [...table.querySelectorAll('tbody tr:first-child td')].map((cell) =>
      Number(cell.textContent.replaceAll(',', '')),
    );
    expect(cells.at(-1)).toBe(cells.slice(0, -1).reduce((sum, value) => sum + value, 0));
  });
});

describe('SourcesTable', () => {
  it('shows each source with its channel, ad click visits and conversion rate', () => {
    render(<SourcesTable rows={sourceRows([GOOGLE])} />);

    const [, row] = screen.getAllByRole('row');
    expect(row).toHaveTextContent('googlePaid1,100 from ad clickscpc1,200605%');
  });

  it('leaves the conversion columns out without a conversion event', () => {
    render(
      <SourcesTable rows={sourceRows([{ ...GOOGLE, conversions: null, fromAdClickVisits: 0 }])} />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).not.toBeInTheDocument();
    expect(screen.queryByText(/from ad clicks/)).not.toBeInTheDocument();
  });

  it('says so when no visit had a source', () => {
    render(<SourcesTable rows={[]} />);

    expect(screen.getByText('No visits with a source in this period.')).toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('shows a figure with its label and note', () => {
    render(<StatCard id="paid" label="Paid visits" value="829" note="34.7% of 2,390 visits" />);

    expect(screen.getByRole('region', { name: 'Paid visits' })).toHaveTextContent(
      'Paid visits82934.7% of 2,390 visits',
    );
  });
});
