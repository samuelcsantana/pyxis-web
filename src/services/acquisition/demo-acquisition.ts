import {
  type AcquisitionReport,
  acquisitionResponseSchema,
  type AcquisitionWire,
  type Channel,
  CHANNELS,
} from '@/domain/acquisition';
import type { DateRange } from '../date-range';
import { demoCountsConversions } from '../demo/demo-projects';
import { demoDays, demoVisitsOn } from '../demo/demo-series';

type ChannelCounts = Readonly<Record<Channel, number>>;

const CHANNEL_SHARES: ChannelCounts = {
  paid: 0.35,
  email: 0,
  social: 0.11,
  campaign: 0,
  organic: 0.31,
  referral: 0.07,
  direct: 0.16,
};

interface DemoSource {
  readonly source: string;
  readonly medium: string | null;
  readonly channel: Channel;
  readonly share: number;
  readonly conversionRate: number;
  readonly adClickShare: number;
}

const SOURCES: readonly DemoSource[] = [
  {
    source: 'google',
    medium: 'cpc',
    channel: 'paid',
    share: 0.8,
    conversionRate: 0.046,
    adClickShare: 0.94,
  },
  {
    source: 'bing',
    medium: 'cpc',
    channel: 'paid',
    share: 0.2,
    conversionRate: 0.031,
    adClickShare: 0.81,
  },
  {
    source: 'www.google.com',
    medium: null,
    channel: 'organic',
    share: 0.9,
    conversionRate: 0.055,
    adClickShare: 0,
  },
  {
    source: 'duckduckgo.com',
    medium: null,
    channel: 'organic',
    share: 0.1,
    conversionRate: 0.049,
    adClickShare: 0,
  },
  {
    source: '(direct)',
    medium: null,
    channel: 'direct',
    share: 1,
    conversionRate: 0.063,
    adClickShare: 0,
  },
  {
    source: 'l.instagram.com',
    medium: null,
    channel: 'social',
    share: 0.7,
    conversionRate: 0.034,
    adClickShare: 0,
  },
  {
    source: 't.co',
    medium: null,
    channel: 'social',
    share: 0.3,
    conversionRate: 0.021,
    adClickShare: 0,
  },
  {
    source: 'blog.example.com',
    medium: null,
    channel: 'referral',
    share: 1,
    conversionRate: 0.038,
    adClickShare: 0,
  },
];

function splitDay(visits: number): ChannelCounts {
  const share = (channel: Channel) => Math.round(visits * CHANNEL_SHARES[channel]);
  const unpaid = CHANNELS.filter((channel) => channel !== 'paid').reduce(
    (sum, channel) => sum + share(channel),
    0,
  );
  return {
    paid: visits - unpaid,
    email: share('email'),
    social: share('social'),
    campaign: share('campaign'),
    organic: share('organic'),
    referral: share('referral'),
    direct: share('direct'),
  };
}

function demoSources(totals: ChannelCounts, countsConversions: boolean) {
  return CHANNELS.flatMap((channel) => {
    const ofChannel = SOURCES.filter((source) => source.channel === channel);
    const rounded = ofChannel.map((source) => ({
      source,
      visits: Math.round(totals[channel] * source.share),
    }));
    const remainder = totals[channel] - rounded.reduce((sum, item) => sum + item.visits, 0);
    return rounded.map(({ source, visits }, index) => {
      const count = visits + (index === 0 ? remainder : 0);
      return {
        source: source.source,
        medium: source.medium,
        channel,
        visits: count,
        conversions: countsConversions ? Math.round(count * source.conversionRate) : null,
        from_ad_click_visits: Math.round(count * source.adClickShare),
      };
    });
  }).toSorted((left, right) => right.visits - left.visits);
}

export function demoAcquisitionWire(projectId: string, range: DateRange): AcquisitionWire {
  const days = demoDays(range).map((date) => ({ date, by_channel: splitDay(demoVisitsOn(date)) }));
  const totals = days.reduce<ChannelCounts>(
    (sum, day) => ({
      paid: sum.paid + day.by_channel.paid,
      email: sum.email + day.by_channel.email,
      social: sum.social + day.by_channel.social,
      campaign: sum.campaign + day.by_channel.campaign,
      organic: sum.organic + day.by_channel.organic,
      referral: sum.referral + day.by_channel.referral,
      direct: sum.direct + day.by_channel.direct,
    }),
    { paid: 0, email: 0, social: 0, campaign: 0, organic: 0, referral: 0, direct: 0 },
  );
  return { days, sources: demoSources(totals, demoCountsConversions(projectId)) };
}

export function demoAcquisitionReport(projectId: string, range: DateRange): AcquisitionReport {
  return acquisitionResponseSchema.parse(demoAcquisitionWire(projectId, range));
}
