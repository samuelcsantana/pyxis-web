import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { ApiRequestError } from '@/domain/errors';
import { MockRequestsService } from '@/services/requests/mock-requests-service';
import type { IRequestsService } from '@/services/requests/requests-service.interface';
import { GET } from './route';

const state = vi.hoisted<{
  requests: IRequestsService['requests'];
  failedReads: IRequestsService['failedReads'];
}>(() => ({
  requests: () => Promise.reject(new Error('requests not set')),
  failedReads: () => Promise.reject(new Error('failed reads not set')),
}));

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

vi.mock('@/services/requests/requests-service.factory', () => ({
  createRequestsService: (): IRequestsService => ({
    requests: (projectId, range, screenPath) => state.requests(projectId, range, screenPath),
    failedReads: (projectId, range, screenPath) => state.failedReads(projectId, range, screenPath),
    routeDays: () => Promise.reject(new Error('the export reads no route days')),
  }),
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

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(ADMIN) }),
}));

const RANGE = { from: '2026-09-30', to: '2026-10-06' };

function download(query: string) {
  return GET(new NextRequest(`https://pyxis.example.com/p-store/requests/export?${query}`), {
    params: Promise.resolve({ projectId: 'p-store' }),
  });
}

function lines(text: string): readonly string[] {
  return text.trimEnd().split('\r\n');
}

beforeEach(() => {
  state.requests = (projectId, range, screenPath) =>
    new MockRequestsService().requests(projectId, range, screenPath);
  state.failedReads = (projectId, range, screenPath) =>
    new MockRequestsService().failedReads(projectId, range, screenPath);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/requests/export', () => {
  it('sends every written route of the period', async () => {
    const report = await new MockRequestsService().requests('p-store', RANGE, null);

    const response = await download('range=7d');

    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-requests-writes-2026-09-30-2026-10-06.csv"',
    );
    const rows = lines(await response.text());
    expect(rows[0]).toBe(
      'method,route,requests,failed,median_duration_ms,p95_duration_ms,statuses',
    );
    expect(rows).toHaveLength(report.routes.length + 1);
  });

  it('keeps only the failing routes and the screen when the link asks for them', async () => {
    const requests = vi.fn<IRequestsService['requests']>((projectId, range, screenPath) =>
      new MockRequestsService().requests(projectId, range, screenPath),
    );
    state.requests = requests;
    const report = await new MockRequestsService().requests('p-store', RANGE, '/checkout');
    const failing = report.routes.filter((route) => route.failed > 0);

    const rows = lines(await (await download('range=7d&show=failing&screen=%2Fcheckout')).text());

    expect(requests).toHaveBeenCalledWith('p-store', RANGE, '/checkout');
    expect(rows).toHaveLength(failing.length + 1);
  });

  it('sends the failed reads, every route of them, under their own name', async () => {
    const report = await new MockRequestsService().failedReads('p-store', RANGE, null);

    const response = await download('range=7d&kind=reads&show=failing');

    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-requests-failed-reads-2026-09-30-2026-10-06.csv"',
    );
    const rows = lines(await response.text());
    expect(rows[0]).toBe('method,route,failed_reads,median_duration_ms,p95_duration_ms,statuses');
    expect(rows).toHaveLength(report.routes.length + 1);
  });

  it('answers not found when the API cannot list failed reads', async () => {
    state.failedReads = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/requests', 400));

    await expect(download('kind=reads')).rejects.toThrow('not-found');
  });
});
