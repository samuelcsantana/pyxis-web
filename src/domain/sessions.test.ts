import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { type AdminSession, describeDevice } from './sessions';
import { sessionsResponseSchema } from './sessions.schema';

const SESSION: AdminSession = {
  id: '5d2f8c1a-6b3e-4a7f-9c0d-1e2f3a4b5c6d',
  browser: 'chrome',
  os: 'windows',
  deviceType: 'desktop',
  createdAt: '2026-10-10T09:00:00.000Z',
  lastUsedAt: '2026-10-10T09:30:00.000Z',
  current: true,
};

describe('describeDevice', () => {
  it('names the browser and the system in the language of the dashboard', () => {
    expect(describeDevice(SESSION, english)).toBe('Chrome on Windows');
    expect(describeDevice(SESSION, portuguese)).toBe('Chrome no Windows');
  });

  it('keeps an unknown family as the API sent it, and says other for other', () => {
    expect(describeDevice({ ...SESSION, browser: 'brave', os: 'other' }, english)).toBe(
      'brave on Other',
    );
  });

  it('says the browser is unknown for a session that recorded no device', () => {
    expect(describeDevice({ ...SESSION, browser: null, os: null }, english)).toBe(
      'Unknown browser',
    );
    expect(describeDevice({ ...SESSION, browser: 'chrome', os: null }, portuguese)).toBe(
      'Navegador desconhecido',
    );
  });
});

describe('sessionsResponseSchema', () => {
  it('turns the wire shape into sessions in camel case', () => {
    expect(
      sessionsResponseSchema.parse({
        sessions: [
          {
            id: SESSION.id,
            browser: 'chrome',
            os: 'windows',
            device_type: 'desktop',
            created_at: SESSION.createdAt,
            last_used_at: SESSION.lastUsedAt,
            current: true,
          },
        ],
      }),
    ).toEqual([SESSION]);
  });

  it('refuses a session without the current flag', () => {
    expect(() =>
      sessionsResponseSchema.parse({ sessions: [{ id: 'x', browser: null, os: null }] }),
    ).toThrow();
  });
});
