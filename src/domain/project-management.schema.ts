import { z } from 'zod';
import {
  type CreatedProject,
  type CreatedProjectKey,
  PROJECT_KEY_KINDS,
  type ProjectChanges,
} from './project-management';

export const managedProjectResponseSchema = z
  .object({ id: z.string() })
  .transform((): void => undefined);

export const createdProjectKeyResponseSchema = z
  .object({ id: z.string(), kind: z.enum(PROJECT_KEY_KINDS), key: z.string() })
  .transform((body): CreatedProjectKey => ({ id: body.id, kind: body.kind, key: body.key }));

export const deletedProjectResponseSchema = z
  .object({ project_id: z.string() })
  .transform((): void => undefined);

export function cityChangeWire(cityEnabled: boolean) {
  return { city_enabled: cityEnabled };
}

export function projectChangesWire(changes: ProjectChanges) {
  return {
    name: changes.name,
    allowed_origins: changes.allowedOrigins,
    timezone: changes.timezone,
    conversion_event: changes.conversionEvent,
  };
}

export const createdProjectResponseSchema = z
  .object({ project_id: z.string(), public_key: z.object({ id: z.string(), key: z.string() }) })
  .transform((body): CreatedProject => ({
    projectId: body.project_id,
    publicKey: body.public_key.key,
  }));

export function newProjectWire(changes: ProjectChanges) {
  return {
    name: changes.name,
    allowed_origins: changes.allowedOrigins,
    timezone: changes.timezone,
    ...(changes.conversionEvent === null ? {} : { conversion_event: changes.conversionEvent }),
  };
}

export function projectDeletionWire(confirmName: string) {
  return { confirm_name: confirmName };
}
