'use server';

import { z } from 'zod';
import {
  type CreateProjectOutcome,
  MAX_ALLOWED_ORIGINS,
  MAX_PROJECT_NAME_LENGTH,
  type ProjectChanges,
} from '@/domain/project-management';
import { readOrSignIn } from '@/lib/current-admin';
import { createProjectManagementService } from '@/services/project-management/project-management-service.factory';

const accountIdSchema = z.uuid();
const newProjectSchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_PROJECT_NAME_LENGTH),
  allowedOrigins: z.array(z.string().min(1)).min(1).max(MAX_ALLOWED_ORIGINS),
  timezone: z.string().min(1),
  conversionEvent: z.string().min(1).nullable(),
});

export async function createProject(
  accountId: string,
  changes: ProjectChanges,
): Promise<CreateProjectOutcome> {
  const account = accountIdSchema.safeParse(accountId);
  if (!account.success) {
    throw new Error('A project is created in an account named by its id.');
  }
  const parsed = newProjectSchema.safeParse(changes);
  if (!parsed.success) {
    return { kind: 'invalid' };
  }
  return readOrSignIn(() => createProjectManagementService().create(account.data, parsed.data));
}
