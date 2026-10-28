import { z } from 'zod';

const numericSummarySchema = z.object({
  events: z.number(),
  median: z.number().nullable(),
  p25: z.number().nullable(),
  p75: z.number().nullable(),
});

export const propertySummaryResponseSchema = z
  .object({
    name: z.string(),
    key: z.string(),
    by: z.string().nullable(),
    overall: numericSummarySchema,
    groups: z.array(numericSummarySchema.extend({ value: z.string() })),
    other_count: z.number(),
  })
  .transform((body) => ({
    name: body.name,
    key: body.key,
    by: body.by,
    overall: body.overall,
    groups: body.groups,
    otherCount: body.other_count,
  }));

export type PropertySummaryReport = z.output<typeof propertySummaryResponseSchema>;
export type PropertySummaryWire = z.input<typeof propertySummaryResponseSchema>;
