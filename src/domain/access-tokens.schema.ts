import { z } from 'zod';
import type { AccessToken, CreatedAccessToken, NewAccessToken } from './access-tokens';

const accessTokenWireSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  last_used_at: z.string().nullable(),
  expires_at: z.string(),
});

function fromWire(body: z.infer<typeof accessTokenWireSchema>): AccessToken {
  return {
    id: body.id,
    name: body.name,
    createdAt: body.created_at,
    lastUsedAt: body.last_used_at,
    expiresAt: body.expires_at,
  };
}

export const accessTokensResponseSchema = z
  .object({ tokens: z.array(accessTokenWireSchema) })
  .transform((body): readonly AccessToken[] => body.tokens.map(fromWire));

export const createdAccessTokenResponseSchema = accessTokenWireSchema
  .omit({ last_used_at: true })
  .extend({ token: z.string() })
  .transform((body): CreatedAccessToken => ({
    ...fromWire({ ...body, last_used_at: null }),
    token: body.token,
  }));

export function newAccessTokenWire(request: NewAccessToken) {
  return { name: request.name.trim(), expires_in_days: request.lifetimeDays };
}
