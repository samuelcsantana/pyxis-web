import type { AdminSession } from '@/domain/sessions';

export interface ISessionsService {
  list(): Promise<readonly AdminSession[]>;
  end(sessionId: string): Promise<void>;
}
