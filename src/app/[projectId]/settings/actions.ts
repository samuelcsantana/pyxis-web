'use server';

import { z } from 'zod';
import type { EmailPreferences } from '@/domain/email-preferences';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';

const choiceSchema = z.strictObject({ weeklyDigest: z.boolean() });

export async function chooseEmailPreferences(
  projectId: string,
  preferences: EmailPreferences,
): Promise<EmailPreferences> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = choiceSchema.safeParse(preferences);
  if (!parsed.success) {
    throw new Error('E-mail preferences need a weekly digest choice, on or off.');
  }
  return readOrSignIn(() => createEmailPreferencesService().choose(project.id, parsed.data));
}
