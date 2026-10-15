import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectExport } from '@/domain/exports';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { GET } from './download/route';
import ExportPage, { generateMetadata } from './page';

const NOW = new Date('2026-11-20T12:00:00.000Z');
const DONE: ProjectExport = {
  id: 'e1',
  status: 'done',
  requestedAt: '2026-11-20T11:58:00.000Z',
  finishedAt: '2026-11-20T11:59:00.000Z',
  eventCount: 12_480,
  availableUntil: '2026-11-27T11:59:00.000Z',
  downloadUrl: 'https://s3.example.com/exports/p-store/e1.csv.gz?signed',
};

const state = vi.hoisted<{ get: (projectId: string, exportId: string) => Promise<ProjectExport> }>(
  () => ({ get: () => Promise.reject(new Error('get not set')) }),
);

vi.mock('@/services/exports/exports-service.factory', () => ({
  createExportsService: () => ({
    get: (projectId: string, exportId: string) => state.get(projectId, exportId),
  }),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({
        email: 'owner@demo-store.example',
        projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
      }),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ refresh: vi.fn() }),
}));

const PARAMS = { params: Promise.resolve({ projectId: 'p-store', exportId: 'e1' }) };

function download() {
  return GET(new Request('https://app.pyxis.example.com/p-store/exports/e1/download'), PARAMS);
}

describe('the export of a project', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    state.get = () => Promise.resolve(DONE);
  });

  it('shows the export under its title, with the download', async () => {
    const get = vi.fn(() => Promise.resolve(DONE));
    state.get = get;

    renderWithMessages(await ExportPage(PARAMS));

    expect(get).toHaveBeenCalledWith('p-store', 'e1');
    expect(screen.getByRole('heading', { level: 1, name: 'Export' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download the file' })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('is titled after the export and the project', async () => {
    await expect(generateMetadata(PARAMS)).resolves.toEqual({ title: 'Export · Demo Store' });
    vi.useRealTimers();
  });

  it('sends a download to a link signed just now', async () => {
    const response = await download();

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(DONE.downloadUrl);
    vi.useRealTimers();
  });

  it('sends a download of a file that is not ready back to the export page', async () => {
    state.get = () => Promise.resolve({ ...DONE, status: 'pending', downloadUrl: null });

    const response = await download();

    expect(response.headers.get('location')).toBe(
      'https://app.pyxis.example.com/p-store/exports/e1',
    );
    vi.useRealTimers();
  });

  it('serves the demo file from the dashboard itself', async () => {
    state.get = () => Promise.resolve({ ...DONE, downloadUrl: '/demo/events-export.csv' });

    const response = await download();

    expect(response.headers.get('location')).toBe(
      'https://app.pyxis.example.com/demo/events-export.csv',
    );
    vi.useRealTimers();
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.get = () => Promise.reject(new UnauthenticatedError());

    await expect(download()).rejects.toThrow(/^redirect:\/sign-in\?expired=1/);
    vi.useRealTimers();
  });
});
