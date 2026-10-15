import { afterEach, describe, expect, it, vi } from 'vitest';
import { claudeCodeCommand } from '@/domain/connections';
import { ApiNotFoundError, UnauthenticatedError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { createConnectionsService } from './connections-service.factory';
import { CONNECTIONS_PATH, HttpConnectionsService } from './http-connections-service';
import {
  DEMO_CONNECTION_IDS,
  DEMO_CONNECTOR_URL,
  demoConnectionsWire,
  MockConnectionsService,
} from './mock-connections-service';

const NOW = new Date('2026-10-15T23:00:00.000Z');

type Get = (path: string, schema: { parse(body: unknown): unknown }) => Promise<unknown>;

function serviceWith(reader: { get?: Get }, writer: Partial<ApiWriter> = {}) {
  return new HttpConnectionsService(reader as unknown as ApiReader, writer as ApiWriter);
}

function answering(body: unknown) {
  return vi.fn<Get>((_path, schema) => Promise.resolve().then(() => schema.parse(body)));
}

describe('HttpConnectionsService', () => {
  it('reads the connected apps of the signed-in admin and the address to connect another', async () => {
    const get = answering(demoConnectionsWire(NOW));

    const apps = await serviceWith({ get }).list();

    expect(get.mock.calls[0]?.[0]).toBe(CONNECTIONS_PATH);
    expect(apps).toEqual({
      connectorUrl: DEMO_CONNECTOR_URL,
      connections: [
        {
          id: DEMO_CONNECTION_IDS.claude,
          client: { name: 'Claude', host: 'claude.ai' },
          createdAt: '2026-10-12T23:00:00.000Z',
          lastUsedAt: '2026-10-15T22:00:00.000Z',
        },
        {
          id: DEMO_CONNECTION_IDS.claudeCode,
          client: { name: 'Claude Code', host: 'claude.ai' },
          createdAt: '2026-10-03T23:00:00.000Z',
          lastUsedAt: '2026-10-13T23:00:00.000Z',
        },
      ],
    });
  });

  it('has no address to give while the connector is closed', async () => {
    const get = answering({ connector: { open: false, url: null }, connections: [] });

    await expect(serviceWith({ get }).list()).resolves.toEqual({
      connectorUrl: null,
      connections: [],
    });
  });

  it('shows no address the API sends while it says the connector is closed', async () => {
    const get = answering({ connector: { open: false, url: DEMO_CONNECTOR_URL }, connections: [] });

    await expect(serviceWith({ get }).list()).resolves.toMatchObject({ connectorUrl: null });
  });

  it('refuses a connector address that is not a web address', async () => {
    const get = answering({
      connector: { open: true, url: 'javascript:alert(1)' },
      connections: [],
    });

    await expect(serviceWith({ get }).list()).rejects.toThrow();
  });

  it('revokes a connection by deleting it, with its id escaped in the path', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());

    await serviceWith({}, { delete: remove }).revoke('5e1a/odd');

    expect(remove).toHaveBeenCalledWith(`${CONNECTIONS_PATH}/5e1a%2Fodd`);
  });

  it('treats a connection already gone as revoked', async () => {
    const remove = vi.fn(() => Promise.reject(new ApiNotFoundError(CONNECTIONS_PATH)));

    await expect(serviceWith({}, { delete: remove }).revoke('gone')).resolves.toBeUndefined();
  });

  it('lets any other failure of a revoke through', async () => {
    const failure = new UnauthenticatedError();
    const remove = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({}, { delete: remove }).revoke('x')).rejects.toBe(failure);
  });
});

describe('MockConnectionsService', () => {
  it('lists Claude, used an hour ago, and Claude Code, used two days ago, with the address', async () => {
    const apps = await new MockConnectionsService(() => NOW).list();

    expect(apps.connectorUrl).toBe(DEMO_CONNECTOR_URL);
    expect(apps.connections.map((app) => [app.client.name, app.lastUsedAt])).toEqual([
      ['Claude', '2026-10-15T22:00:00.000Z'],
      ['Claude Code', '2026-10-13T23:00:00.000Z'],
    ]);
  });

  it('revokes nothing, and does not mind', async () => {
    await expect(new MockConnectionsService().revoke()).resolves.toBeUndefined();
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    const { connections } = await new MockConnectionsService().list();

    expect(connections[0]?.createdAt).toBe('2026-10-12T23:00:00.000Z');
    vi.useRealTimers();
  });
});

describe('claudeCodeCommand', () => {
  it('adds the connector to Claude Code under the name pyxis', () => {
    expect(claudeCodeCommand(DEMO_CONNECTOR_URL)).toBe(
      'claude mcp add --transport http pyxis https://api.pyxis-analytics.dev/mcp',
    );
  });
});

describe('createConnectionsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createConnectionsService()).toBeInstanceOf(HttpConnectionsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createConnectionsService()).toBeInstanceOf(MockConnectionsService);
  });
});
