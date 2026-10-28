import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { IFeaturesService } from '@/services/features/features-service.interface';
import { MockFeaturesService } from '@/services/features/mock-features-service';
import { loadPropertyBreakdown, loadPropertySummary } from './actions';

const state = vi.hoisted<{
  admin: unknown;
  properties: IFeaturesService['properties'];
  summary: IFeaturesService['summary'];
}>(() => ({
  summary: () => Promise.reject(new Error('summary not set')),
  admin: undefined,
  properties: () => Promise.reject(new Error('properties not set')),
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
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/features/features-service.factory', () => ({
  createFeaturesService: (): Pick<IFeaturesService, 'properties' | 'summary'> => ({
    properties: (projectId, range, name) => state.properties(projectId, range, name),
    summary: (projectId, range, request) => state.summary(projectId, range, request),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@example.com',
  projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
};
const RANGE = { from: '2026-09-29', to: '2026-10-05' };

beforeEach(() => {
  state.admin = ADMIN;
  state.properties = (projectId, range, name) =>
    new MockFeaturesService().properties(projectId, range, name);
});

describe('loadPropertyBreakdown', () => {
  it('reads one event of the range and shapes its keys for the screen', async () => {
    const properties = vi.fn<IFeaturesService['properties']>((projectId, range, name) =>
      new MockFeaturesService().properties(projectId, range, name),
    );
    state.properties = properties;

    const keys = await loadPropertyBreakdown('p-store', RANGE, {}, 'calculator_result_shown');

    expect(properties).toHaveBeenCalledWith(
      'p-store',
      { ...RANGE, filters: NO_DASHBOARD_FILTERS },
      'calculator_result_shown',
    );
    expect(keys.map((key) => key.key)).toEqual(['calculator', 'used_plan_preset']);
    expect(keys[0]?.rows.map((row) => row.value)).toEqual(['shipping', 'margin']);
  });

  it('reads the event within the dashboard filters it was given', async () => {
    const properties = vi.fn<IFeaturesService['properties']>((projectId, range, name) =>
      new MockFeaturesService().properties(projectId, range, name),
    );
    state.properties = properties;

    await loadPropertyBreakdown(
      'p-store',
      RANGE,
      { device: 'mobile', browser: 'netscape' },
      'calculator_result_shown',
    );

    expect(properties).toHaveBeenCalledWith(
      'p-store',
      { ...RANGE, filters: { ...NO_DASHBOARD_FILTERS, device: 'mobile' } },
      'calculator_result_shown',
    );
  });

  it.each([
    ['an event name that is not one', { ...RANGE }, {}, 'Not An Event'],
    ['a date that is not one', { from: 'yesterday', to: RANGE.to }, {}, 'cta_clicked'],
    ['filters that are not texts', { ...RANGE }, { device: 1 }, 'cta_clicked'],
  ])('refuses %s', async (_label, range, filters, name) => {
    await expect(
      loadPropertyBreakdown(
        'p-store',
        range,
        filters as unknown as Readonly<Record<string, string>>,
        name,
      ),
    ).rejects.toThrow('A property breakdown needs a valid range, filters and event name.');
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(
      loadPropertyBreakdown('p-other', RANGE, {}, 'calculator_result_shown'),
    ).rejects.toThrow('not-found');
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.properties = () => Promise.reject(new UnauthenticatedError());

    await expect(
      loadPropertyBreakdown('p-store', RANGE, {}, 'calculator_result_shown'),
    ).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});

describe('loadPropertySummary', () => {
  it('reads the median of one property within the filters and shapes it for the screen', async () => {
    const summary = vi.fn<IFeaturesService['summary']>((projectId, range, request) =>
      new MockFeaturesService().summary(projectId, range, request),
    );
    state.summary = summary;

    const view = await loadPropertySummary(
      'p-store',
      RANGE,
      { device: 'mobile' },
      'product_created',
      'price',
      'category',
    );

    expect(summary).toHaveBeenCalledWith(
      'p-store',
      { ...RANGE, filters: { ...NO_DASHBOARD_FILTERS, device: 'mobile' } },
      { name: 'product_created', key: 'price', by: 'category' },
    );
    expect(view.groups.length).toBeGreaterThan(0);
  });

  it.each([
    ['a key that is not a property key', 'Price', null, {}],
    ['a split that is not a property key', 'price', 'a b', {}],
    ['filters that are not texts', 'price', null, { device: 1 }],
  ])('refuses %s', async (_label, key, by, filters) => {
    await expect(
      loadPropertySummary(
        'p-store',
        RANGE,
        filters as unknown as Readonly<Record<string, string>>,
        'product_created',
        key,
        by,
      ),
    ).rejects.toThrow('A property summary needs a valid range, filters, event, key and split.');
  });
});
