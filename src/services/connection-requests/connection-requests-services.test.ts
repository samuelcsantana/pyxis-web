import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { createConnectionRequestsService } from './connection-requests-service.factory';
import {
  CONNECTION_REQUESTS_PATH,
  HttpConnectionRequestsService,
} from './http-connection-requests-service';
import {
  DEMO_CONNECTION_REQUEST_ID,
  DEMO_LOOPBACK_CALLBACK,
  demoConnectionRequestWire,
  MockConnectionRequestsService,
} from './mock-connection-requests-service';

const NOW = new Date('2026-10-15T23:00:00.000Z');
const REQUEST_ID = '0b1c2d3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e';
const REQUEST_PATH = `${CONNECTION_REQUESTS_PATH}/${REQUEST_ID}`;
const CALLBACK = 'https://claude.ai/api/mcp/auth_callback?code=abc&state=xyz';

type Get = (path: string, schema: { parse(body: unknown): unknown }) => Promise<unknown>;
type Post = (
  path: string,
  body: unknown,
  schema: { parse(body: unknown): unknown },
) => Promise<unknown>;

function serviceWith(reader: { get?: Get }, writer: { post?: Post } = {}) {
  return new HttpConnectionRequestsService(
    reader as unknown as ApiReader,
    writer as unknown as ApiWriter,
  );
}

function answering(body: unknown): Mock<Post> {
  return vi.fn<Post>((_path, _body, schema) => Promise.resolve(schema.parse(body)));
}

function refusing(failure: Error): Mock<Post> {
  return vi.fn<Post>(() => Promise.reject(failure));
}

describe('HttpConnectionRequestsService', () => {
  it('reads a waiting request by its id, escaped in the path', async () => {
    const get = vi.fn<Get>((_path, schema) =>
      Promise.resolve(schema.parse(demoConnectionRequestWire(NOW))),
    );

    const found = await serviceWith({ get }).find('4d0f/odd');

    expect(get.mock.calls[0]?.[0]).toBe(`${CONNECTION_REQUESTS_PATH}/4d0f%2Fodd`);
    expect(found).toEqual({
      id: DEMO_CONNECTION_REQUEST_ID,
      client: { name: 'Claude Code', host: 'claude.ai' },
      redirect: { host: 'localhost', loopback: true },
      expiresAt: '2026-10-15T23:10:00.000Z',
      projects: [
        { id: DEMO_STORE.id, name: DEMO_STORE.name },
        { id: DEMO_DOCS.id, name: DEMO_DOCS.name },
      ],
      connectionLimitReached: false,
    });
  });

  it('refuses a request whose scope is more than reading', async () => {
    const get = vi.fn<Get>((_path, schema) =>
      Promise.resolve(schema.parse({ ...demoConnectionRequestWire(NOW), scope: 'write' })),
    );

    await expect(serviceWith({ get }).find(REQUEST_ID)).rejects.toThrow();
  });

  it('answers nothing for a request that is unknown, expired or already answered', async () => {
    const get = vi.fn<Get>(() => Promise.reject(new ApiNotFoundError(REQUEST_PATH)));

    await expect(serviceWith({ get }).find(REQUEST_ID)).resolves.toBeNull();
  });

  it('lets any other failure of a read through', async () => {
    const failure = new UnauthenticatedError();
    const get = vi.fn<Get>(() => Promise.reject(failure));

    await expect(serviceWith({ get }).find(REQUEST_ID)).rejects.toBe(failure);
  });

  it.each([
    ['allow', 'approve'],
    ['deny', 'deny'],
  ] as const)(
    '%s posts to the %s route and answers where the browser goes',
    async (method, route) => {
      const post = answering({ redirect_to: CALLBACK });

      const outcome = await serviceWith({}, { post })[method](REQUEST_ID);

      expect(outcome).toEqual({ kind: 'redirect', url: CALLBACK });
      expect(post.mock.calls[0]?.slice(0, 2)).toEqual([`${REQUEST_PATH}/${route}`, {}]);
    },
  );

  it.each(['javascript:alert(1)', 'not an address'])(
    'never sends the browser to %s',
    async (redirectTo) => {
      const post = answering({ redirect_to: redirectTo });

      await expect(serviceWith({}, { post }).allow(REQUEST_ID)).rejects.toThrow();
    },
  );

  it.each(['allow', 'deny'] as const)('answers gone when %s finds no request', async (method) => {
    const post = refusing(new ApiNotFoundError(REQUEST_PATH));

    await expect(serviceWith({}, { post })[method](REQUEST_ID)).resolves.toEqual({
      kind: 'gone',
    });
  });

  it('answers tooMany when the admin already keeps ten connections', async () => {
    const post = refusing(new ApiRequestError(REQUEST_PATH, 409, 'too_many_connections'));

    await expect(serviceWith({}, { post }).allow(REQUEST_ID)).resolves.toEqual({
      kind: 'tooMany',
    });
  });

  it.each([
    ['another refusal', new ApiRequestError(REQUEST_PATH, 403, 'origin_not_allowed')],
    ['an ended session', new UnauthenticatedError()],
  ])('lets %s through when allowing or denying', async (_, failure) => {
    const post = refusing(failure);
    const service = serviceWith({}, { post });

    await expect(service.allow(REQUEST_ID)).rejects.toBe(failure);
    await expect(service.deny(REQUEST_ID)).rejects.toBe(failure);
  });
});

describe('MockConnectionRequestsService', () => {
  it('knows one invented request from Claude Code, back to this computer, for ten minutes', async () => {
    const found = await new MockConnectionRequestsService(() => NOW).find(
      DEMO_CONNECTION_REQUEST_ID,
    );

    expect(found?.client).toEqual({ name: 'Claude Code', host: 'claude.ai' });
    expect(found?.redirect).toEqual({ host: 'localhost', loopback: true });
    expect(found?.expiresAt).toBe('2026-10-15T23:10:00.000Z');
  });

  it('knows no other request', async () => {
    await expect(new MockConnectionRequestsService().find(REQUEST_ID)).resolves.toBeNull();
  });

  it('sends the browser back with a code when allowed, and with access_denied when denied', async () => {
    const service = new MockConnectionRequestsService();

    await expect(service.allow(DEMO_CONNECTION_REQUEST_ID)).resolves.toEqual({
      kind: 'redirect',
      url: `${DEMO_LOOPBACK_CALLBACK}?code=demo-code&state=demo-state`,
    });
    await expect(service.deny(DEMO_CONNECTION_REQUEST_ID)).resolves.toEqual({
      kind: 'redirect',
      url: `${DEMO_LOOPBACK_CALLBACK}?error=access_denied&state=demo-state`,
    });
  });

  it.each(['allow', 'deny'] as const)('answers gone when %s gets another id', async (method) => {
    await expect(new MockConnectionRequestsService()[method](REQUEST_ID)).resolves.toEqual({
      kind: 'gone',
    });
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    const found = await new MockConnectionRequestsService().find(DEMO_CONNECTION_REQUEST_ID);

    expect(found?.expiresAt).toBe('2026-10-15T23:10:00.000Z');
    vi.useRealTimers();
  });
});

describe('createConnectionRequestsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createConnectionRequestsService()).toBeInstanceOf(HttpConnectionRequestsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createConnectionRequestsService()).toBeInstanceOf(MockConnectionRequestsService);
  });
});
