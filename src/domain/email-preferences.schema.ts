import { z } from 'zod';
import type { EmailPreferences } from './email-preferences';

export const emailPreferencesResponseSchema = z
  .object({ weekly_digest: z.boolean() })
  .transform((body): EmailPreferences => ({ weeklyDigest: body.weekly_digest }));
