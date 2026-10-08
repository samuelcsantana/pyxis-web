import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { NO_VISIT_FILTERS } from '@/domain/visits';
import { MockVisitsService } from '@/services/visits/mock-visits-service';
import type { IVisitsService } from '@/services/visits/visits-service.interface';
import { GET, maxDuration } from './route';

const state = vi.hoisted<{ visits: IVisitsService['visits'] }>(() => ({
  visits: () => Promise.reject(new Error('visits not set')),
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

vi.mock('@/services/visits/visits-service.factory', () => ({
  createVisitsService: (): IVisitsService => ({
    visits: (projectId, range, filters, cursor) => state.visits(projectId, range, filters, cursor),
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
  return GET(new NextRequest(`https://pyxis.example.com/p-store/visits/export?${query}`), {
    params: Promise.resolve({ projectId: 'p-store' }),
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/visits/export', () => {
  it('may run for a minute, the most a Vercel Hobby function gets in every compute mode', () => {
    expect(maxDuration).toBe(60);
  });

  it('sends every visit of the period and filters, reading every page', async () => {
    const visits = vi.fn<IVisitsService['visits']>((projectId, range, filters, cursor) =>
      new MockVisitsService().visits(projectId, range, filters, cursor),
    );
    state.visits = visits;

    const response = await download('range=30d&channel=paid&device=fridge');

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-07', to: '2026-10-06' },
      { ...NO_VISIT_FILTERS, channel: 'paid' },
      null,
    );
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-visits-2026-09-07-2026-10-06.csv"',
    );
    const rows = (await response.text()).trimEnd().split('\r\n');
    expect(rows[0]).toBe(
      'visit_id,started_at,ended_at,entry_path,page_views,highlights,failed_requests,device_type,browser,os,country,channel,user_id',
    );
    expect(rows.length).toBeGreaterThan(1);
    expect(rows.slice(1).every((row) => row.includes(',paid,'))).toBe(true);
  });
});
