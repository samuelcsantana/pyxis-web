import { describe, expect, it, vi } from 'vitest';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { HttpSessionsService, SESSIONS_PATH } from './http-sessions-service';
import { DEMO_SESSION_IDS, MockSessionsService } from './mock-sessions-service';
import { createSessionsService } from './sessions-service.factory';
import type { ISessionsService } from './sessions-service.interface';

const NOW = new Date('2026-10-10T12:00:00.000Z');

describe('HttpSessionsService', () => {
  it('reads the sessions of the signed-in admin and parses them', async () => {
    const get = vi.fn<(path: string, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>([
        {
          id: DEMO_SESSION_IDS.thisDevice,
          browser: 'chrome',
          os: 'windows',
          deviceType: 'desktop',
          createdAt: '2026-10-10T09:00:00.000Z',
          lastUsedAt: '2026-10-10T09:30:00.000Z',
          current: true,
        },
      ]),
    );
    const service = new HttpSessionsService(
      { get } as unknown as ApiReader,
      {} as unknown as ApiWriter,
    );

    const sessions = await service.list();

    expect(get.mock.calls[0]?.[0]).toBe(SESSIONS_PATH);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.current).toBe(true);
  });

  it('ends a session by deleting it, with its id escaped in the path', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());
    const service = new HttpSessionsService(
      {} as unknown as ApiReader,
      { delete: remove } as unknown as ApiWriter,
    );

    await service.end('6e3a9d2b/odd');

    expect(remove).toHaveBeenCalledWith(`${SESSIONS_PATH}/6e3a9d2b%2Fodd`);
  });
});

describe('MockSessionsService', () => {
  it('lists three invented sessions, this device first and used right now', async () => {
    const sessions = await new MockSessionsService(() => NOW).list();

    expect(sessions.map((session) => [session.id, session.current])).toEqual([
      [DEMO_SESSION_IDS.thisDevice, true],
      [DEMO_SESSION_IDS.phone, false],
      [DEMO_SESSION_IDS.older, false],
    ]);
    expect(sessions[0]?.lastUsedAt).toBe(NOW.toISOString());
    expect(sessions[2]?.browser).toBeNull();
  });

  it('ends nothing, and does not mind', async () => {
    const service: ISessionsService = new MockSessionsService();

    await expect(service.end(DEMO_SESSION_IDS.phone)).resolves.toBeUndefined();
  });
});

describe('createSessionsService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createSessionsService()).toBeInstanceOf(HttpSessionsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createSessionsService()).toBeInstanceOf(MockSessionsService);
  });
});
