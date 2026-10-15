import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { ApiWriter } from '../api-writer';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { demoPublicKeyId } from '../projects/demo-project-settings';
import { API_ERROR_CODES, HttpProjectManagementService } from './http-project-management-service';
import {
  DEMO_CREATED_KEY_ID,
  DEMO_CREATED_KEYS,
  MockProjectManagementService,
} from './mock-project-management-service';
import { createProjectManagementService } from './project-management-service.factory';

const PROJECT = '6f1d3c2a-8b4e-4c5d-9e6f-7a8b9c0d1e2f';
const CHANGES = {
  name: 'Shop',
  allowedOrigins: ['https://shop.example.com'],
  timezone: 'America/Sao_Paulo',
  conversionEvent: null,
};

function refusal(code: string, status = 409) {
  return new ApiRequestError('/v1/projects/p', status, code);
}

type WriteMock = (path: string, body: unknown, schema: unknown) => Promise<unknown>;

function serviceWith(writer: Record<string, unknown>) {
  return new HttpProjectManagementService(writer as unknown as ApiWriter);
}

describe('HttpProjectManagementService create', () => {
  it('creates a project in the account, sending the conversion event only when set', async () => {
    const post = vi.fn<WriteMock>((_path, _body, schema) =>
      Promise.resolve(
        (schema as { parse(body: unknown): unknown }).parse({
          project_id: 'p2',
          public_key: { id: 'k1', key: 'pyxis_pk_new' },
        }),
      ),
    );

    await expect(serviceWith({ post }).create('a/1', CHANGES)).resolves.toEqual({
      kind: 'created',
      project: { projectId: 'p2', publicKey: 'pyxis_pk_new' },
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      '/v1/accounts/a%2F1/projects',
      {
        name: 'Shop',
        allowed_origins: ['https://shop.example.com'],
        timezone: 'America/Sao_Paulo',
      },
    ]);
    await serviceWith({ post }).create('a1', { ...CHANGES, conversionEvent: 'signup_completed' });
    expect(post.mock.calls[1]?.[1]).toMatchObject({ conversion_event: 'signup_completed' });
  });

  it.each([
    [API_ERROR_CODES.projectLimitReached, 409, 'limitReached'],
    [API_ERROR_CODES.subscriptionRequired, 409, 'subscriptionRequired'],
    [API_ERROR_CODES.invalidSettings, 400, 'invalid'],
  ])('answers the refusal %s as %s', async (code, status, kind) => {
    const post = vi.fn(() => Promise.reject(refusal(code, status)));

    await expect(serviceWith({ post }).create('a1', CHANGES)).resolves.toEqual({ kind });
  });

  it('lets any other failure through', async () => {
    const failure = new UnauthenticatedError();
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).create('a1', CHANGES)).rejects.toBe(failure);
  });
});

describe('HttpProjectManagementService update', () => {
  it('patches the project with the API field names', async () => {
    const patch = vi.fn<WriteMock>(() => Promise.resolve(undefined));

    await expect(serviceWith({ patch }).update(PROJECT, CHANGES)).resolves.toEqual({
      kind: 'saved',
    });
    expect(patch.mock.calls[0]?.slice(0, 2)).toEqual([
      `/v1/projects/${PROJECT}`,
      {
        name: 'Shop',
        allowed_origins: ['https://shop.example.com'],
        timezone: 'America/Sao_Paulo',
        conversion_event: null,
      },
    ]);
  });

  it.each([
    [API_ERROR_CODES.subscriptionRequired, 409, 'subscriptionRequired'],
    [API_ERROR_CODES.invalidSettings, 400, 'invalid'],
  ])('answers the refusal %s as %s', async (code, status, kind) => {
    const patch = vi.fn(() => Promise.reject(refusal(code, status)));

    await expect(serviceWith({ patch }).update(PROJECT, CHANGES)).resolves.toEqual({ kind });
  });

  it('lets any other failure through', async () => {
    const failure = new UnauthenticatedError();
    const patch = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ patch }).update(PROJECT, CHANGES)).rejects.toBe(failure);
  });
});

describe('HttpProjectManagementService createKey', () => {
  it('creates a key of the kind asked, with the project id escaped', async () => {
    const key = { id: 'k1', kind: 'secret' as const, key: 'pyxis_sk_x' };
    const post = vi.fn<WriteMock>(() => Promise.resolve(key));

    await expect(serviceWith({ post }).createKey('p/1', 'secret')).resolves.toEqual({
      kind: 'created',
      key,
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      '/v1/projects/p%2F1/keys',
      { kind: 'secret' },
    ]);
  });

  it.each([
    [API_ERROR_CODES.subscriptionRequired, 'subscriptionRequired'],
    [API_ERROR_CODES.keyLimitReached, 'tooMany'],
  ])('answers the refusal %s as %s', async (code, kind) => {
    const post = vi.fn(() => Promise.reject(refusal(code)));

    await expect(serviceWith({ post }).createKey(PROJECT, 'public')).resolves.toEqual({ kind });
  });

  it('lets a refusal with another code through', async () => {
    const failure = refusal('something_else');
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).createKey(PROJECT, 'public')).rejects.toBe(failure);
  });
});

describe('HttpProjectManagementService revokeKey', () => {
  it('deletes the key, with both ids escaped in the path', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());

    await expect(serviceWith({ delete: remove }).revokeKey('p/1', 'k/1')).resolves.toEqual({
      kind: 'revoked',
    });
    expect(remove).toHaveBeenCalledWith('/v1/projects/p%2F1/keys/k%2F1');
  });

  it('treats a key already gone as revoked', async () => {
    const remove = vi.fn(() => Promise.reject(new ApiNotFoundError('/v1/projects/p/keys/k')));

    await expect(serviceWith({ delete: remove }).revokeKey(PROJECT, 'k')).resolves.toEqual({
      kind: 'revoked',
    });
  });

  it.each([
    [API_ERROR_CODES.subscriptionRequired, 'subscriptionRequired'],
    [API_ERROR_CODES.lastPublicKey, 'lastPublicKey'],
  ])('answers the refusal %s as %s', async (code, kind) => {
    const remove = vi.fn(() => Promise.reject(refusal(code)));

    await expect(serviceWith({ delete: remove }).revokeKey(PROJECT, 'k')).resolves.toEqual({
      kind,
    });
  });

  it('lets any other failure through', async () => {
    const failure = new Error('network');
    const remove = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ delete: remove }).revokeKey(PROJECT, 'k')).rejects.toBe(failure);
  });
});

describe('HttpProjectManagementService delete', () => {
  it('deletes the project with its name typed again', async () => {
    const post = vi.fn<WriteMock>(() => Promise.resolve(undefined));

    await expect(serviceWith({ post }).delete(PROJECT, 'Shop')).resolves.toEqual({
      kind: 'deleted',
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      `/v1/projects/${PROJECT}/delete`,
      { confirm_name: 'Shop' },
    ]);
  });

  it('answers a name that does not match', async () => {
    const post = vi.fn(() => Promise.reject(refusal(API_ERROR_CODES.nameMismatch)));

    await expect(serviceWith({ post }).delete(PROJECT, 'Shopp')).resolves.toEqual({
      kind: 'nameMismatch',
    });
  });

  it('lets any other failure through', async () => {
    const failure = new UnauthenticatedError();
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).delete(PROJECT, 'Shop')).rejects.toBe(failure);
  });
});

describe('MockProjectManagementService', () => {
  const service = new MockProjectManagementService();

  it('saves any change', async () => {
    await expect(service.update()).resolves.toEqual({ kind: 'saved' });
  });

  it('creates every new project as the demo store, so the demo can follow it', async () => {
    await expect(service.create()).resolves.toEqual({
      kind: 'created',
      project: { projectId: DEMO_STORE.id, publicKey: DEMO_CREATED_KEYS.public },
    });
  });

  it.each(['public', 'secret'] as const)('creates an invented %s key', async (kind) => {
    await expect(service.createKey(DEMO_STORE.id, kind)).resolves.toEqual({
      kind: 'created',
      key: { id: DEMO_CREATED_KEY_ID, kind, key: DEMO_CREATED_KEYS[kind] },
    });
  });

  it('keeps the only public key of a demo project and revokes any other key', async () => {
    await expect(service.revokeKey(DEMO_DOCS.id, demoPublicKeyId(DEMO_DOCS.id))).resolves.toEqual({
      kind: 'lastPublicKey',
    });
    await expect(service.revokeKey(DEMO_DOCS.id, DEMO_CREATED_KEY_ID)).resolves.toEqual({
      kind: 'revoked',
    });
  });

  it('deletes a demo project only when its name is typed', async () => {
    await expect(service.delete(DEMO_STORE.id, DEMO_STORE.name)).resolves.toEqual({
      kind: 'deleted',
    });
    await expect(service.delete(DEMO_STORE.id, 'Something else')).resolves.toEqual({
      kind: 'nameMismatch',
    });
  });
});

describe('createProjectManagementService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    expect(createProjectManagementService()).toBeInstanceOf(HttpProjectManagementService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createProjectManagementService()).toBeInstanceOf(MockProjectManagementService);
  });
});
