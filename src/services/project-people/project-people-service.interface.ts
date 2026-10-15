import type { AddPersonOutcome, ProjectPerson, RemovePersonOutcome } from '@/domain/project-people';

export interface IProjectPeopleService {
  list(projectId: string): Promise<readonly ProjectPerson[]>;
  add(projectId: string, email: string, locale: string): Promise<AddPersonOutcome>;
  remove(projectId: string, adminUserId: string): Promise<RemovePersonOutcome>;
}
