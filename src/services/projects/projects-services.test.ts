import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { HttpProjectsService } from './http-projects-service';
import { DEMO_ADMIN, MockProjectsService } from './mock-projects-service';
import { createProjectsService } from './projects-service.factory';

const API = 'https://api.pyxis.example.com';
const ME = {
  email: 'ana@example.com',
  projects: [{ id: 'p1', name: 'Shop', timezone: 'UTC', conversion_event: null }],
};

const cookieStore = vi.hoisted(() => ({ value: undefined as string | undefined }));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        name === 'pyxis_session' && cookieStore.value !== undefined
          ? { name, value: cookieStore.value }
          : undefined,
    }),
}));

function answer(status: number, body: unknown = null) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(new Response(body === null ? null : JSON.stringify(body), { status })),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpProjectsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('forwards the session cookie and maps the answer', async () => {
    const fetchMock = answer(200, ME);

    const admin = await new HttpProjectsService(API, () => Promise.resolve('token')).currentAdmin();

    expect(admin).toEqual({
      email: 'ana@example.com',
      projects: [{ id: 'p1', name: 'Shop', timezone: 'UTC', conversionEvent: null }],
    });
    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/me`, {
      headers: { cookie: 'pyxis_session=token', accept: 'application/json' },
      cache: 'no-store',
    });
  });

  it('does not call the API without a session cookie', async () => {
    const fetchMock = answer(200, ME);

    await expect(
      new HttpProjectsService(API, () => Promise.resolve(undefined)).currentAdmin(),
    ).rejects.toThrow(UnauthenticatedError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats 401 as an ended session', async () => {
    answer(401);

    await expect(
      new HttpProjectsService(API, () => Promise.resolve('stale')).currentAdmin(),
    ).rejects.toThrow(UnauthenticatedError);
  });

  it('reports any other failure with its status', async () => {
    answer(503);

    await expect(
      new HttpProjectsService(API, () => Promise.resolve('token')).currentAdmin(),
    ).rejects.toThrow(ApiRequestError);
  });
});

describe('MockProjectsService', () => {
  it('answers the demo admin with two projects', async () => {
    const admin = await new MockProjectsService().currentAdmin();

    expect(admin).toBe(DEMO_ADMIN);
    expect(admin.projects).toHaveLength(2);
  });
});

describe('createProjectsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    cookieStore.value = undefined;
  });

  it('reads the session cookie of the request when the API URL is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);
    cookieStore.value = 'from-the-request';
    const fetchMock = answer(200, ME);

    await createProjectsService().currentAdmin();

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      cookie: 'pyxis_session=from-the-request',
      accept: 'application/json',
    });
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createProjectsService()).toBeInstanceOf(MockProjectsService);
  });
});
