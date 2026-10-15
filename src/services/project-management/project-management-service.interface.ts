import type {
  CreateProjectKeyOutcome,
  DeleteProjectOutcome,
  ProjectChanges,
  ProjectKeyKind,
  RevokeProjectKeyOutcome,
  SaveProjectOutcome,
} from '@/domain/project-management';

export interface IProjectManagementService {
  update(projectId: string, changes: ProjectChanges): Promise<SaveProjectOutcome>;
  createKey(projectId: string, kind: ProjectKeyKind): Promise<CreateProjectKeyOutcome>;
  revokeKey(projectId: string, keyId: string): Promise<RevokeProjectKeyOutcome>;
  delete(projectId: string, confirmName: string): Promise<DeleteProjectOutcome>;
}
