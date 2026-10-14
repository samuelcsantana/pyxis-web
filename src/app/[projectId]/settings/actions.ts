'use server';

import { z } from 'zod';
import {
  ACCESS_TOKEN_LIFETIMES,
  type CreateAccessTokenOutcome,
  MAX_ACCESS_TOKEN_NAME_LENGTH,
  type NewAccessToken,
} from '@/domain/access-tokens';
import type { EmailPreferences } from '@/domain/email-preferences';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

const choiceSchema = z.strictObject({ weeklyDigest: z.boolean() });
const sessionIdSchema = z.uuid();
const newAccessTokenSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_ACCESS_TOKEN_NAME_LENGTH),
  lifetimeDays: z.literal([...ACCESS_TOKEN_LIFETIMES]),
});
const accessTokenIdSchema = z.uuid();

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

export async function createAccessToken(
  projectId: string,
  request: NewAccessToken,
): Promise<CreateAccessTokenOutcome> {
  await projectOrNotFound(projectId);
  const parsed = newAccessTokenSchema.safeParse(request);
  if (!parsed.success) {
    throw new Error('An access token needs a name and a lifetime of 30, 90 or 365 days.');
  }
  return readOrSignIn(() => createAccessTokensService().create(parsed.data));
}

export async function revokeAccessToken(projectId: string, tokenId: string): Promise<void> {
  await projectOrNotFound(projectId);
  const parsed = accessTokenIdSchema.safeParse(tokenId);
  if (!parsed.success) {
    throw new Error('An access token is revoked by its id.');
  }
  await readOrSignIn(() => createAccessTokensService().revoke(parsed.data));
}
