import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type { AddPersonOutcome, ProjectPerson, RemovePersonOutcome } from '@/domain/project-people';
import {
  addedPersonResponseSchema,
  newPersonWire,
  projectPeopleResponseSchema,
} from '@/domain/project-people.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IProjectPeopleService } from './project-people-service.interface';

const STATUS_BAD_REQUEST = 400;

export const PEOPLE_ERROR_CODES = {
  limitReached: 'people_limit_reached',
  subscriptionRequired: 'subscription_required',
  ownerStays: 'owner_stays',
} as const;

function peoplePath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/people`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

export class HttpProjectPeopleService implements IProjectPeopleService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(projectId: string): Promise<readonly ProjectPerson[]> {
    return this.reader.get(peoplePath(projectId), projectPeopleResponseSchema);
  }

  async add(projectId: string, email: string, locale: string): Promise<AddPersonOutcome> {
    try {
      const { person, added } = await this.writer.post(
        peoplePath(projectId),
        newPersonWire(email, locale),
        addedPersonResponseSchema,
      );
      return { kind: 'added', person, invited: added };
    } catch (error) {
      if (refusedWith(error, PEOPLE_ERROR_CODES.limitReached)) {
        return { kind: 'limitReached' };
      }
      if (refusedWith(error, PEOPLE_ERROR_CODES.subscriptionRequired)) {
        return { kind: 'subscriptionRequired' };
      }
      if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
        return { kind: 'invalidEmail' };
      }
      throw error;
    }
  }

  async remove(projectId: string, adminUserId: string): Promise<RemovePersonOutcome> {
    try {
      await this.writer.delete(`${peoplePath(projectId)}/${encodeURIComponent(adminUserId)}`);
      return { kind: 'removed' };
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return { kind: 'removed' };
      }
      if (refusedWith(error, PEOPLE_ERROR_CODES.ownerStays)) {
        return { kind: 'ownerStays' };
      }
      throw error;
    }
  }
}
