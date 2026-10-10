import type { AdminSession } from '@/domain/sessions';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import type { ISessionsService } from './sessions-service.interface';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

export const DEMO_SESSION_IDS = {
  thisDevice: '5d2f8c1a-6b3e-4a7f-9c0d-1e2f3a4b5c6d',
  phone: '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e',
  older: '7f4b0e3c-8d5a-4c9b-9e2f-3a4b5c6d7e8f',
} as const;

export function demoSessionsWire(now: Date) {
  const at = (ago: number) => new Date(now.getTime() - ago).toISOString();
  return {
    sessions: [
      {
        id: DEMO_SESSION_IDS.thisDevice,
        browser: 'chrome',
        os: 'windows',
        device_type: 'desktop',
        created_at: at(5 * HOUR_MS),
        last_used_at: at(0),
        current: true,
      },
      {
        id: DEMO_SESSION_IDS.phone,
        browser: 'safari',
        os: 'ios',
        device_type: 'mobile',
        created_at: at(2 * DAY_MS + 3 * HOUR_MS),
        last_used_at: at(2 * DAY_MS),
        current: false,
      },
      {
        id: DEMO_SESSION_IDS.older,
        browser: null,
        os: null,
        device_type: null,
        created_at: at(6 * DAY_MS),
        last_used_at: at(6 * DAY_MS),
        current: false,
      },
    ],
  };
}

export class MockSessionsService implements ISessionsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  list(): Promise<readonly AdminSession[]> {
    return Promise.resolve(sessionsResponseSchema.parse(demoSessionsWire(this.now())));
  }

  end(): Promise<void> {
    return Promise.resolve();
  }
}
