import type { AccessToken, CreateAccessTokenOutcome, NewAccessToken } from '@/domain/access-tokens';

export interface IAccessTokensService {
  list(): Promise<readonly AccessToken[]>;
  create(request: NewAccessToken): Promise<CreateAccessTokenOutcome>;
  revoke(tokenId: string): Promise<void>;
}
