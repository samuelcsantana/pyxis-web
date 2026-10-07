import { z } from 'zod';
import type { Admin } from './admin';

export const meResponseSchema = z
  .object({
    email: z.string(),
    projects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        timezone: z.string(),
        conversion_event: z.string().nullable(),
      }),
    ),
  })
  .transform((body): Admin => ({
    email: body.email,
    projects: body.projects.map((project) => ({
      id: project.id,
      name: project.name,
      timezone: project.timezone,
      conversionEvent: project.conversion_event,
    })),
  }));
