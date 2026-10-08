import { z } from 'zod';

export const REQUEST_KINDS = ['writes', 'reads'] as const;

export const requestsResponseSchema = z
  .object({
    kind: z.enum(REQUEST_KINDS).optional(),
    routes: z.array(
      z.object({
        method: z.string(),
        route: z.string(),
        total: z.number(),
        failed: z.number(),
        statuses: z.array(z.object({ status: z.number(), count: z.number() })),
        median_duration_ms: z.number(),
        p95_duration_ms: z.number().optional(),
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
    days: z
      .array(
        z.object({
          date: z.string(),
          by_status_class: z.object({
            success: z.number(),
            client_error: z.number(),
            server_error: z.number(),
            no_response: z.number(),
          }),
        }),
      )
      .optional(),
    route_days: z
      .array(
        z.object({
          date: z.string(),
          total: z.number(),
          failed: z.number(),
          median_duration_ms: z.number().nullable(),
          p95_duration_ms: z.number().nullable(),
        }),
      )
      .nullable()
      .optional(),
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
