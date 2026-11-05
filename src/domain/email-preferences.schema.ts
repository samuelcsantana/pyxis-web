import { z } from 'zod';
import { type EmailPreferences, emailPreferencesOf } from './email-preferences';

export const emailPreferencesResponseSchema = z
  .object({
    weekly_digest: z.boolean(),
    no_events_alert: z.boolean(),
    failed_writes_alert: z.boolean(),
    conversion_drop_alert: z.boolean(),
  })
  .transform((body): EmailPreferences => emailPreferencesOf(body));
