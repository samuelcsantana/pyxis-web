import type {
  CreateProjectKeyOutcome,
  CreateProjectOutcome,
  DeleteProjectOutcome,
  ProjectChanges,
  ProjectKeyKind,
  RevokeProjectKeyOutcome,
  SaveProjectOutcome,
} from '@/domain/project-management';

export interface IProjectManagementService {
  create(accountId: string, changes: ProjectChanges): Promise<CreateProjectOutcome>;
  update(projectId: string, changes: ProjectChanges): Promise<SaveProjectOutcome>;
  createKey(projectId: string, kind: ProjectKeyKind): Promise<CreateProjectKeyOutcome>;
  revokeKey(projectId: string, keyId: string): Promise<RevokeProjectKeyOutcome>;
  delete(projectId: string, confirmName: string): Promise<DeleteProjectOutcome>;
}
