import { z } from 'zod';
import { PROJECT_ROLES, type ProjectSettings } from './project-settings';

const keySchema = z.object({ id: z.string(), created_at: z.string() });

export const projectSettingsResponseSchema = z
  .object({
    id: z.string(),
    account_id: z.string().nullable(),
    role: z.enum(PROJECT_ROLES).nullable(),
    name: z.string(),
    timezone: z.string(),
    conversion_event: z.string().nullable(),
    allowed_origins: z.array(z.string()),
    created_at: z.string(),
    first_event_at: z.string().nullable(),
    last_event_at: z.string().nullable(),
    event_retention_months: z.number().int(),
    public_keys: z.array(keySchema.extend({ key: z.string() })),
    secret_keys: z.array(keySchema),
    deletion_held_at: z.string().nullish(),
  })
  .transform((body): ProjectSettings => ({
    id: body.id,
    accountId: body.account_id,
    role: body.role,
    name: body.name,
    timezone: body.timezone,
    conversionEvent: body.conversion_event,
    allowedOrigins: body.allowed_origins,
    createdAt: body.created_at,
    firstEventAt: body.first_event_at,
    lastEventAt: body.last_event_at,
    eventRetentionMonths: body.event_retention_months,
    publicKeys: body.public_keys.map((key) => ({
      id: key.id,
      key: key.key,
      createdAt: key.created_at,
    })),
    secretKeys: body.secret_keys.map((key) => ({ id: key.id, createdAt: key.created_at })),
    deletionHeldAt: body.deletion_held_at ?? null,
  }));
