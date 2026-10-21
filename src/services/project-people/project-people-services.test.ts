import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { HttpProjectPeopleService, PEOPLE_ERROR_CODES } from './http-project-people-service';
import { DEMO_PEOPLE_IDS, MockProjectPeopleService } from './mock-project-people-service';
import { createProjectPeopleService } from './project-people-service.factory';

const PROJECT = '6f1d3c2a-8b4e-4c5d-9e6f-7a8b9c0d1e2f';
const NOW = new Date('2026-10-15T12:00:00.000Z');
const PERSON_WIRE = {
  admin_user_id: 'u2',
  email: 'ana@example.com',
  role: 'member',
  added_at: '2026-10-15T12:00:00.000Z',
};
const PERSON = {
  adminUserId: 'u2',
  email: 'ana@example.com',
  role: 'member',
  addedAt: '2026-10-15T12:00:00.000Z',
};

type Call = (
  path: string,
  body: unknown,
  schema: { parse(body: unknown): unknown },
) => Promise<unknown>;

function serviceWith(writer: Record<string, unknown>, reader: Record<string, unknown> = {}) {
  return new HttpProjectPeopleService(
    reader as unknown as ApiReader,
    writer as unknown as ApiWriter,
  );
}

describe('HttpProjectPeopleService', () => {
  it('lists the people of a project, with its id escaped', async () => {
    const get = vi.fn((_: string, schema: { parse(body: unknown): unknown }) =>
      Promise.resolve(schema.parse({ people: [PERSON_WIRE] })),
    );

    await expect(serviceWith({}, { get }).list('p/1')).resolves.toEqual([PERSON]);
    expect(get.mock.calls[0]?.[0]).toBe('/v1/projects/p%2F1/people');
  });

  it('adds an address with the language of the page, saying whether it was invited', async () => {
    const post = vi.fn<Call>((_path, _body, schema) =>
      Promise.resolve(schema.parse({ person: PERSON_WIRE, added: true })),
    );

    await expect(serviceWith({ post }).add(PROJECT, ' ana@example.com ', 'pt-BR')).resolves.toEqual(
      { kind: 'added', person: PERSON, invited: true },
    );
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      `/v1/projects/${PROJECT}/people`,
      { email: 'ana@example.com', locale: 'pt-BR' },
    ]);
  });

  it.each([
    [new ApiRequestError('/p', 409, PEOPLE_ERROR_CODES.limitReached), 'limitReached'],
    [
      new ApiRequestError('/p', 409, PEOPLE_ERROR_CODES.subscriptionRequired),
      'subscriptionRequired',
    ],
    [new ApiRequestError('/p', 400, 'validation_failed'), 'invalidEmail'],
  ])('answers the refusal %s as %s', async (failure, kind) => {
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).add(PROJECT, 'x@example.com', 'en')).resolves.toEqual({
      kind,
    });
  });

  it.each([[new ApiRequestError('/p', 409, 'something_else')], [new UnauthenticatedError()]])(
    'lets %s through when adding',
    async (failure) => {
      const post = vi.fn(() => Promise.reject(failure));

      await expect(serviceWith({ post }).add(PROJECT, 'x@example.com', 'en')).rejects.toBe(failure);
    },
  );

  it('removes someone, with both ids escaped, and treats someone already gone as removed', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());
    const gone = vi.fn(() => Promise.reject(new ApiNotFoundError('/p')));

    await expect(serviceWith({ delete: remove }).remove('p/1', 'u/2')).resolves.toEqual({
      kind: 'removed',
    });
    expect(remove).toHaveBeenCalledWith('/v1/projects/p%2F1/people/u%2F2');
    await expect(serviceWith({ delete: gone }).remove(PROJECT, 'u2')).resolves.toEqual({
      kind: 'removed',
    });
  });

  it('answers that the owner stays, and lets other failures through', async () => {
    const ownerStays = vi.fn(() =>
      Promise.reject(new ApiRequestError('/p', 409, PEOPLE_ERROR_CODES.ownerStays)),
    );
    const failure = new UnauthenticatedError();
    const signedOut = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ delete: ownerStays }).remove(PROJECT, 'u1')).resolves.toEqual({
      kind: 'ownerStays',
    });
    await expect(serviceWith({ delete: signedOut }).remove(PROJECT, 'u1')).rejects.toBe(failure);
  });
});

describe('MockProjectPeopleService', () => {
  const service = new MockProjectPeopleService(() => NOW);

  it('lists the demo owner and one invented member', async () => {
    const people = await service.list();

    expect(people.map((person) => [person.email, person.role])).toEqual([
      ['owner@example.com', 'owner'],
      ['analyst@example.com', 'member'],
    ]);
  });

  it('adds anyone as an invited member, now', async () => {
    await expect(service.add(PROJECT, ' New@Example.com ')).resolves.toEqual({
      kind: 'added',
      invited: true,
      person: {
        adminUserId: DEMO_PEOPLE_IDS.added,
        email: 'new@example.com',
        role: 'member',
        addedAt: NOW.toISOString(),
      },
    });
  });

  it('keeps the owner and removes anyone else', async () => {
    await expect(service.remove(PROJECT, DEMO_PEOPLE_IDS.owner)).resolves.toEqual({
      kind: 'ownerStays',
    });
    await expect(service.remove(PROJECT, DEMO_PEOPLE_IDS.member)).resolves.toEqual({
      kind: 'removed',
    });
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    const outcome = await new MockProjectPeopleService().add(PROJECT, 'x@example.com');
    vi.useRealTimers();

    expect(outcome.kind === 'added' && outcome.person.addedAt).toBe(NOW.toISOString());
  });
});

describe('createProjectPeopleService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    expect(createProjectPeopleService()).toBeInstanceOf(HttpProjectPeopleService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createProjectPeopleService()).toBeInstanceOf(MockProjectPeopleService);
  });
});
