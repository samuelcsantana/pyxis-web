import type {
  CreateProjectKeyOutcome,
  CreateProjectOutcome,
  DeleteProjectOutcome,
  NewProjectChanges,
  ProjectChanges,
  ProjectKeyKind,
  RevokeProjectKeyOutcome,
  SaveProjectOutcome,
  SetCityOutcome,
  SetVisitorsOutcome,
} from '@/domain/project-management';

export interface IProjectManagementService {
  create(accountId: string, changes: NewProjectChanges): Promise<CreateProjectOutcome>;
  update(projectId: string, changes: ProjectChanges): Promise<SaveProjectOutcome>;
  setCity(projectId: string, cityEnabled: boolean): Promise<SetCityOutcome>;
  setVisitors(projectId: string, visitorsEnabled: boolean): Promise<SetVisitorsOutcome>;
  createKey(projectId: string, kind: ProjectKeyKind): Promise<CreateProjectKeyOutcome>;
  revokeKey(projectId: string, keyId: string): Promise<RevokeProjectKeyOutcome>;
  delete(projectId: string, confirmName: string): Promise<DeleteProjectOutcome>;
}
