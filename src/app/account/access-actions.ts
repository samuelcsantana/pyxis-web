'use server';

import { z } from 'zod';
import {
  ACCESS_TOKEN_LIFETIMES,
  type CreateAccessTokenOutcome,
  MAX_ACCESS_TOKEN_NAME_LENGTH,
  type NewAccessToken,
} from '@/domain/access-tokens';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createConnectionsService } from '@/services/connections/connections-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

const sessionIdSchema = z.uuid();
const newAccessTokenSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_ACCESS_TOKEN_NAME_LENGTH),
  lifetimeDays: z.literal([...ACCESS_TOKEN_LIFETIMES]),
});
const accessTokenIdSchema = z.uuid();
const connectionIdSchema = z.uuid();

export async function endSession(sessionId: string): Promise<void> {
  const parsed = sessionIdSchema.safeParse(sessionId);
  if (!parsed.success) {
    throw new Error('A session is ended by its id.');
  }
  await readOrSignIn(() => createSessionsService().end(parsed.data));
}

export async function createAccessToken(
  request: NewAccessToken,
): Promise<CreateAccessTokenOutcome> {
  const parsed = newAccessTokenSchema.safeParse(request);
  if (!parsed.success) {
    throw new Error('An access token needs a name and a lifetime of 30, 90 or 365 days.');
  }
  return readOrSignIn(() => createAccessTokensService().create(parsed.data));
}

export async function revokeAccessToken(tokenId: string): Promise<void> {
  const parsed = accessTokenIdSchema.safeParse(tokenId);
  if (!parsed.success) {
    throw new Error('An access token is revoked by its id.');
  }
  await readOrSignIn(() => createAccessTokensService().revoke(parsed.data));
}

export async function revokeConnection(connectionId: string): Promise<void> {
  const parsed = connectionIdSchema.safeParse(connectionId);
  if (!parsed.success) {
    throw new Error('A connected app is revoked by its id.');
  }
  await readOrSignIn(() => createConnectionsService().revoke(parsed.data));
}
