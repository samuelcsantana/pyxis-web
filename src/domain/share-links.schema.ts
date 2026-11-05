import { z } from 'zod';
import type { CreatedShareLink, ShareLink, ShareLinkRequest } from './share-links';

const shareLinkWireSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  expires_at: z.string().nullable(),
});

function fromWire(body: z.infer<typeof shareLinkWireSchema>): ShareLink {
  return {
    id: body.id,
    name: body.name,
    createdAt: body.created_at,
    expiresAt: body.expires_at,
  };
}

export const shareLinksResponseSchema = z
  .object({ links: z.array(shareLinkWireSchema) })
  .transform((body): readonly ShareLink[] => body.links.map(fromWire));

export const createdShareLinkResponseSchema = shareLinkWireSchema
  .extend({ token: z.string() })
  .transform((body): CreatedShareLink => ({ ...fromWire(body), token: body.token }));

export function shareLinkRequestWire(request: ShareLinkRequest) {
  return { name: request.name, expires_at: request.expiresAt };
}
