import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { DEMO_USER_ID } from '@/services/timeline/demo-timeline';
import { MockTimelineService } from '@/services/timeline/mock-timeline-service';
import type { ITimelineService } from '@/services/timeline/timeline-service.interface';
import { loadOlderVisits } from './actions';

const state = vi.hoisted<{ admin: unknown; timeline: ITimelineService['timeline'] }>(() => ({
  admin: undefined,
  timeline: () => Promise.reject(new Error('timeline not set')),
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

vi.mock('@/services/timeline/timeline-service.factory', () => ({
  createTimelineService: (): ITimelineService => ({
    timeline: (projectId, lookup, before) => state.timeline(projectId, lookup, before),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
};
const NOW = new Date('2026-10-06T02:30:00.000Z');
const CURSOR = '2026-10-03T12:12:04.000Z';

beforeEach(() => {
  state.admin = ADMIN;
  state.timeline = (projectId, lookup, before) =>
    new MockTimelineService().timeline(projectId, lookup, before);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

describe('loadOlderVisits', () => {
  it('reads the page older than the cursor and shapes it for the screen', async () => {
    const timeline = vi.fn<ITimelineService['timeline']>((projectId, lookup, before) =>
      new MockTimelineService().timeline(projectId, lookup, before),
    );
    state.timeline = timeline;

    const page = await loadOlderVisits('p-store', { user: DEMO_USER_ID, show: 'errors' }, CURSOR);

    expect(timeline).toHaveBeenCalledWith('p-store', { kind: 'user', id: DEMO_USER_ID }, CURSOR);
    expect(page.visits).toHaveLength(1);
    expect(page.visits[0]?.heading).toMatch(/^Visit 19c2e5f6 · /);
    expect(page.visits[0]?.items.map((item) => item.title)).toEqual(['POST /auth/verify-code']);
    expect(page.nextBefore).toBeNull();
  });

  it('refuses a lookup or a cursor the API would refuse, without asking it', async () => {
    const timeline = vi.fn<ITimelineService['timeline']>();
    state.timeline = timeline;

    await expect(loadOlderVisits('p-store', { user: 'a b' }, CURSOR)).rejects.toThrow(
      'Older visits need a valid lookup and cursor.',
    );
    await expect(loadOlderVisits('p-store', { user: DEMO_USER_ID }, 'yesterday')).rejects.toThrow(
      'Older visits need a valid lookup and cursor.',
    );
    expect(timeline).not.toHaveBeenCalled();
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(loadOlderVisits('p-other', { user: DEMO_USER_ID }, CURSOR)).rejects.toThrow(
      'not-found',
    );
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.timeline = () => Promise.reject(new UnauthenticatedError());

    await expect(loadOlderVisits('p-store', { user: DEMO_USER_ID }, CURSOR)).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
