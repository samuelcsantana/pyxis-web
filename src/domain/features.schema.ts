import { z } from 'zod';

export const featuresResponseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      visits: z.number(),
      daily: z.array(z.number()),
    }),
  ),
});

export type FeaturesReport = z.output<typeof featuresResponseSchema>;
export type FeaturesWire = z.input<typeof featuresResponseSchema>;
