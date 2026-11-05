import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { ApiWriter } from '../api-writer';
import { createEmailPreferencesService } from './email-preferences-service.factory';
import { HttpEmailPreferencesService } from './http-email-preferences-service';
import { MockEmailPreferencesService } from './mock-email-preferences-service';

const API = 'https://api.pyxis.example.com';
const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const STORED_WIRE = {
  weekly_digest: true,
  no_events_alert: false,
  failed_writes_alert: true,
  conversion_drop_alert: true,
};
const STORED = {
  weeklyDigest: true,
  noEventsAlert: false,
  failedWritesAlert: true,
  conversionDropAlert: true,
};

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

  it("reads the signed-in person's four e-mail preferences for the project", async () => {
    const fetchMock = answering(STORED_WIRE);

    await expect(httpService().preferences(PROJECT_ID)).resolves.toEqual(STORED);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/projects/${PROJECT_ID}/email-preferences`);
  });

  it.each([
    ['weeklyDigest', '{"weekly_digest":false}'],
    ['noEventsAlert', '{"no_events_alert":false}'],
    ['failedWritesAlert', '{"failed_writes_alert":false}'],
    ['conversionDropAlert', '{"conversion_drop_alert":false}'],
  ] as const)('puts only the %s that changed and maps the answer', async (preference, body) => {
    const fetchMock = answering(STORED_WIRE);

    await expect(httpService().choose(PROJECT_ID, { preference, on: false })).resolves.toEqual(
      STORED,
    );
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(`${API}/v1/projects/${PROJECT_ID}/email-preferences`);
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBe(body);
  });
});

describe('MockEmailPreferencesService', () => {
  it('turns every demo e-mail on and keeps the choice it was given, sending nothing', async () => {
    const service = new MockEmailPreferencesService();

    await expect(service.preferences()).resolves.toEqual({
      weeklyDigest: true,
      noEventsAlert: true,
      failedWritesAlert: true,
      conversionDropAlert: true,
    });
    await expect(
      service.choose(PROJECT_ID, { preference: 'conversionDropAlert', on: false }),
    ).resolves.toEqual({
      weeklyDigest: true,
      noEventsAlert: true,
      failedWritesAlert: true,
      conversionDropAlert: false,
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
