import type { AddPersonOutcome, ProjectPerson, RemovePersonOutcome } from '@/domain/project-people';
import { projectPeopleResponseSchema } from '@/domain/project-people.schema';
import { DEMO_ME_RESPONSE } from '../projects/mock-projects-service';
import type { IProjectPeopleService } from './project-people-service.interface';

export const DEMO_PEOPLE_IDS = {
  owner: '8e1a3c5d-7f9b-4a2c-9d4e-6f8a0b2c4d6e',
  member: '9f2b4d6e-8a0c-4b3d-8e5f-7a9b1c3d5e7f',
  added: 'a03c5e7f-9b1d-4c4e-9f6a-8b0c2d4e6f8a',
} as const;

const OWNER_ADDED_AT = '2025-01-06T08:00:00.000Z';
const MEMBER_ADDED_AT = '2025-03-10T14:30:00.000Z';

export function demoPeopleWire() {
  return {
    people: [
      {
        admin_user_id: DEMO_PEOPLE_IDS.owner,
        email: DEMO_ME_RESPONSE.email,
        role: 'owner',
        added_at: OWNER_ADDED_AT,
      },
      {
        admin_user_id: DEMO_PEOPLE_IDS.member,
        email: 'analyst@example.com',
        role: 'member',
        added_at: MEMBER_ADDED_AT,
      },
    ],
  };
}

export class MockProjectPeopleService implements IProjectPeopleService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<readonly ProjectPerson[]> {
    return Promise.resolve(projectPeopleResponseSchema.parse(demoPeopleWire()));
  }

  add(_projectId: string, email: string): Promise<AddPersonOutcome> {
    return Promise.resolve({
      kind: 'added',
      invited: true,
      person: {
        adminUserId: DEMO_PEOPLE_IDS.added,
        email: email.trim().toLowerCase(),
        role: 'member',
        addedAt: this.now().toISOString(),
      },
    });
  }

  remove(_projectId: string, adminUserId: string): Promise<RemovePersonOutcome> {
    return Promise.resolve(
      adminUserId === DEMO_PEOPLE_IDS.owner ? { kind: 'ownerStays' } : { kind: 'removed' },
    );
  }
}
