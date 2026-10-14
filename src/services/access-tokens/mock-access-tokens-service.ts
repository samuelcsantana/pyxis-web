import type { AccessToken, CreateAccessTokenOutcome, NewAccessToken } from '@/domain/access-tokens';
import {
  accessTokensResponseSchema,
  createdAccessTokenResponseSchema,
} from '@/domain/access-tokens.schema';
import type { IAccessTokensService } from './access-tokens-service.interface';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

export const DEMO_ACCESS_TOKEN_IDS = {
  agent: '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a',
  report: '2b8d4f6a-3c5e-4d7f-9a2b-4c6d8e0f2a3b',
  created: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
} as const;

export const DEMO_CREATED_ACCESS_TOKEN = 'pyxis_at_DemoTokenThatReadsNothing0000000';

export function demoAccessTokensWire(now: Date) {
  const at = (offset: number) => new Date(now.getTime() + offset).toISOString();
  return {
    tokens: [
      {
        id: DEMO_ACCESS_TOKEN_IDS.agent,
        name: 'Claude Code',
        created_at: at(-12 * DAY_MS),
        last_used_at: at(-2 * HOUR_MS),
        expires_at: at(78 * DAY_MS),
      },
      {
        id: DEMO_ACCESS_TOKEN_IDS.report,
        name: 'Monthly report script',
        created_at: at(-3 * DAY_MS),
        last_used_at: null,
        expires_at: at(27 * DAY_MS),
      },
    ],
  };
}

export function demoCreatedAccessTokenWire(request: NewAccessToken, now: Date) {
  return {
    id: DEMO_ACCESS_TOKEN_IDS.created,
    name: request.name.trim(),
    token: DEMO_CREATED_ACCESS_TOKEN,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + request.lifetimeDays * DAY_MS).toISOString(),
  };
}

export class MockAccessTokensService implements IAccessTokensService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<readonly AccessToken[]> {
    return Promise.resolve(accessTokensResponseSchema.parse(demoAccessTokensWire(this.now())));
  }

  create(request: NewAccessToken): Promise<CreateAccessTokenOutcome> {
    const token = createdAccessTokenResponseSchema.parse(
      demoCreatedAccessTokenWire(request, this.now()),
    );
    return Promise.resolve({ kind: 'created', token });
  }

  revoke(): Promise<void> {
    return Promise.resolve();
  }
}
