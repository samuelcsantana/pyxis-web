import { describe, expect, it } from 'vitest';
import {
  type AcquisitionWire,
  activeChannels,
  type Campaign,
  campaignRows,
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
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';

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
  convertingVisits: null,
  fromAdClickVisits: 120,
};
const SPRING_WIRE = {
  campaign: 'spring_sale',
  source: 'google',
  medium: 'cpc',
  channel: 'paid',
  visits: 80,
  conversions: 6,
  converting_visits: 4,
  from_ad_click_visits: 72,
} as const;
const SPRING_SALE: Campaign = {
  campaign: 'spring_sale',
  source: 'google',
  medium: 'cpc',
  channel: 'paid',
  visits: 80,
  conversions: 6,
  convertingVisits: 4,
  fromAdClickVisits: 72,
};

describe('acquisitionResponseSchema', () => {
  it('maps the wire names to the dashboard ones', () => {
    expect(REPORT.days[0]?.byChannel.paid).toBe(60);
    expect(REPORT.sources[0]?.fromAdClickVisits).toBe(120);
    expect(REPORT.sources[0]?.convertingVisits).toBeNull();
    const [counted] = acquisitionResponseSchema.parse({
      ...WIRE,
      sources: [{ ...WIRE.sources[0], converting_visits: 5 }],
    }).sources;
    expect(counted?.convertingVisits).toBe(5);
  });

  it('maps the campaigns, and reads an API without them as none', () => {
    expect(REPORT.campaigns).toEqual([]);
    const [campaign] = acquisitionResponseSchema.parse({
      ...WIRE,
      campaigns: [SPRING_WIRE],
    }).campaigns;
    expect(campaign).toEqual(SPRING_SALE);
  });
});

describe('campaignRows', () => {
  it('gives each campaign its source, conversion rate and ad click visits', () => {
    const [spring, brand] = campaignRows(
      [SPRING_SALE, { ...SPRING_SALE, campaign: 'brand', source: '(direct)', visits: 20 }],
      english,
    );

    expect(spring).toEqual({
      key: 'spring_sale|google|cpc|paid',
      campaign: 'spring_sale',
      source: 'google',
      sourceLabel: 'google',
      medium: 'cpc',
      channel: 'paid',
      visits: '80',
      conversions: '4',
      conversionRate: '5.0%',
      barWidth: '25.0%',
      fromAdClicks: '72 from ad clicks',
    });
    expect(brand).toMatchObject({
      source: '(direct)',
      sourceLabel: 'Direct',
      conversionRate: '20.0%',
      barWidth: '100.0%',
    });
  });

  it('falls back to conversion events and leaves rates out without a conversion event', () => {
    const [events] = campaignRows([{ ...SPRING_SALE, convertingVisits: null }], english);
    const [none] = campaignRows(
      [{ ...SPRING_SALE, conversions: null, convertingVisits: null, fromAdClickVisits: 0 }],
      english,
    );

    expect(events).toMatchObject({ conversions: '6', conversionRate: '7.5%' });
    expect(none).toMatchObject({ conversions: null, conversionRate: null, fromAdClicks: null });
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
    expect(channelSummary(REPORT.days, english)).toBe(
      'Stacked bar chart of 2 days, between 120 and 130 visits a day. ' +
        'Visits by channel: Paid 130, Organic search 90, Direct 30.',
    );
  });

  it('describe the chart in Brazilian Portuguese, joining the last channel with "e"', () => {
    expect(channelSummary(REPORT.days, portuguese)).toBe(
      'Gráfico de barras empilhadas de 2 dias, entre 120 e 130 visitas por dia. ' +
        'Visitas por canal: Pago 130, Busca orgânica 90 e Direto 30.',
    );
  });
});

describe('paidVisits', () => {
  it('gives the paid visits with their share of every visit', () => {
    expect(paidVisits(REPORT.days, english)).toEqual({ value: '130', note: '52.0% of 250 visits' });
  });

  it('shows a dash for the share when nobody visited', () => {
    expect(paidVisits([{ date: '2026-10-05', byChannel: NONE }], english).note).toBe(
      '— of 0 visits',
    );
  });
});

describe('topChannel', () => {
  it('names the channel that brought the most visits, with its share', () => {
    expect(
      topChannel(
        [{ date: '2026-10-05', byChannel: { ...NONE, organic: 30, direct: 10 } }],
        english,
      ),
    ).toEqual({ label: 'Top channel', value: 'Organic search', note: '75.0% of 40 visits' });
  });

  it('names the runner-up when Paid leads, so it does not repeat the paid visits card', () => {
    expect(
      topChannel(
        [{ date: '2026-10-05', byChannel: { ...NONE, paid: 50, organic: 30, direct: 20 } }],
        english,
      ),
    ).toEqual({
      label: 'Top unpaid channel',
      value: 'Organic search',
      note: '30.0% of 100 visits',
    });
  });

  it('keeps the plain top channel when there were no visits', () => {
    expect(topChannel([{ date: '2026-10-05', byChannel: NONE }], english)).toMatchObject({
      label: 'Top channel',
    });
  });
});

describe('sourceRows', () => {
  it('gives each source its medium, conversion rate and ad click visits', () => {
    const [google, direct] = sourceRows(REPORT.sources, english);

    expect(google).toEqual({
      key: 'google|cpc|paid',
      source: 'google',
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
      source: '(direct)',
      label: 'Direct',
      medium: null,
      conversionRate: '10.0%',
      barWidth: '100.0%',
      fromAdClicks: null,
    });
  });

  it('rates the visits that converted when the API counts them', () => {
    const [row] = sourceRows([{ ...GOOGLE, conversions: 9, convertingVisits: 5 }], english);

    expect(row).toMatchObject({ conversions: '5', conversionRate: '3.8%' });
  });

  it('leaves conversions out when the project has no conversion event', () => {
    const [row] = sourceRows([{ ...GOOGLE, conversions: null }], english);

    expect(row?.conversions).toBeNull();
    expect(row?.conversionRate).toBeNull();
    expect(row?.barWidth).toBe('0.0%');
  });

  it('shows a dash for a source without visits', () => {
    const [row] = sourceRows([{ ...GOOGLE, visits: 0, conversions: 0 }], english);

    expect(row?.conversionRate).toBe('—');
  });

  it('names a source as it came, except the direct one', () => {
    expect(sourceLabel('blog.example.com', english)).toBe('blog.example.com');
    expect(sourceLabel('(direct)', english)).toBe('Direct');
  });
});
