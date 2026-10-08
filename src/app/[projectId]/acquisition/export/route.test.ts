import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { IAcquisitionService } from '@/services/acquisition/acquisition-service.interface';
import { MockAcquisitionService } from '@/services/acquisition/mock-acquisition-service';
import { GET } from './route';

const state = vi.hoisted<{ acquisition: IAcquisitionService['acquisition'] }>(() => ({
  acquisition: () => Promise.reject(new Error('acquisition not set')),
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

vi.mock('@/services/acquisition/acquisition-service.factory', () => ({
  createAcquisitionService: (): IAcquisitionService => ({
    acquisition: (projectId, range) => state.acquisition(projectId, range),
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
  return GET(new NextRequest(`https://pyxis.example.com/p-store/acquisition/export?${query}`), {
    params: Promise.resolve({ projectId: 'p-store' }),
  });
}

function lines(text: string): readonly string[] {
  return text.trimEnd().split('\r\n');
}

beforeEach(() => {
  state.acquisition = (projectId, range) =>
    new MockAcquisitionService().acquisition(projectId, range);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/acquisition/export', () => {
  it('sends the sources of the period when no table is named', async () => {
    const acquisition = vi.fn<IAcquisitionService['acquisition']>((projectId, range) =>
      new MockAcquisitionService().acquisition(projectId, range),
    );
    state.acquisition = acquisition;

    const response = await download('range=7d');

    expect(acquisition).toHaveBeenCalledWith('p-store', { from: '2026-09-30', to: '2026-10-06' });
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-acquisition-sources-2026-09-30-2026-10-06.csv"',
    );
    expect(lines(await response.text())[0]).toBe(
      'source,medium,channel,visits,conversion_events,converting_visits,ad_click_visits',
    );
  });

  it('sends one row per day split by channel', async () => {
    const rows = lines(await (await download('range=7d&table=channels')).text());

    expect(rows[0]).toBe('date,paid,email,social,campaign,organic,referral,direct');
    expect(rows).toHaveLength(8);
  });

  it('answers not found for a table the screen does not have, without reading', async () => {
    const acquisition = vi.fn<IAcquisitionService['acquisition']>();
    state.acquisition = acquisition;

    await expect(download('table=campaigns')).rejects.toThrow('not-found');
    expect(acquisition).not.toHaveBeenCalled();
  });
});
