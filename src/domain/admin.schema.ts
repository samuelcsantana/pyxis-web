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
        first_event_at: z.string().nullable().optional(),
        last_event_at: z.string().nullable().optional(),
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
      firstEventAt: project.first_event_at,
      lastEventAt: project.last_event_at,
    })),
  }));
