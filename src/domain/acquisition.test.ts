import { describe, expect, it } from 'vitest';
import {
  type AcquisitionWire,
  activeChannels,
  channelChartRows,
  channelSummary,
  channelTotals,
  paidVisits,
  sourceLabel,
  sourceRows,
  type Source,
  topChannel,
  visitsTotal,
} from './acquisition';
import { acquisitionResponseSchema } from './acquisition.schema';

const NONE = { paid: 0, email: 0, social: 0, campaign: 0, organic: 0, referral: 0, direct: 0 };

const WIRE: AcquisitionWire = {
  days: [
    { date: '2026-10-04', by_channel: { ...NONE, paid: 60, organic: 50, direct: 20 } },
    { date: '2026-10-05', by_channel: { ...NONE, paid: 70, organic: 40, direct: 10 } },
  ],
  sources: [
    {
      source: 'google',
      medium: 'cpc',
      channel: 'paid',
      visits: 130,
      conversions: 6,
      from_ad_click_visits: 120,
    },
    {
      source: '(direct)',
      medium: null,
      channel: 'direct',
      visits: 30,
      conversions: 3,
      from_ad_click_visits: 0,
    },
  ],
};

const REPORT = acquisitionResponseSchema.parse(WIRE);
const GOOGLE: Source = {
  source: 'google',
  medium: 'cpc',
  channel: 'paid',
  visits: 130,
  conversions: 6,
  fromAdClickVisits: 120,
};

describe('acquisitionResponseSchema', () => {
  it('maps the wire names to the dashboard ones', () => {
    expect(REPORT.days[0]?.byChannel.paid).toBe(60);
    expect(REPORT.sources[0]?.fromAdClickVisits).toBe(120);
  });
});

describe('channel totals', () => {
  it('add each channel over the days, and every channel together', () => {
    expect(channelTotals(REPORT.days)).toEqual({ ...NONE, paid: 130, organic: 90, direct: 30 });
    expect(visitsTotal(REPORT.days)).toBe(250);
  });

  it('keep only the channels that brought a visit, in the fixed order', () => {
    expect(activeChannels(REPORT.days)).toEqual(['paid', 'organic', 'direct']);
  });

  it('flatten each day for the chart, with its total', () => {
    expect(channelChartRows(REPORT.days)[1]).toEqual({
      date: '2026-10-05',
      ...NONE,
      paid: 70,
      organic: 40,
      direct: 10,
      total: 120,
    });
  });

  it('describe the chart in words, the biggest channel first', () => {
    expect(channelSummary(REPORT.days)).toBe(
      'Stacked bar chart of 2 days, between 120 and 130 visits a day. ' +
        'Visits by channel: Paid 130, Organic search 90, Direct 30.',
    );
  });
});

describe('paidVisits', () => {
  it('gives the paid visits with their share of every visit', () => {
    expect(paidVisits(REPORT.days)).toEqual({ value: '130', note: '52% of 250 visits' });
  });

  it('shows a dash for the share when nobody visited', () => {
    expect(paidVisits([{ date: '2026-10-05', byChannel: NONE }]).note).toBe('— of 0 visits');
  });
});

describe('topChannel', () => {
  it('names the channel that brought the most visits, with its share', () => {
    expect(
      topChannel([{ date: '2026-10-05', byChannel: { ...NONE, organic: 30, direct: 10 } }]),
    ).toEqual({ value: 'Organic search', note: '75% of 40 visits' });
  });
});

describe('sourceRows', () => {
  it('gives each source its medium, conversion rate and ad click visits', () => {
    const [google, direct] = sourceRows(REPORT.sources);

    expect(google).toEqual({
      key: 'google|cpc|paid',
      label: 'google',
      medium: 'cpc',
      channel: 'paid',
      visits: '130',
      conversions: '6',
      conversionRate: '4.6%',
      barWidth: '46.2%',
      fromAdClicks: '120 from ad clicks',
    });
    expect(direct).toMatchObject({
      key: '(direct)||direct',
      label: 'Direct',
      medium: '—',
      conversionRate: '10%',
      barWidth: '100.0%',
      fromAdClicks: null,
    });
  });

  it('leaves conversions out when the project has no conversion event', () => {
    const [row] = sourceRows([{ ...GOOGLE, conversions: null }]);

    expect(row?.conversions).toBeNull();
    expect(row?.conversionRate).toBeNull();
    expect(row?.barWidth).toBe('0.0%');
  });

  it('shows a dash for a source without visits', () => {
    const [row] = sourceRows([{ ...GOOGLE, visits: 0, conversions: 0 }]);

    expect(row?.conversionRate).toBe('—');
  });

  it('names a source as it came, except the direct one', () => {
    expect(sourceLabel('blog.example.com')).toBe('blog.example.com');
    expect(sourceLabel('(direct)')).toBe('Direct');
  });
});
