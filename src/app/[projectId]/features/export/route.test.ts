import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { IFeaturesService } from '@/services/features/features-service.interface';
import { MockFeaturesService } from '@/services/features/mock-features-service';
import { GET } from './route';

const state = vi.hoisted<{ features: IFeaturesService['features'] }>(() => ({
  features: () => Promise.reject(new Error('features not set')),
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

vi.mock('@/services/features/features-service.factory', () => ({
  createFeaturesService: (): IFeaturesService => ({
    features: (projectId, range, kind) => state.features(projectId, range, kind),
    properties: () => Promise.reject(new Error('properties are not exported')),
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
  return GET(new NextRequest(`https://pyxis.example.com/p-store/features/export?${query}`), {
    params: Promise.resolve({ projectId: 'p-store' }),
  });
}

function lines(text: string): readonly string[] {
  return text.trimEnd().split('\r\n');
}

beforeEach(() => {
  state.features = (projectId, range, kind) =>
    new MockFeaturesService().features(projectId, range, kind);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/features/export', () => {
  it('sends every event of the period when no kind is named', async () => {
    const report = await new MockFeaturesService().features('p-store', RANGE, 'events');

    const response = await download('range=7d');

    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-features-events-2026-09-30-2026-10-06.csv"',
    );
    const rows = lines(await response.text());
    expect(rows[0]).toBe('event,count,visits');
    expect(rows).toHaveLength(report.items.length + 1);
  });

  it('sends the screens the search finds', async () => {
    const features = vi.fn<IFeaturesService['features']>((projectId, range, kind) =>
      new MockFeaturesService().features(projectId, range, kind),
    );
    state.features = features;

    const rows = lines(await (await download('range=7d&kind=screens&q=orders')).text());

    expect(features).toHaveBeenCalledWith('p-store', RANGE, 'screens');
    expect(rows[0]).toBe('screen,page_views,visits');
    expect(rows.length).toBeGreaterThan(1);
    expect(rows.slice(1).every((row) => row.startsWith('/orders'))).toBe(true);
  });
});
