import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type { CreateShareLinkOutcome, ShareLink, ShareLinkRequest } from '@/domain/share-links';
import {
  createdShareLinkResponseSchema,
  shareLinkRequestWire,
  shareLinksResponseSchema,
} from '@/domain/share-links.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IShareLinksService } from './share-links-service.interface';

export const SHARE_LINK_ERROR_CODES = {
  planRequired: 'plan_required',
  limitReached: 'share_link_limit_reached',
} as const;

function shareLinksPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/share-links`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

export class HttpShareLinksService implements IShareLinksService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(projectId: string): Promise<readonly ShareLink[]> {
    return this.reader.get(shareLinksPath(projectId), shareLinksResponseSchema);
  }

  async create(projectId: string, request: ShareLinkRequest): Promise<CreateShareLinkOutcome> {
    try {
      const link = await this.writer.post(
        shareLinksPath(projectId),
        shareLinkRequestWire(request),
        createdShareLinkResponseSchema,
      );
      return { kind: 'created', link };
    } catch (error) {
      if (refusedWith(error, SHARE_LINK_ERROR_CODES.planRequired)) {
        return { kind: 'planRequired' };
      }
      if (refusedWith(error, SHARE_LINK_ERROR_CODES.limitReached)) {
        return { kind: 'limitReached' };
      }
      throw error;
    }
  }

  async revoke(projectId: string, linkId: string): Promise<void> {
    try {
      await this.writer.delete(`${shareLinksPath(projectId)}/${encodeURIComponent(linkId)}`);
    } catch (error) {
      if (!(error instanceof ApiNotFoundError)) {
        throw error;
      }
    }
  }
}
