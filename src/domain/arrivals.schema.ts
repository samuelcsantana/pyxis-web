import { z } from 'zod';
import type { Arrivals, ArrivalsReport } from './arrivals';

const arrivalsSchema = z
  .object({ times: z.array(z.iso.datetime()), more: z.boolean() })
  .transform((arrivals): Arrivals => ({
    times: arrivals.times.map((time) => Date.parse(time)),
    more: arrivals.more,
  }));

export const arrivalsResponseSchema = z
  .object({
    as_of: z.iso.datetime(),
    active_visits: z.number().int().nonnegative(),
    visits: arrivalsSchema,
    conversions: arrivalsSchema.nullable(),
    named_events: arrivalsSchema,
    failed_requests: arrivalsSchema,
  })
  .transform((report): ArrivalsReport => ({
    asOf: Date.parse(report.as_of),
    activeVisits: report.active_visits,
    visits: report.visits,
    conversions: report.conversions,
    namedEvents: report.named_events,
    failedRequests: report.failed_requests,
  }));
