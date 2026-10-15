import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type {
  CreateProjectKeyOutcome,
  CreateProjectOutcome,
  DeleteProjectOutcome,
  ProjectChanges,
  ProjectKeyKind,
  RevokeProjectKeyOutcome,
  SaveProjectOutcome,
} from '@/domain/project-management';
import {
  createdProjectKeyResponseSchema,
  createdProjectResponseSchema,
  newProjectWire,
  deletedProjectResponseSchema,
  managedProjectResponseSchema,
  projectChangesWire,
  projectDeletionWire,
} from '@/domain/project-management.schema';
import type { ApiWriter } from '../api-writer';
import type { IProjectManagementService } from './project-management-service.interface';

export const API_ERROR_CODES = {
  subscriptionRequired: 'subscription_required',
  invalidSettings: 'invalid_project_settings',
  keyLimitReached: 'key_limit_reached',
  lastPublicKey: 'last_public_key',
  nameMismatch: 'project_name_mismatch',
  projectLimitReached: 'project_limit_reached',
} as const;

function projectPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

export class HttpProjectManagementService implements IProjectManagementService {
  constructor(private readonly writer: ApiWriter) {}

  async create(accountId: string, changes: ProjectChanges): Promise<CreateProjectOutcome> {
    try {
      const project = await this.writer.post(
        `/v1/accounts/${encodeURIComponent(accountId)}/projects`,
        newProjectWire(changes),
        createdProjectResponseSchema,
      );
      return { kind: 'created', project };
    } catch (error) {
      if (refusedWith(error, API_ERROR_CODES.projectLimitReached)) {
        return { kind: 'limitReached' };
      }
      if (refusedWith(error, API_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      if (refusedWith(error, API_ERROR_CODES.invalidSettings)) {
        return { kind: 'invalid' };
      }
      throw error;
    }
  }

  async update(projectId: string, changes: ProjectChanges): Promise<SaveProjectOutcome> {
    try {
      await this.writer.patch(
        projectPath(projectId),
        projectChangesWire(changes),
        managedProjectResponseSchema,
      );
      return { kind: 'saved' };
    } catch (error) {
      if (refusedWith(error, API_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      if (refusedWith(error, API_ERROR_CODES.invalidSettings)) {
        return { kind: 'invalid' };
      }
      throw error;
    }
  }

  async createKey(projectId: string, kind: ProjectKeyKind): Promise<CreateProjectKeyOutcome> {
    try {
      const key = await this.writer.post(
        `${projectPath(projectId)}/keys`,
        { kind },
        createdProjectKeyResponseSchema,
      );
      return { kind: 'created', key };
    } catch (error) {
      if (refusedWith(error, API_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      if (refusedWith(error, API_ERROR_CODES.keyLimitReached)) {
        return { kind: 'tooMany' };
      }
      throw error;
    }
  }

  async revokeKey(projectId: string, keyId: string): Promise<RevokeProjectKeyOutcome> {
    try {
      await this.writer.delete(`${projectPath(projectId)}/keys/${encodeURIComponent(keyId)}`);
      return { kind: 'revoked' };
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return { kind: 'revoked' };
      }
      if (refusedWith(error, API_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      if (refusedWith(error, API_ERROR_CODES.lastPublicKey)) {
        return { kind: 'lastPublicKey' };
      }
      throw error;
    }
  }

  async delete(projectId: string, confirmName: string): Promise<DeleteProjectOutcome> {
    try {
      await this.writer.post(
        `${projectPath(projectId)}/delete`,
        projectDeletionWire(confirmName),
        deletedProjectResponseSchema,
      );
      return { kind: 'deleted' };
    } catch (error) {
      if (refusedWith(error, API_ERROR_CODES.nameMismatch)) {
        return { kind: 'nameMismatch' };
      }
      throw error;
    }
  }
}
