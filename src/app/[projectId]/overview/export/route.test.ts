import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { MockOverviewService } from '@/services/overview/mock-overview-service';
import type { IOverviewService } from '@/services/overview/overview-service.interface';
import { GET } from './route';

const state = vi.hoisted<{ overview: IOverviewService['overview'] }>(() => ({
  overview: () => Promise.reject(new Error('overview not set')),
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

vi.mock('@/services/overview/overview-service.factory', () => ({
  createOverviewService: (): IOverviewService => ({
    overview: (projectId, range) => state.overview(projectId, range),
    timeOfDay: (projectId, range) => new MockOverviewService().timeOfDay(projectId, range),
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

function download(query: string) {
  return GET(new NextRequest(`https://pyxis.example.com/p-store/overview/export?${query}`), {
    params: Promise.resolve({ projectId: 'p-store' }),
  });
}

function lines(text: string): readonly string[] {
  return text.trimEnd().split('\r\n');
}

beforeEach(() => {
  state.overview = (projectId, range) => new MockOverviewService().overview(projectId, range);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/overview/export', () => {
  it('sends the activity per day of the period when no table is named', async () => {
    const overview = vi.fn<IOverviewService['overview']>((projectId, range) =>
      new MockOverviewService().overview(projectId, range),
    );
    state.overview = overview;

    const response = await download('range=7d');

    expect(overview).toHaveBeenCalledWith('p-store', { from: '2026-09-30', to: '2026-10-06' });
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-overview-daily-2026-09-30-2026-10-06.csv"',
    );
    const rows = lines(await response.text());
    expect(rows[0]).toBe(
      'date,page_views,events,visits,identified_users,conversion_events,converting_visits,write_requests,failed_writes',
    );
    expect(rows).toHaveLength(8);
    expect(rows[1]).toMatch(/^2026-09-30,/);
  });

  it('sends the top pages and the top events when they are named', async () => {
    const pages = lines(await (await download('range=30d&table=pages')).text());
    const events = lines(await (await download('range=30d&table=events')).text());

    expect(pages[0]).toBe('path,page_views,visits');
    expect(pages.length).toBeGreaterThan(1);
    expect(events[0]).toBe('event,count,visits');
    expect(events.length).toBeGreaterThan(1);
  });

  it('answers not found for a table the screen does not have, without reading', async () => {
    const overview = vi.fn<IOverviewService['overview']>();
    state.overview = overview;

    await expect(download('table=visitors')).rejects.toThrow('not-found');
    expect(overview).not.toHaveBeenCalled();
  });
});
