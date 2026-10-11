import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectIcon } from '@/domain/admin';
import { GET, PROJECT_ICON_CACHE_CONTROL } from './route';

const state = vi.hoisted<{ icon: (projectId: string) => Promise<ProjectIcon | null> }>(() => ({
  icon: () => Promise.resolve(null),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ icon: (projectId: string) => state.icon(projectId) }),
}));

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);

function ask(projectId = 'p-store') {
  return GET(new Request(`https://app.example.com/${projectId}/icon?v=1`), {
    params: Promise.resolve({ projectId }),
  });
}

describe('GET /[projectId]/icon', () => {
  beforeEach(() => {
    state.icon = () => Promise.resolve(null);
  });

  it('answers the icon of the project with its type, a private cache and nosniff', async () => {
    const asked: string[] = [];
    state.icon = (projectId) => {
      asked.push(projectId);
      return Promise.resolve({ contentType: 'image/png', bytes: PNG.buffer });
    };

    const response = await ask();

    expect(asked).toEqual(['p-store']);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(response.headers.get('cache-control')).toBe(PROJECT_ICON_CACHE_CONTROL);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(PNG);
  });

  it('answers 404 when the project has no icon', async () => {
    expect((await ask()).status).toBe(404);
  });

  it('answers 401 when there is no session', async () => {
    state.icon = () => Promise.reject(new UnauthenticatedError());

    expect((await ask()).status).toBe(401);
  });

  it('lets any other failure through', async () => {
    state.icon = () => Promise.reject(new Error('API down'));

    await expect(ask()).rejects.toThrow('API down');
  });
});
