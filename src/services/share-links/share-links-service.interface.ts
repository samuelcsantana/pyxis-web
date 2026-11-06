import type {
  CreateShareLinkOutcome,
  SetShareLinkPasswordOutcome,
  ShareLink,
  ShareLinkRequest,
} from '@/domain/share-links';

export interface IShareLinksService {
  list(projectId: string): Promise<readonly ShareLink[]>;
  create(projectId: string, request: ShareLinkRequest): Promise<CreateShareLinkOutcome>;
  setPassword(
    projectId: string,
    linkId: string,
    password: string | null,
  ): Promise<SetShareLinkPasswordOutcome>;
  revoke(projectId: string, linkId: string): Promise<void>;
}
