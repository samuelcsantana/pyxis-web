import { z } from 'zod';
import type { ConnectedApps } from './connections';

const WEB_PROTOCOL = /^https?$/;

export const connectedAppsResponseSchema = z
  .object({
    connector: z.object({
      open: z.boolean(),
      url: z.url({ protocol: WEB_PROTOCOL }).nullable(),
    }),
    connections: z.array(
      z.object({
        id: z.string(),
        client: z.object({ name: z.string(), host: z.string() }),
        created_at: z.string(),
        last_used_at: z.string(),
      }),
    ),
  })
  .transform((body): ConnectedApps => ({
    connectorUrl: body.connector.open ? body.connector.url : null,
    connections: body.connections.map((connection) => ({
      id: connection.id,
      client: connection.client,
      createdAt: connection.created_at,
      lastUsedAt: connection.last_used_at,
    })),
  }));
