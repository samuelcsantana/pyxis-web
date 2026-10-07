import { z } from 'zod';
import { comparisonOf } from './overview';

const kpiSchema = z.object({
  current: z.number(),
  previous: z.number(),
  daily: z.array(z.number()),
});

const failureCountSchema = z.object({ failed: z.number(), total: z.number() });

const previousDaySchema = z.object({
  date: z.string(),
  page_views: z.number(),
  events: z.number(),
  visits: z.number(),
  identified_users: z.number(),
  conversions: z.number().nullable(),
  converting_visits: z.number().nullable().optional(),
  write_errors: failureCountSchema,
});

export const overviewResponseSchema = z
  .object({
    kpis: z.object({
      visits: kpiSchema,
      identified_users: kpiSchema,
      conversions: kpiSchema.nullable(),
      converting_visits: kpiSchema.nullable().optional(),
      write_errors: z.object({
        current: failureCountSchema,
        previous: failureCountSchema,
        daily: z.array(failureCountSchema),
      }),
    }),
    days: z.array(z.object({ date: z.string(), page_views: z.number(), events: z.number() })),
    top_pages: z.array(z.object({ path: z.string(), views: z.number(), visits: z.number() })),
    top_events: z.array(z.object({ name: z.string(), count: z.number(), visits: z.number() })),
    comparison_cutoff: z.iso.time().nullable().optional(),
    previous_days: z.array(previousDaySchema).optional(),
  })
  .transform((body) => ({
    kpis: {
      visits: body.kpis.visits,
      identifiedUsers: body.kpis.identified_users,
      conversions: body.kpis.conversions,
      convertingVisits: body.kpis.converting_visits ?? null,
      writeErrors: body.kpis.write_errors,
    },
    days: body.days.map((day) => ({
      date: day.date,
      pageViews: day.page_views,
      events: day.events,
    })),
    topPages: body.top_pages,
    topEvents: body.top_events,
    comparison: comparisonOf(body.comparison_cutoff),
    previousDays:
      body.previous_days?.map((day) => ({
        date: day.date,
        pageViews: day.page_views,
        events: day.events,
        visits: day.visits,
        identifiedUsers: day.identified_users,
        conversions: day.conversions,
        convertingVisits: day.converting_visits ?? null,
        writeErrors: day.write_errors,
      })) ?? null,
  }));

export type OverviewReport = z.output<typeof overviewResponseSchema>;
export type OverviewWire = z.input<typeof overviewResponseSchema>;
