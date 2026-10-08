import { z } from 'zod';
import { CHANNELS } from './acquisition';

const propertyValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const timelineResponseSchema = z
  .object({
    visits: z.array(
      z.object({
        session_id: z.string(),
        started_at: z.string(),
        ended_at: z.string(),
        device_type: z.string(),
        browser: z.string(),
        os: z.string(),
        country: z.string().nullable(),
        channel: z.enum(CHANNELS).nullable(),
        user_id: z.string().nullable().optional(),
        events: z.array(
          z.object({
            id: z.string(),
            occurred_at: z.string(),
            name: z.string(),
            path: z.string(),
            properties: z.record(z.string(), propertyValueSchema),
          }),
        ),
      }),
    ),
    next_before: z.string().nullable(),
  })
  .transform((body) => ({
    visits: body.visits.map((visit) => ({
      sessionId: visit.session_id,
      startedAt: visit.started_at,
      endedAt: visit.ended_at,
      deviceType: visit.device_type,
      browser: visit.browser,
      os: visit.os,
      country: visit.country,
      channel: visit.channel,
      events: visit.events.map((event) => ({
        id: event.id,
        occurredAt: event.occurred_at,
        name: event.name,
        path: event.path,
        properties: event.properties,
      })),
    })),
    nextBefore: body.next_before,
  }));

export type TimelineReport = z.output<typeof timelineResponseSchema>;
export type TimelineWire = z.input<typeof timelineResponseSchema>;
