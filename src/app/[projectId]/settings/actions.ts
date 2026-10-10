'use server';

import { z } from 'zod';
import type { EmailPreferences } from '@/domain/email-preferences';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

const choiceSchema = z.strictObject({ weeklyDigest: z.boolean() });
const sessionIdSchema = z.uuid();

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

export async function endSession(projectId: string, sessionId: string): Promise<void> {
  await projectOrNotFound(projectId);
  const parsed = sessionIdSchema.safeParse(sessionId);
  if (!parsed.success) {
    throw new Error('A session is ended by its id.');
  }
  await readOrSignIn(() => createSessionsService().end(parsed.data));
}
