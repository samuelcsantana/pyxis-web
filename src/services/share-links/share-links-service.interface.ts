import type { CreateShareLinkOutcome, ShareLink, ShareLinkRequest } from '@/domain/share-links';

export interface IShareLinksService {
  list(projectId: string): Promise<readonly ShareLink[]>;
  create(projectId: string, request: ShareLinkRequest): Promise<CreateShareLinkOutcome>;
  revoke(projectId: string, linkId: string): Promise<void>;
}
