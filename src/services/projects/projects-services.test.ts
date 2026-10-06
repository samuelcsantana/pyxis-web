import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { HttpProjectsService } from './http-projects-service';
import { DEMO_ADMIN, MockProjectsService } from './mock-projects-service';
import { createProjectsService } from './projects-service.factory';

const API = 'https://api.pyxis.example.com';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

describe('HttpProjectsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads /v1/me and maps the answer', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            email: 'ana@example.com',
            projects: [{ id: 'p1', name: 'Shop', timezone: 'UTC', conversion_event: null }],
          }),
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const admin = await new HttpProjectsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).currentAdmin();

    expect(admin).toEqual({
      email: 'ana@example.com',
      projects: [{ id: 'p1', name: 'Shop', timezone: 'UTC', conversionEvent: null }],
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/me`);
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
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createProjectsService()).toBeInstanceOf(HttpProjectsService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createProjectsService()).toBeInstanceOf(MockProjectsService);
  });
});
