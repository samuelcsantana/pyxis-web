import type { ConnectedApps } from '@/domain/connections';

export interface IConnectionsService {
  list(): Promise<ConnectedApps>;
  revoke(connectionId: string): Promise<void>;
}
