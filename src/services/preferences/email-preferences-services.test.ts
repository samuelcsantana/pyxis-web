import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { ApiWriter } from '../api-writer';
import { createEmailPreferencesService } from './email-preferences-service.factory';
import { HttpEmailPreferencesService } from './http-email-preferences-service';
import { MockEmailPreferencesService } from './mock-email-preferences-service';

const API = 'https://api.pyxis.example.com';
const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

function httpService() {
  const session = () => Promise.resolve('token');
  const quiet = () => undefined;
  return new HttpEmailPreferencesService(
    new ApiReader(API, session, quiet),
    new ApiWriter(API, session, quiet),
  );
}

function answering(body: unknown) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(new Response(JSON.stringify(body))));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpEmailPreferencesService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads the signed-in admin's preferences for the project", async () => {
    const fetchMock = answering({ weekly_digest: true });

    await expect(httpService().preferences(PROJECT_ID)).resolves.toEqual({ weeklyDigest: true });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/projects/${PROJECT_ID}/email-preferences`);
  });

  it('puts the chosen preferences in the shape of the contract and maps the answer', async () => {
    const fetchMock = answering({ weekly_digest: false });

    await expect(httpService().choose(PROJECT_ID, { weeklyDigest: false })).resolves.toEqual({
      weeklyDigest: false,
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(`${API}/v1/projects/${PROJECT_ID}/email-preferences`);
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBe('{"weekly_digest":false}');
  });
});

describe('MockEmailPreferencesService', () => {
  it('sends the demo weekly digest and keeps the choice it was given, sending nothing', async () => {
    const service = new MockEmailPreferencesService();

    await expect(service.preferences()).resolves.toEqual({ weeklyDigest: true });
    await expect(service.choose(PROJECT_ID, { weeklyDigest: false })).resolves.toEqual({
      weeklyDigest: false,
    });
  });
});

describe('createEmailPreferencesService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createEmailPreferencesService()).toBeInstanceOf(HttpEmailPreferencesService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createEmailPreferencesService()).toBeInstanceOf(MockEmailPreferencesService);
  });
});
