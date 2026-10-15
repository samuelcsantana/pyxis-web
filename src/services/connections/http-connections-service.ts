import type { ConnectedApps } from '@/domain/connections';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import { ApiNotFoundError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IConnectionsService } from './connections-service.interface';

export const CONNECTIONS_PATH = '/v1/me/connections';

export class HttpConnectionsService implements IConnectionsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(): Promise<ConnectedApps> {
    return this.reader.get(CONNECTIONS_PATH, connectedAppsResponseSchema);
  }

  async revoke(connectionId: string): Promise<void> {
    try {
      await this.writer.delete(`${CONNECTIONS_PATH}/${encodeURIComponent(connectionId)}`);
    } catch (error) {
      if (!(error instanceof ApiNotFoundError)) {
        throw error;
      }
    }
  }
}
