import { z } from 'zod';
import type { ConnectionRequest } from './connection-requests';

const WEB_PROTOCOL = /^https?$/;

export const connectionRequestIdSchema = z.uuid();

export const connectionRequestResponseSchema = z
  .object({
    id: z.string(),
    client: z.object({ name: z.string(), host: z.string() }),
    redirect: z.object({ host: z.string(), loopback: z.boolean() }),
    scope: z.literal('read'),
    expires_at: z.string(),
    projects: z.array(z.object({ id: z.string(), name: z.string() })),
    connection_limit_reached: z.boolean(),
  })
  .transform((body): ConnectionRequest => ({
    id: body.id,
    client: body.client,
    redirect: body.redirect,
    expiresAt: body.expires_at,
    projects: body.projects,
    connectionLimitReached: body.connection_limit_reached,
  }));

export const connectionDecisionResponseSchema = z
  .object({ redirect_to: z.url({ protocol: WEB_PROTOCOL }) })
  .transform((body) => body.redirect_to);
