import type { AdminSession } from '@/domain/sessions';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { ISessionsService } from './sessions-service.interface';

export const SESSIONS_PATH = '/v1/me/sessions';

export class HttpSessionsService implements ISessionsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  list(): Promise<readonly AdminSession[]> {
    return this.reader.get(SESSIONS_PATH, sessionsResponseSchema);
  }

  end(sessionId: string): Promise<void> {
    return this.writer.delete(`${SESSIONS_PATH}/${encodeURIComponent(sessionId)}`);
  }
}
