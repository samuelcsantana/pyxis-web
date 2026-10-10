import { z } from 'zod';
import type { AdminSession } from './sessions';

const sessionSchema = z
  .object({
    id: z.string(),
    browser: z.string().nullable(),
    os: z.string().nullable(),
    device_type: z.string().nullable(),
    created_at: z.string(),
    last_used_at: z.string(),
    current: z.boolean(),
  })
  .transform((body): AdminSession => ({
    id: body.id,
    browser: body.browser,
    os: body.os,
    deviceType: body.device_type,
    createdAt: body.created_at,
    lastUsedAt: body.last_used_at,
    current: body.current,
  }));

export const sessionsResponseSchema = z
  .object({ sessions: z.array(sessionSchema) })
  .transform((body): readonly AdminSession[] => body.sessions);
