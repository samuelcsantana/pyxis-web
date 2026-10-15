import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { HttpProjectsService } from './http-projects-service';
import { DEMO_DOCS, DEMO_STORE } from '../demo/demo-projects';
import { DEMO_ADMIN, MockProjectsService } from './mock-projects-service';
import { DEMO_ACCOUNT_ID } from './demo-project-settings';
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
            projects: [
              {
                id: 'p1',
                name: 'Shop',
                timezone: 'UTC',
                conversion_event: null,
                ingestion_suspended_at: null,
                ingestion_suspension_reason: null,
              },
            ],
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
      projects: [
        {
          id: 'p1',
          name: 'Shop',
          timezone: 'UTC',
          conversionEvent: null,
          iconVersion: null,
          ingestionSuspendedAt: null,
          ingestionSuspensionReason: null,
        },
      ],
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/me`);
  });

  it('reads the icon of a project as bytes with their type, asking for an image', async () => {
    const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response(png, { headers: { 'content-type': 'image/png' } })),
    );
    vi.stubGlobal('fetch', fetchMock);

    const icon = await new HttpProjectsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).icon('p 1');

    expect(icon?.contentType).toBe('image/png');
    expect(new Uint8Array(icon?.bytes ?? new ArrayBuffer(0))).toEqual(png);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/projects/p%201/icon`);
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({ accept: 'image/*' });
  });

  it('reads no icon when the project has none', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status: 404 }))),
    );

    const icon = await new HttpProjectsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).icon('p1');

    expect(icon).toBeNull();
  });

  it('lets any other failure of the icon through', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(() => Promise.resolve(new Response(null, { status: 503 }))),
    );

    await expect(
      new HttpProjectsService(new ApiReader(API, () => Promise.resolve('token'))).icon('p1'),
    ).rejects.toThrow();
  });

  it('reads the settings of a project and maps the answer', async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: 'p1',
            account_id: 'a1',
            role: 'member',
            name: 'Shop',
            timezone: 'UTC',
            conversion_event: null,
            allowed_origins: ['https://shop.example.com'],
            created_at: '2026-10-01T00:00:00.000Z',
            first_event_at: null,
            last_event_at: null,
            event_retention_months: 13,
            public_keys: [
              { id: 'k1', key: 'pyxis_pk_abc', created_at: '2026-10-01T00:00:00.000Z' },
            ],
            secret_keys: [{ id: 'k2', created_at: '2026-10-02T00:00:00.000Z' }],
            deletion_held_at: null,
          }),
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const settings = await new HttpProjectsService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).settings('p 1');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/projects/p%201/settings`);
    expect(settings).toEqual({
      id: 'p1',
      accountId: 'a1',
      role: 'member',
      name: 'Shop',
      timezone: 'UTC',
      conversionEvent: null,
      allowedOrigins: ['https://shop.example.com'],
      createdAt: '2026-10-01T00:00:00.000Z',
      firstEventAt: null,
      lastEventAt: null,
      eventRetentionMonths: 13,
      publicKeys: [{ id: 'k1', key: 'pyxis_pk_abc', createdAt: '2026-10-01T00:00:00.000Z' }],
      secretKeys: [{ id: 'k2', createdAt: '2026-10-02T00:00:00.000Z' }],
      deletionHeldAt: null,
    });
  });
});

describe('MockProjectsService', () => {
  it('answers the demo admin with two projects', async () => {
    const admin = await new MockProjectsService().currentAdmin();

    expect(admin).toBe(DEMO_ADMIN);
    expect(admin.projects).toHaveLength(2);
  });

  it('has no icon for the invented projects, so the demo shows their initials', async () => {
    await expect(new MockProjectsService().icon()).resolves.toBeNull();
    expect(DEMO_ADMIN.projects.every((project) => project.iconVersion === null)).toBe(true);
  });

  it('answers invented settings for each demo project, with a public key and no secret one', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-08T12:00:00.000Z'));
    const service = new MockProjectsService();

    const store = await service.settings(DEMO_STORE.id);
    const docs = await service.settings(DEMO_DOCS.id);
    vi.useRealTimers();

    expect(store).toMatchObject({
      id: DEMO_STORE.id,
      accountId: DEMO_ACCOUNT_ID,
      role: 'owner',
      name: DEMO_STORE.name,
      allowedOrigins: ['https://store.example.com', 'https://www.store.example.com'],
      lastEventAt: '2026-10-08T12:00:00.000Z',
      eventRetentionMonths: 13,
    });
    expect(docs.allowedOrigins).toEqual(['https://docs.example.com']);
    expect(store.publicKeys[0]?.key).toMatch(/^pyxis_pk_[0-9a-f]{32}$/);
    expect(store.secretKeys).toEqual([
      { id: expect.any(String) as string, createdAt: '2025-02-03T10:00:00.000Z' },
    ]);
    expect(store.publicKeys[0]?.id).not.toBe(store.secretKeys[0]?.id);
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
