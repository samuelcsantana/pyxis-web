import type {
  AllowConnectionOutcome,
  ConnectionRequest,
  DenyConnectionOutcome,
} from '@/domain/connection-requests';
import {
  connectionDecisionResponseSchema,
  connectionRequestResponseSchema,
} from '@/domain/connection-requests.schema';
import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IConnectionRequestsService } from './connection-requests-service.interface';

export const CONNECTION_REQUESTS_PATH = '/v1/oauth/requests';
const STATUS_CONFLICT = 409;
const NO_BODY = {};

function requestPath(requestId: string): string {
  return `${CONNECTION_REQUESTS_PATH}/${encodeURIComponent(requestId)}`;
}

export class HttpConnectionRequestsService implements IConnectionRequestsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  async find(requestId: string): Promise<ConnectionRequest | null> {
    try {
      return await this.reader.get(requestPath(requestId), connectionRequestResponseSchema);
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async allow(requestId: string): Promise<AllowConnectionOutcome> {
    try {
      return await this.decide(requestId, 'approve');
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === STATUS_CONFLICT) {
        return { kind: 'tooMany' };
      }
      throw error;
    }
  }

  deny(requestId: string): Promise<DenyConnectionOutcome> {
    return this.decide(requestId, 'deny');
  }

  private async decide(
    requestId: string,
    decision: 'approve' | 'deny',
  ): Promise<DenyConnectionOutcome> {
    try {
      const url = await this.writer.post(
        `${requestPath(requestId)}/${decision}`,
        NO_BODY,
        connectionDecisionResponseSchema,
      );
      return { kind: 'redirect', url };
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return { kind: 'gone' };
      }
      throw error;
    }
  }
}
