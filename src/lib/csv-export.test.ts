import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { type CsvFileReader, csvExport, csvResponse, exportHref } from './csv-export';

const state = vi.hoisted<{ admin: unknown }>(() => ({ admin: undefined }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

const FILE = {
  nameParts: ['overview', 'pages', '2026-09-30', '2026-10-06'],
  table: { columns: ['path', 'visits'], rows: [['/pricing', 4]] },
} as const;

function download(read: CsvFileReader, path = '/p-store/overview/export?range=7d') {
  return csvExport(read)(new NextRequest(`https://pyxis.example.com${path}`), {
    params: Promise.resolve({ projectId: path.split('/')[1] ?? '' }),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('exportHref', () => {
  it('points at the export beside the screen, with the query', () => {
    expect(exportHref('p 1', 'overview', 'range=7d&table=pages')).toBe(
      '/p%201/overview/export?range=7d&table=pages',
    );
  });

  it('leaves the question mark out without a query', () => {
    expect(exportHref('p1', 'requests', '')).toBe('/p1/requests/export');
  });
});

describe('csvResponse', () => {
  it('sends the table as a private CSV attachment named after its parts', async () => {
    const response = csvResponse(FILE);

    expect(response.headers.get('content-type')).toBe('text/csv; charset=utf-8');
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-overview-pages-2026-09-30-2026-10-06.csv"',
    );
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder().decode(bytes)).toBe('path,visits\r\n/pricing,4\r\n');
  });
});

describe('csvExport', () => {
  it('reads the file of the project for the period and the search of the link', async () => {
    const read = vi.fn<CsvFileReader>(() => Promise.resolve(FILE));

    const response = await download(read, '/p-store/overview/export?range=7d&table=pages');

    expect(response.status).toBe(200);
    expect(read).toHaveBeenCalledWith({
      project: ADMIN.projects[0],
      period: { preset: '7d', from: '2026-09-30', to: '2026-10-06' },
      search: { range: '7d', table: 'pages' },
    });
  });

  it('answers not found for a project the admin may not read', async () => {
    const read = vi.fn<CsvFileReader>(() => Promise.resolve(FILE));

    await expect(download(read, '/p-other/overview/export')).rejects.toThrow('not-found');
    expect(read).not.toHaveBeenCalled();
  });

  it('answers not found when the screen has no such file', async () => {
    await expect(download(() => Promise.resolve(null))).rejects.toThrow('not-found');
  });

  it('sends an expired session back to the sign-in page', async () => {
    await expect(download(() => Promise.reject(new UnauthenticatedError()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
