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
  it('titles a screen of a project the admin may read', async () => {
    const metadata = await screenMetadata('Overview')({
      params: Promise.resolve({ projectId: 'p-store' }),
    });

    expect(metadata.title).toBe('Overview · Pyxis');
  });

  it('answers not found for any other project, so the 404 names itself in the title', async () => {
    await expect(
      screenMetadata('Overview')({ params: Promise.resolve({ projectId: 'p-other' }) }),
    ).rejects.toThrow('not-found');
  });
});
