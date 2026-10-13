import { describe, expect, it, vi } from 'vitest';
import { screenMetadata } from './screen-metadata';

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () =>
      Promise.resolve({
        email: 'owner@demo-store.example',
        projects: [
          {
            id: 'p-store',
            name: 'Demo Store',
            timezone: 'America/Sao_Paulo',
            conversionEvent: null,
          },
        ],
      }),
  }),
}));

describe('screenMetadata', () => {
  it('titles a screen with the name of its project', async () => {
    const metadata = await screenMetadata('overview')({
      params: Promise.resolve({ projectId: 'p-store' }),
    });

    expect(metadata.title).toBe('Overview · Demo Store');
  });

  it('gives a demo screen its address without filters as the canonical one', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const metadata = await screenMetadata('visits')({
      params: Promise.resolve({ projectId: 'p-store' }),
    });

    expect(metadata.alternates?.canonical).toBe('https://demo.pyxis-analytics.dev/p-store/visits');
  });

  it('gives a screen of a dashboard with a real API no canonical address', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const metadata = await screenMetadata('visits')({
      params: Promise.resolve({ projectId: 'p-store' }),
    });

    expect(metadata.alternates).toBeUndefined();
  });

  it('answers not found for any other project, so the 404 names itself in the title', async () => {
    await expect(
      screenMetadata('overview')({ params: Promise.resolve({ projectId: 'p-other' }) }),
    ).rejects.toThrow('not-found');
  });
});
