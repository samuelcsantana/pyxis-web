import { z } from 'zod';
import { CHANNELS } from './acquisition';

const channelVisitsSchema = z.object({
  paid: z.number(),
  email: z.number(),
  social: z.number(),
  campaign: z.number(),
  organic: z.number(),
  referral: z.number(),
  direct: z.number(),
});

export const acquisitionResponseSchema = z
  .object({
    days: z.array(z.object({ date: z.string(), by_channel: channelVisitsSchema })),
    sources: z.array(
      z.object({
        source: z.string(),
        medium: z.string().nullable(),
        channel: z.enum(CHANNELS),
        visits: z.number(),
        conversions: z.number().nullable(),
        converting_visits: z.number().nullable().optional(),
        from_ad_click_visits: z.number(),
      }),
    ),
    campaigns: z
      .array(
        z.object({
          campaign: z.string(),
          source: z.string(),
          medium: z.string().nullable(),
          channel: z.enum(CHANNELS),
          visits: z.number(),
          conversions: z.number().nullable(),
          converting_visits: z.number().nullable(),
          from_ad_click_visits: z.number(),
        }),
      )
      .optional(),
  })
  .transform((body) => ({
    days: body.days.map((day) => ({ date: day.date, byChannel: day.by_channel })),
    sources: body.sources.map((source) => ({
      source: source.source,
      medium: source.medium,
      channel: source.channel,
      visits: source.visits,
      conversions: source.conversions,
      convertingVisits: source.converting_visits ?? null,
      fromAdClickVisits: source.from_ad_click_visits,
    })),
  }));

export type AcquisitionReport = z.output<typeof acquisitionResponseSchema>;
export type AcquisitionWire = z.input<typeof acquisitionResponseSchema>;
export type ChannelVisits = z.output<typeof channelVisitsSchema>;
