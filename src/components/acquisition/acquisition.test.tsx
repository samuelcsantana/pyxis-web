import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  activeChannels,
  type Campaign,
  campaignRows,
  channelChartRows,
  type Source,
  sourceRows,
} from '@/domain/acquisition';
import { valueAxis } from '@/domain/chart-scale';
import { stackedBars } from '@/domain/stacked-bars';
import { StatCard } from '@/components/ui/stat-card';
import { demoAcquisitionReport } from '@/services/acquisition/demo-acquisition';
import { CampaignsTable } from './campaigns-table';
import { ChannelChart } from './channel-chart';
import { SourcesTable } from './sources-table';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const NOW = new Date('2026-10-06T02:30:00.000Z');

const WEEK = { from: '2026-09-29', to: '2026-10-05' };
const REPORT = demoAcquisitionReport('demo', WEEK, NOW);

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
    renderWithMessages(
      <ChannelChart days={REPORT.days} periodLabel="last 7 days" i18n={english} />,
    );

    expect(screen.getByRole('img')).toHaveAccessibleName(/^Stacked bar chart of 7 days,/);
    expect(screen.getByText('Organic search')).toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });

  it('draws a bar per day, a segment per channel, with a card-coloured line between segments', () => {
    renderWithMessages(
      <ChannelChart days={REPORT.days} periodLabel="last 7 days" i18n={english} />,
    );

    const figure = screen.getByRole('img');
    const rows = channelChartRows(REPORT.days);
    const channels = activeChannels(REPORT.days);
    const bars = stackedBars(rows, channels, valueAxis(rows.map((row) => row.total)).top);
    const rects = [...figure.querySelectorAll('rect')];
    expect(rects).toHaveLength(bars.segments.length);
    expect(rects[0]).toHaveAttribute('fill', 'var(--color-accent)');
    expect(new Set(rects.map((rect) => rect.getAttribute('x')))).toHaveProperty('size', 7);
    expect(figure.querySelector('path[stroke="var(--color-card)"]')).toHaveAttribute(
      'd',
      bars.separators,
    );
    expect(bars.separators).not.toBe('');
  });

  it('shows the channels of the day under the pointer, and its total', () => {
    renderWithMessages(
      <ChannelChart days={REPORT.days} periodLabel="last 7 days" i18n={english} />,
    );
    const layer = screen.getByRole('img').querySelector<HTMLElement>('[data-layer="hover"]');
    if (layer === null) {
      throw new Error('The hover layer was not drawn');
    }
    vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 700 } as DOMRect);

    fireEvent.pointerMove(layer, { clientX: 690 });

    const [last] = channelChartRows(REPORT.days).slice(-1);
    expect(layer).toHaveTextContent('Oct 5');
    expect(layer).toHaveTextContent(`Organic search${String(last?.organic)}`);
    expect(layer).toHaveTextContent(`Total${String(last?.total)}`);
  });

  it('switches to a table of every day with its total', async () => {
    renderWithMessages(
      <ChannelChart days={REPORT.days} periodLabel="last 7 days" i18n={english} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Table' }));

    const table = screen.getByRole('table', { name: 'Visits by channel per day, last 7 days' });
    const [header] = within(table).getAllByRole('row');
    expect(header).toHaveTextContent('DayPaidSocialOrganic searchReferralDirectTotal');
    const cells = [...table.querySelectorAll('tbody tr:first-child td')].map((cell) =>
      Number(cell.textContent.replaceAll(',', '')),
    );
    expect(cells.at(-1)).toBe(cells.slice(0, -1).reduce((sum, value) => sum + value, 0));
  });
});

function channelVisitsHref(channel: string): string {
  return `/p1/visits?range=7d&channel=${channel}`;
}

function sourceVisitsHref(source: string): string {
  return `/p1/visits?range=7d&source=${source}`;
}

describe('SourcesTable', () => {
  it('shows each source with its channel, ad click visits and conversion rate', () => {
    renderWithMessages(
      <SourcesTable
        i18n={english}
        rows={sourceRows([GOOGLE], english)}
        channelVisitsHref={channelVisitsHref}
        sourceVisitsHref={sourceVisitsHref}
      />,
    );

    const [, row] = screen.getAllByRole('row');
    expect(row).toHaveTextContent('googlePaidcpc1,100 from ad clickscpc1,200605.0%60 converted');
    expect(screen.getByRole('link', { name: 'google: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=7d&source=google',
    );
    expect(screen.getByRole('link', { name: 'Paid: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=7d&channel=paid',
    );
  });

  it('keeps the totals beside the rate and the medium beside the channel on phones', () => {
    renderWithMessages(
      <SourcesTable
        i18n={english}
        rows={sourceRows([GOOGLE], english)}
        channelVisitsHref={channelVisitsHref}
        sourceVisitsHref={sourceVisitsHref}
      />,
    );

    expect(screen.getByText('60 converted')).toHaveClass('sm:hidden');
    expect(screen.getAllByText('cpc')[0]).toHaveClass('sm:hidden');
  });

  it('shows a dash for a source without a medium, and no note for a source not counted', () => {
    renderWithMessages(
      <SourcesTable
        i18n={english}
        rows={sourceRows(
          [GOOGLE, { ...GOOGLE, source: 'bing', medium: null, conversions: null }],
          english,
        )}
        channelVisitsHref={channelVisitsHref}
        sourceVisitsHref={sourceVisitsHref}
      />,
    );

    const [, , bing] = screen.getAllByRole('row');
    expect(bing).toHaveTextContent('bingPaid1,100 from ad clicks—1,200');
    expect(screen.getAllByText(/converted$/)).toHaveLength(1);
  });

  it('leaves the conversion columns out without a conversion event', () => {
    renderWithMessages(
      <SourcesTable
        i18n={english}
        rows={sourceRows([{ ...GOOGLE, conversions: null, fromAdClickVisits: 0 }], english)}
        channelVisitsHref={channelVisitsHref}
        sourceVisitsHref={sourceVisitsHref}
      />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).not.toBeInTheDocument();
    expect(screen.queryByText(/from ad clicks/)).not.toBeInTheDocument();
  });

  it('says so when no visit had a source', () => {
    renderWithMessages(
      <SourcesTable
        i18n={english}
        rows={[]}
        channelVisitsHref={channelVisitsHref}
        sourceVisitsHref={sourceVisitsHref}
      />,
    );

    expect(screen.getByText('No visits with a source in this period.')).toBeInTheDocument();
  });
});

const SPRING_SALE: Campaign = {
  campaign: 'spring_sale',
  source: 'google',
  medium: 'cpc',
  channel: 'paid',
  visits: 800,
  conversions: 50,
  convertingVisits: 40,
  fromAdClickVisits: 700,
};

function campaignVisitsHref({ campaign, source }: { campaign: string; source: string }): string {
  return `/p1/visits?range=7d&campaign=${campaign}&source=${source}`;
}

describe('CampaignsTable', () => {
  it('shows each campaign with its source, medium, ad click visits and conversion rate', () => {
    renderWithMessages(
      <CampaignsTable
        i18n={english}
        rows={campaignRows([SPRING_SALE], english)}
        campaignVisitsHref={campaignVisitsHref}
      />,
    );

    const [header, row] = screen.getAllByRole('row');
    expect(header).toHaveTextContent('CampaignSourceVisitsConversionsConversion rate');
    expect(row).toHaveTextContent(
      'spring_salegooglecpc700 from ad clicksgooglecpc800405.0%40 converted',
    );
    expect(
      screen.getByRole('link', { name: 'spring_sale: see its visits from google' }),
    ).toHaveAttribute('href', '/p1/visits?range=7d&campaign=spring_sale&source=google');
  });

  it('keeps the source beside the campaign on phones, with a dash for no medium', () => {
    renderWithMessages(
      <CampaignsTable
        i18n={english}
        rows={campaignRows(
          [{ ...SPRING_SALE, source: '(direct)', medium: null, fromAdClickVisits: 0 }],
          english,
        )}
        campaignVisitsHref={campaignVisitsHref}
      />,
    );

    const [phoneSource] = screen.getAllByText('Direct');
    expect(phoneSource).toHaveClass('sm:hidden');
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText(/from ad clicks/)).not.toBeInTheDocument();
  });

  it('leaves the conversion columns out without a conversion event', () => {
    renderWithMessages(
      <CampaignsTable
        i18n={english}
        rows={campaignRows(
          [{ ...SPRING_SALE, conversions: null, convertingVisits: null }],
          english,
        )}
        campaignVisitsHref={campaignVisitsHref}
      />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).not.toBeInTheDocument();
  });

  it('says so when no visit carried a campaign tag', () => {
    renderWithMessages(
      <CampaignsTable i18n={english} rows={[]} campaignVisitsHref={campaignVisitsHref} />,
    );

    expect(
      screen.getByText('No visit arrived with a campaign tag in this period.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('shows a figure with its label and note', () => {
    renderWithMessages(
      <StatCard id="paid" label="Paid visits" value="829" note="34.7% of 2,390 visits" />,
    );

    expect(screen.getByRole('group', { name: 'Paid visits' })).toHaveTextContent(
      'Paid visits82934.7% of 2,390 visits',
    );
  });
});
