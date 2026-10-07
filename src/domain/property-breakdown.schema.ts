import { z } from 'zod';

export const propertyBreakdownResponseSchema = z
  .object({
    name: z.string(),
    events: z.number(),
    keys: z.array(
      z.object({
        key: z.string(),
        events: z.number(),
        values: z.array(z.object({ value: z.string(), count: z.number(), visits: z.number() })),
        other_count: z.number(),
      }),
    ),
  })
  .transform((body) => ({
    name: body.name,
    events: body.events,
    keys: body.keys.map((key) => ({
      key: key.key,
      events: key.events,
      values: key.values,
      otherCount: key.other_count,
    })),
  }));

export type PropertyBreakdownReport = z.output<typeof propertyBreakdownResponseSchema>;
export type PropertyBreakdownWire = z.input<typeof propertyBreakdownResponseSchema>;
