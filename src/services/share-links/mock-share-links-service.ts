import type { CreateShareLinkOutcome, ShareLink, ShareLinkRequest } from '@/domain/share-links';
import {
  createdShareLinkResponseSchema,
  shareLinksResponseSchema,
} from '@/domain/share-links.schema';
import type { IShareLinksService } from './share-links-service.interface';

const DAY_MS = 24 * 60 * 60 * 1000;

export const DEMO_SHARE_LINK_IDS = {
  board: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  pitch: '5e1a7c9d-6f8b-4a0c-9d5e-7f9a1b3c5d6e',
  created: '6f2b8d0e-7a9c-4b1d-8e6f-8a0b2c4d6e7f',
} as const;

export const DEMO_SHARE_TOKEN = 'pyxis_sh_DemoLinkWithInventedNumbers00000';

export function demoShareLinksWire(now: Date) {
  const at = (days: number) => new Date(now.getTime() + days * DAY_MS).toISOString();
  return {
    links: [
      {
        id: DEMO_SHARE_LINK_IDS.pitch,
        name: 'Agency pitch',
        created_at: at(-40),
        expires_at: at(-10),
      },
      {
        id: DEMO_SHARE_LINK_IDS.board,
        name: 'Monthly board report',
        created_at: at(-9),
        expires_at: null,
      },
    ],
  };
}

export function demoCreatedShareLinkWire(request: ShareLinkRequest, now: Date) {
  return {
    id: DEMO_SHARE_LINK_IDS.created,
    name: request.name,
    created_at: now.toISOString(),
    expires_at: request.expiresAt,
    token: DEMO_SHARE_TOKEN,
  };
}

export class MockShareLinksService implements IShareLinksService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<readonly ShareLink[]> {
    return Promise.resolve(shareLinksResponseSchema.parse(demoShareLinksWire(this.now())));
  }

  create(projectId: string, request: ShareLinkRequest): Promise<CreateShareLinkOutcome> {
    return Promise.resolve({
      kind: 'created',
      link: createdShareLinkResponseSchema.parse(demoCreatedShareLinkWire(request, this.now())),
    });
  }

  revoke(): Promise<void> {
    return Promise.resolve();
  }
}
