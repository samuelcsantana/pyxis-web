'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
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
  type SetCityOutcome,
} from '@/domain/project-management';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createProjectManagementService } from '@/services/project-management/project-management-service.factory';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import { currentLocale } from '@/i18n/current-locale';
import type { AddPersonOutcome, RemovePersonOutcome } from '@/domain/project-people';
import type { RequestExportOutcome } from '@/domain/exports';
import { createExportsService } from '@/services/exports/exports-service.factory';

const choiceSchema = z.strictObject({ weeklyDigest: z.boolean() });
const cityEnabledSchema = z.boolean();
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

const EVERY_PROJECT_SCREEN = '/[projectId]';

export async function updateProject(
  projectId: string,
  changes: ProjectChanges,
): Promise<SaveProjectOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = projectChangesSchema.safeParse(changes);
  if (!parsed.success) {
    return { kind: 'invalid' };
  }
  const outcome = await readOrSignIn(() =>
    createProjectManagementService().update(project.id, parsed.data),
  );
  if (outcome.kind === 'saved') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
}

export async function setProjectCity(
  projectId: string,
  cityEnabled: boolean,
): Promise<SetCityOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = cityEnabledSchema.safeParse(cityEnabled);
  if (!parsed.success) {
    throw new Error('The city is turned on or off with a boolean.');
  }
  const outcome = await readOrSignIn(() =>
    createProjectManagementService().setCity(project.id, parsed.data),
  );
  if (outcome.kind === 'saved') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
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
  const outcome = await readOrSignIn(() =>
    createProjectManagementService().delete(project.id, parsed.data),
  );
  if (outcome.kind === 'deleted') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
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
