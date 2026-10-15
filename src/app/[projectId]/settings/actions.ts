'use server';

import { z } from 'zod';
import {
  ACCESS_TOKEN_LIFETIMES,
  type CreateAccessTokenOutcome,
  MAX_ACCESS_TOKEN_NAME_LENGTH,
  type NewAccessToken,
} from '@/domain/access-tokens';
import type { EmailPreferences } from '@/domain/email-preferences';
import {
  type CreateProjectKeyOutcome,
  type DeleteProjectOutcome,
  MAX_ALLOWED_ORIGINS,
  MAX_PROJECT_NAME_LENGTH,
  PROJECT_KEY_KINDS,
  type ProjectChanges,
  type ProjectKeyKind,
  type RevokeProjectKeyOutcome,
  type SaveProjectOutcome,
} from '@/domain/project-management';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createConnectionsService } from '@/services/connections/connections-service.factory';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createProjectManagementService } from '@/services/project-management/project-management-service.factory';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import { currentLocale } from '@/i18n/current-locale';
import type { AddPersonOutcome, RemovePersonOutcome } from '@/domain/project-people';
import type { RequestExportOutcome } from '@/domain/exports';
import { createExportsService } from '@/services/exports/exports-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

const choiceSchema = z.strictObject({ weeklyDigest: z.boolean() });
const sessionIdSchema = z.uuid();
const newAccessTokenSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_ACCESS_TOKEN_NAME_LENGTH),
  lifetimeDays: z.literal([...ACCESS_TOKEN_LIFETIMES]),
});
const accessTokenIdSchema = z.uuid();
const connectionIdSchema = z.uuid();
const projectChangesSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_PROJECT_NAME_LENGTH),
  allowedOrigins: z.array(z.string().min(1)).min(1).max(MAX_ALLOWED_ORIGINS),
  timezone: z.string().min(1),
  conversionEvent: z.string().min(1).nullable(),
});
const projectKeyKindSchema = z.enum(PROJECT_KEY_KINDS);
const projectKeyIdSchema = z.uuid();
const confirmNameSchema = z.string().min(1).max(MAX_PROJECT_NAME_LENGTH);
const MAX_EMAIL_LENGTH = 254;
const personEmailSchema = z.email().max(MAX_EMAIL_LENGTH);
const adminUserIdSchema = z.uuid();

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

export async function revokeConnection(projectId: string, connectionId: string): Promise<void> {
  await projectOrNotFound(projectId);
  const parsed = connectionIdSchema.safeParse(connectionId);
  if (!parsed.success) {
    throw new Error('A connected app is revoked by its id.');
  }
  await readOrSignIn(() => createConnectionsService().revoke(parsed.data));
}

export async function updateProject(
  projectId: string,
  changes: ProjectChanges,
): Promise<SaveProjectOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = projectChangesSchema.safeParse(changes);
  if (!parsed.success) {
    return { kind: 'invalid' };
  }
  return readOrSignIn(() => createProjectManagementService().update(project.id, parsed.data));
}

export async function createProjectKey(
  projectId: string,
  kind: ProjectKeyKind,
): Promise<CreateProjectKeyOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = projectKeyKindSchema.safeParse(kind);
  if (!parsed.success) {
    throw new Error('A project key is public or secret.');
  }
  return readOrSignIn(() => createProjectManagementService().createKey(project.id, parsed.data));
}

export async function revokeProjectKey(
  projectId: string,
  keyId: string,
): Promise<RevokeProjectKeyOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = projectKeyIdSchema.safeParse(keyId);
  if (!parsed.success) {
    throw new Error('A project key is revoked by its id.');
  }
  return readOrSignIn(() => createProjectManagementService().revokeKey(project.id, parsed.data));
}

export async function deleteProject(
  projectId: string,
  confirmName: string,
): Promise<DeleteProjectOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = confirmNameSchema.safeParse(confirmName);
  if (!parsed.success) {
    return { kind: 'nameMismatch' };
  }
  return readOrSignIn(() => createProjectManagementService().delete(project.id, parsed.data));
}

export async function addProjectPerson(
  projectId: string,
  email: string,
): Promise<AddPersonOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = personEmailSchema.safeParse(email.trim());
  if (!parsed.success) {
    return { kind: 'invalidEmail' };
  }
  const locale = await currentLocale();
  return readOrSignIn(() => createProjectPeopleService().add(project.id, parsed.data, locale));
}

export async function removeProjectPerson(
  projectId: string,
  adminUserId: string,
): Promise<RemovePersonOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = adminUserIdSchema.safeParse(adminUserId);
  if (!parsed.success) {
    throw new Error('A person is removed by their id.');
  }
  return readOrSignIn(() => createProjectPeopleService().remove(project.id, parsed.data));
}

export async function requestProjectExport(projectId: string): Promise<RequestExportOutcome> {
  const { project } = await projectOrNotFound(projectId);
  return readOrSignIn(() => createExportsService().request(project.id));
}
