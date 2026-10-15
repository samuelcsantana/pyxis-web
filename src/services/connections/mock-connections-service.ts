import type { ConnectedApps } from '@/domain/connections';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import type { IConnectionsService } from './connections-service.interface';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

export const DEMO_CONNECTOR_URL = 'https://api.pyxis-analytics.dev/mcp';

export const DEMO_CONNECTION_IDS = {
  claude: '5e1a7c9d-6f8b-4a0c-9d5e-7f9a1b3c5d6e',
  claudeCode: '6f2b8d0e-7a9c-4b1d-8e6f-8a0b2c4d6e7f',
} as const;

export function demoConnectionsWire(now: Date) {
  const at = (offset: number) => new Date(now.getTime() + offset).toISOString();
  return {
    connector: { open: true, url: DEMO_CONNECTOR_URL },
    connections: [
      {
        id: DEMO_CONNECTION_IDS.claude,
        client: { name: 'Claude', host: 'claude.ai' },
        created_at: at(-3 * DAY_MS),
        last_used_at: at(-HOUR_MS),
      },
      {
        id: DEMO_CONNECTION_IDS.claudeCode,
        client: { name: 'Claude Code', host: 'claude.ai' },
        created_at: at(-12 * DAY_MS),
        last_used_at: at(-2 * DAY_MS),
      },
    ],
  };
}

export class MockConnectionsService implements IConnectionsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<ConnectedApps> {
    return Promise.resolve(connectedAppsResponseSchema.parse(demoConnectionsWire(this.now())));
  }

  revoke(): Promise<void> {
    return Promise.resolve();
  }
}
