import { z } from 'zod';
import { CHANNELS } from './acquisition';

export const visitsResponseSchema = z
  .object({
    visits: z.array(
      z.object({
        session_id: z.string(),
        started_at: z.string(),
        ended_at: z.string(),
        entry_path: z.string().nullable(),
        page_views: z.number(),
        highlights: z.array(z.string()),
        failed_requests: z.number(),
        device_type: z.string(),
        browser: z.string(),
        os: z.string(),
        country: z.string().nullable(),
        channel: z.enum(CHANNELS).nullable(),
        user_id: z.string().nullable(),
        source: z.string().nullable().optional(),
        campaign: z.string().nullable().optional(),
      }),
    ),
    next_cursor: z.string().nullable(),
    total: z.number().optional(),
  })
  .transform((body) => ({
    visits: body.visits.map((visit) => ({
      sessionId: visit.session_id,
      startedAt: visit.started_at,
      endedAt: visit.ended_at,
      entryPath: visit.entry_path,
      pageViews: visit.page_views,
      highlights: visit.highlights,
      failedRequests: visit.failed_requests,
      deviceType: visit.device_type,
      browser: visit.browser,
      os: visit.os,
      country: visit.country,
      channel: visit.channel,
      userId: visit.user_id,
    })),
    nextCursor: body.next_cursor,
    total: body.total ?? null,
  }));

export type VisitsReport = z.output<typeof visitsResponseSchema>;
export type VisitsWire = z.input<typeof visitsResponseSchema>;
