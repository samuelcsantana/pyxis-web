import type { AccessToken, CreateAccessTokenOutcome, NewAccessToken } from '@/domain/access-tokens';
import {
  accessTokensResponseSchema,
  createdAccessTokenResponseSchema,
  newAccessTokenWire,
} from '@/domain/access-tokens.schema';
import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IAccessTokensService } from './access-tokens-service.interface';

export const ACCESS_TOKENS_PATH = '/v1/me/tokens';
const STATUS_CONFLICT = 409;

export class HttpAccessTokensService implements IAccessTokensService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(): Promise<readonly AccessToken[]> {
    return this.reader.get(ACCESS_TOKENS_PATH, accessTokensResponseSchema);
  }

  async create(request: NewAccessToken): Promise<CreateAccessTokenOutcome> {
    try {
      const token = await this.writer.post(
        ACCESS_TOKENS_PATH,
        newAccessTokenWire(request),
        createdAccessTokenResponseSchema,
      );
      return { kind: 'created', token };
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === STATUS_CONFLICT) {
        return { kind: 'tooMany' };
      }
      throw error;
    }
  }

  async revoke(tokenId: string): Promise<void> {
    try {
      await this.writer.delete(`${ACCESS_TOKENS_PATH}/${encodeURIComponent(tokenId)}`);
    } catch (error) {
      if (!(error instanceof ApiNotFoundError)) {
        throw error;
      }
    }
  }
}
