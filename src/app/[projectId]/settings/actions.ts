'use server';

import { revalidatePath } from 'next/cache';
import { CURRENCY_CODE_PATTERN } from '@/domain/currency';
import { z } from 'zod';
import {
  ACCESS_TOKEN_LIFETIMES,
  type CreateAccessTokenOutcome,
  MAX_ACCESS_TOKEN_NAME_LENGTH,
  type NewAccessToken,
} from '@/domain/access-tokens';
import {
  EMAIL_PREFERENCES,
  type EmailPreferenceChoice,
  type EmailPreferences,
} from '@/domain/email-preferences';
import {
  type DeleteGoalOutcome,
  GOAL_KINDS,
  type GoalChanges,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_PATH_LENGTH,
  type SaveGoalOutcome,
} from '@/domain/goals';
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
  type SetVisitorsOutcome,
} from '@/domain/project-management';
import {
  type CreateShareLinkOutcome,
  MAX_SHARE_LINK_NAME_LENGTH,
  type NewShareLink,
  type SetShareLinkPasswordOutcome,
  SHARE_LINK_LIFETIMES,
  shareLinkRequestOf,
  sharePasswordProblem,
} from '@/domain/share-links';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createConnectionsService } from '@/services/connections/connections-service.factory';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createProjectManagementService } from '@/services/project-management/project-management-service.factory';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import { createShareLinksService } from '@/services/share-links/share-links-service.factory';
import { createSlackWebhookService } from '@/services/slack/slack-webhook-service.factory';
import {
  type SaveSlackWebhookOutcome,
  slackWebhookProblem,
  type TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';
import { currentLocale } from '@/i18n/current-locale';
import type { AddPersonOutcome, RemovePersonOutcome } from '@/domain/project-people';
import type { RequestExportOutcome } from '@/domain/exports';
import { createExportsService } from '@/services/exports/exports-service.factory';
import { createGoalsService } from '@/services/goals/goals-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

const choiceSchema = z.strictObject({ preference: z.enum(EMAIL_PREFERENCES), on: z.boolean() });
const switchedOnSchema = z.boolean();
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
  currency: z.string().regex(CURRENCY_CODE_PATTERN),
});
const projectKeyKindSchema = z.enum(PROJECT_KEY_KINDS);
const projectKeyIdSchema = z.uuid();
const confirmNameSchema = z.string().min(1).max(MAX_PROJECT_NAME_LENGTH);
const MAX_EMAIL_LENGTH = 254;
const personEmailSchema = z.email().max(MAX_EMAIL_LENGTH);
const adminUserIdSchema = z.uuid();
const goalChangesSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_GOAL_NAME_LENGTH),
  kind: z.enum(GOAL_KINDS),
  target: z.string().trim().min(1).max(MAX_GOAL_PATH_LENGTH),
});
const goalIdSchema = z.uuid();
const sharePasswordSchema = z
  .string()
  .refine((password) => sharePasswordProblem(password) === null)
  .nullable();
const newShareLinkSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_SHARE_LINK_NAME_LENGTH),
  expiry: z.union([z.literal('never'), z.literal([...SHARE_LINK_LIFETIMES])]),
  password: sharePasswordSchema,
});
const shareLinkIdSchema = z.uuid();

export async function chooseEmailPreferences(
  projectId: string,
  choice: EmailPreferenceChoice,
): Promise<EmailPreferences> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = choiceSchema.safeParse(choice);
  if (!parsed.success) {
    throw new Error('An e-mail preference choice names one e-mail and turns it on or off.');
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
  const parsed = switchedOnSchema.safeParse(cityEnabled);
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

export async function setProjectVisitors(
  projectId: string,
  visitorsEnabled: boolean,
): Promise<SetVisitorsOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = switchedOnSchema.safeParse(visitorsEnabled);
  if (!parsed.success) {
    throw new Error('Unique visitors are turned on or off with a boolean.');
  }
  const outcome = await readOrSignIn(() =>
    createProjectManagementService().setVisitors(project.id, parsed.data),
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

export async function createGoal(
  projectId: string,
  changes: GoalChanges,
): Promise<SaveGoalOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = goalChangesSchema.safeParse(changes);
  if (!parsed.success) {
    return { kind: 'invalid' };
  }
  const outcome = await readOrSignIn(() => createGoalsService().create(project.id, parsed.data));
  if (outcome.kind === 'saved') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
}

export async function updateGoal(
  projectId: string,
  goalId: string,
  changes: GoalChanges,
): Promise<SaveGoalOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const id = goalIdSchema.safeParse(goalId);
  const parsed = goalChangesSchema.safeParse(changes);
  if (!id.success || !parsed.success) {
    return { kind: 'invalid' };
  }
  const outcome = await readOrSignIn(() =>
    createGoalsService().update(project.id, id.data, parsed.data),
  );
  if (outcome.kind === 'saved') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
}

export async function deleteGoal(projectId: string, goalId: string): Promise<DeleteGoalOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = goalIdSchema.safeParse(goalId);
  if (!parsed.success) {
    throw new Error('A goal is deleted by its id.');
  }
  const outcome = await readOrSignIn(() => createGoalsService().remove(project.id, parsed.data));
  if (outcome.kind === 'deleted') {
    revalidatePath(EVERY_PROJECT_SCREEN, 'layout');
  }
  return outcome;
}

export async function createShareLink(
  projectId: string,
  link: NewShareLink,
): Promise<CreateShareLinkOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = newShareLinkSchema.safeParse(link);
  if (!parsed.success) {
    throw new Error(
      'A share link needs a name, an expiry of never, 7, 30, 90 or 365 days, ' +
        'and no password or one of 8 to 128 characters.',
    );
  }
  return readOrSignIn(() =>
    createShareLinksService().create(project.id, shareLinkRequestOf(parsed.data, new Date())),
  );
}

export async function setShareLinkPassword(
  projectId: string,
  linkId: string,
  password: string | null,
): Promise<SetShareLinkPasswordOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const id = shareLinkIdSchema.safeParse(linkId);
  const chosen = sharePasswordSchema.safeParse(password);
  if (!id.success || !chosen.success) {
    throw new Error('A share link password is set by the link id, to 8 to 128 characters or none.');
  }
  return readOrSignIn(() =>
    createShareLinksService().setPassword(project.id, id.data, chosen.data),
  );
}

export async function revokeShareLink(projectId: string, linkId: string): Promise<void> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = shareLinkIdSchema.safeParse(linkId);
  if (!parsed.success) {
    throw new Error('A share link is revoked by its id.');
  }
  await readOrSignIn(() => createShareLinksService().revoke(project.id, parsed.data));
}

const slackWebhookUrlSchema = z.string().refine((url) => slackWebhookProblem(url) === null);

export async function saveSlackWebhook(
  projectId: string,
  url: string,
): Promise<SaveSlackWebhookOutcome> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = slackWebhookUrlSchema.safeParse(url);
  if (!parsed.success) {
    return { kind: 'invalid' };
  }
  return readOrSignIn(() => createSlackWebhookService().save(project.id, parsed.data));
}

export async function testSlackWebhook(projectId: string): Promise<TestSlackWebhookOutcome> {
  const { project } = await projectOrNotFound(projectId);
  return readOrSignIn(() => createSlackWebhookService().test(project.id));
}

export async function removeSlackWebhook(projectId: string): Promise<void> {
  const { project } = await projectOrNotFound(projectId);
  await readOrSignIn(() => createSlackWebhookService().remove(project.id));
}
