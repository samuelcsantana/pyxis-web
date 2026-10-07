import { z } from 'zod';

export const requestsResponseSchema = z
  .object({
    routes: z.array(
      z.object({
        method: z.string(),
        route: z.string(),
        total: z.number(),
        failed: z.number(),
        statuses: z.array(z.object({ status: z.number(), count: z.number() })),
        median_duration_ms: z.number(),
        screens: z.array(z.object({ path: z.string(), failed: z.number() })),
        recent_failures: z.array(
          z.object({
            occurred_at: z.string(),
            status: z.number(),
            error_code: z.string().nullable(),
            session_id: z.string(),
          }),
        ),
      }),
    ),
  })
  .transform((body) => ({
    routes: body.routes.map((route) => ({
      method: route.method,
      route: route.route,
      total: route.total,
      failed: route.failed,
      statuses: route.statuses,
      medianDurationMs: route.median_duration_ms,
      screens: route.screens,
      recentFailures: route.recent_failures.map((failure) => ({
        occurredAt: failure.occurred_at,
        status: failure.status,
        errorCode: failure.error_code,
        sessionId: failure.session_id,
      })),
    })),
  }));

export type RequestsReport = z.output<typeof requestsResponseSchema>;
export type RequestsWire = z.input<typeof requestsResponseSchema>;
