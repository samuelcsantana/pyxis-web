import { z } from 'zod';
import { goalListSchema } from './goals.schema';
import type { SharedProject } from './shared-project';

export const sharedProjectResponseSchema = z
  .object({
    project: z.object({
      name: z.string(),
      timezone: z.string(),
      currency: z.string(),
      city_enabled: z.boolean(),
      visitors_enabled: z.boolean(),
    }),
    goals: goalListSchema,
    expires_at: z.string().nullable(),
  })
  .transform((body): SharedProject => ({
    name: body.project.name,
    timezone: body.project.timezone,
    currency: body.project.currency,
    cityEnabled: body.project.city_enabled,
    visitorsEnabled: body.project.visitors_enabled,
    goals: body.goals,
    expiresAt: body.expires_at,
  }));
