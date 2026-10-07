import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { IFeaturesService } from '@/services/features/features-service.interface';
import { MockFeaturesService } from '@/services/features/mock-features-service';
import { loadPropertyBreakdown } from './actions';

const state = vi.hoisted<{ admin: unknown; properties: IFeaturesService['properties'] }>(() => ({
  admin: undefined,
  properties: () => Promise.reject(new Error('properties not set')),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
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
  createFeaturesService: (): Pick<IFeaturesService, 'properties'> => ({
    properties: (projectId, range, name) => state.properties(projectId, range, name),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
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

    const keys = await loadPropertyBreakdown('p-store', RANGE, 'calculator_result_shown');

    expect(properties).toHaveBeenCalledWith('p-store', RANGE, 'calculator_result_shown');
    expect(keys.map((key) => key.key)).toEqual(['calculator', 'used_plan_preset']);
    expect(keys[0]?.rows.map((row) => row.value)).toEqual(['ifood', '99food']);
  });

  it.each([
    ['an event name that is not one', { ...RANGE }, 'Not An Event'],
    ['a date that is not one', { from: 'yesterday', to: RANGE.to }, 'cta_clicked'],
  ])('refuses %s', async (_label, range, name) => {
    await expect(loadPropertyBreakdown('p-store', range, name)).rejects.toThrow(
      'A property breakdown needs a valid range and event name.',
    );
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(
      loadPropertyBreakdown('p-other', RANGE, 'calculator_result_shown'),
    ).rejects.toThrow('not-found');
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.properties = () => Promise.reject(new UnauthenticatedError());

    await expect(
      loadPropertyBreakdown('p-store', RANGE, 'calculator_result_shown'),
    ).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
