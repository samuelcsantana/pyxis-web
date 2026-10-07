import { z } from 'zod';

const kpiSchema = z.object({
  current: z.number(),
  previous: z.number(),
  daily: z.array(z.number()),
});

const failureCountSchema = z.object({ failed: z.number(), total: z.number() });

export const overviewResponseSchema = z
  .object({
    kpis: z.object({
      visits: kpiSchema,
      identified_users: kpiSchema,
      conversions: kpiSchema.nullable(),
      write_errors: z.object({
        current: failureCountSchema,
        previous: failureCountSchema,
        daily: z.array(failureCountSchema),
      }),
    }),
    days: z.array(z.object({ date: z.string(), page_views: z.number(), events: z.number() })),
    top_pages: z.array(z.object({ path: z.string(), views: z.number(), visits: z.number() })),
    top_events: z.array(z.object({ name: z.string(), count: z.number(), visits: z.number() })),
  })
  .transform((body) => ({
    kpis: {
      visits: body.kpis.visits,
      identifiedUsers: body.kpis.identified_users,
      conversions: body.kpis.conversions,
      writeErrors: body.kpis.write_errors,
    },
    days: body.days.map((day) => ({
      date: day.date,
      pageViews: day.page_views,
      events: day.events,
    })),
    topPages: body.top_pages,
    topEvents: body.top_events,
  }));

export type OverviewReport = z.output<typeof overviewResponseSchema>;
export type OverviewWire = z.input<typeof overviewResponseSchema>;
