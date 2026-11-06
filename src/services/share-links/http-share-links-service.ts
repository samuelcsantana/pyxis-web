import { ApiNotFoundError, ApiRequestError } from '@/domain/errors';
import type {
  CreateShareLinkOutcome,
  SetShareLinkPasswordOutcome,
  ShareLink,
  ShareLinkRequest,
} from '@/domain/share-links';
import {
  createdShareLinkResponseSchema,
  shareLinkPasswordWire,
  shareLinkRequestWire,
  shareLinkResponseSchema,
  shareLinksResponseSchema,
} from '@/domain/share-links.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IShareLinksService } from './share-links-service.interface';

export const SHARE_LINK_ERROR_CODES = {
  planRequired: 'plan_required',
  limitReached: 'share_link_limit_reached',
  subscriptionRequired: 'subscription_required',
} as const;

function shareLinksPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/share-links`;
}

function linkPath(projectId: string, linkId: string): string {
  return `${shareLinksPath(projectId)}/${encodeURIComponent(linkId)}`;
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

  async setPassword(
    projectId: string,
    linkId: string,
    password: string | null,
  ): Promise<SetShareLinkPasswordOutcome> {
    try {
      const link = await this.writer.patch(
        linkPath(projectId, linkId),
        shareLinkPasswordWire(password),
        shareLinkResponseSchema,
      );
      return { kind: 'changed', link };
    } catch (error) {
      if (
        refusedWith(error, SHARE_LINK_ERROR_CODES.planRequired) ||
        refusedWith(error, SHARE_LINK_ERROR_CODES.subscriptionRequired)
      ) {
        return { kind: 'planRequired' };
      }
      if (error instanceof ApiNotFoundError) {
        return { kind: 'gone' };
      }
      throw error;
    }
  }

  async revoke(projectId: string, linkId: string): Promise<void> {
    try {
      await this.writer.delete(linkPath(projectId, linkId));
    } catch (error) {
      if (!(error instanceof ApiNotFoundError)) {
        throw error;
      }
    }
  }
}
