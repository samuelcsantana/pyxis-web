import { afterEach, describe, expect, it, vi } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { Goal } from '@/domain/goals';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { DEMO_STORE } from '../demo/demo-projects';
import { createGoalsService } from './goals-service.factory';
import { GOAL_ERROR_CODES, HttpGoalsService } from './http-goals-service';
import { DEMO_CREATED_GOAL_ID, MockGoalsService } from './mock-goals-service';

const PROJECT = '6f1d3c2a-8b4e-4c5d-9e6f-7a8b9c0d1e2f';
const GOAL_ID = '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b';
const NOW = new Date('2026-10-06T02:30:00.000Z');
const GOAL_WIRE = {
  id: GOAL_ID,
  name: 'Sign-up',
  type: 'event',
  event: 'signup_completed',
  path: null,
  position: 1,
  created_at: '2026-11-04T12:00:00.000Z',
};
const GOAL: Goal = {
  id: GOAL_ID,
  name: 'Sign-up',
  kind: 'event',
  target: 'signup_completed',
  position: 1,
};
const PAGE_CHANGES = { name: 'Thanks', kind: 'page', target: '/thanks' } as const;

type Call = (
  path: string,
  body: unknown,
  schema: { parse(body: unknown): unknown },
) => Promise<unknown>;
type Read = (path: string, schema: { parse(body: unknown): unknown }) => Promise<unknown>;

function serviceWith(writer: Record<string, unknown>, reader: Record<string, unknown> = {}) {
  return new HttpGoalsService(reader as unknown as ApiReader, writer as unknown as ApiWriter);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('HttpGoalsService', () => {
  it('lists the goals of a project, with its id escaped', async () => {
    const get = vi.fn<Read>((_path, schema) =>
      Promise.resolve(schema.parse({ goals: [GOAL_WIRE] })),
    );

    await expect(serviceWith({}, { get }).list('p/1')).resolves.toEqual([GOAL]);
    expect(get.mock.calls[0]?.[0]).toBe('/v1/projects/p%2F1/goals');
  });

  it('asks the summary over the range and the visit filters, never for one goal', async () => {
    const get = vi.fn<Read>((_path, schema) =>
      Promise.resolve(schema.parse({ visits: 10, goals: [] })),
    );

    await serviceWith({}, { get }).summary(PROJECT, {
      from: '2026-09-29',
      to: '2026-10-05',
      filters: { ...NO_DASHBOARD_FILTERS, reachedGoal: GOAL_ID, device: 'mobile' },
      goal: GOAL_ID,
    });

    expect(get.mock.calls[0]?.[0]).toBe(
      `/v1/projects/${PROJECT}/goals/summary?from=2026-09-29&to=2026-10-05&device=mobile&reached_goal=${GOAL_ID}`,
    );
  });

  it('creates a goal with the field of its kind', async () => {
    const post = vi.fn<Call>((_path, _body, schema) => Promise.resolve(schema.parse(GOAL_WIRE)));

    await expect(serviceWith({ post }).create(PROJECT, PAGE_CHANGES)).resolves.toEqual({
      kind: 'saved',
      goal: GOAL,
    });
    expect(post.mock.calls[0]?.slice(0, 2)).toEqual([
      `/v1/projects/${PROJECT}/goals`,
      { name: 'Thanks', path: '/thanks' },
    ]);
  });

  it('changes a goal at its own address', async () => {
    const patch = vi.fn<Call>((_path, _body, schema) => Promise.resolve(schema.parse(GOAL_WIRE)));

    await expect(
      serviceWith({ patch }).update(PROJECT, GOAL_ID, {
        name: 'Sign-up',
        kind: 'event',
        target: 'signup_completed',
      }),
    ).resolves.toEqual({ kind: 'saved', goal: GOAL });
    expect(patch.mock.calls[0]?.slice(0, 2)).toEqual([
      `/v1/projects/${PROJECT}/goals/${GOAL_ID}`,
      { name: 'Sign-up', event: 'signup_completed' },
    ]);
  });

  it.each([
    [new ApiRequestError('/g', 400, GOAL_ERROR_CODES.invalid), 'invalid'],
    [new ApiRequestError('/g', 409, GOAL_ERROR_CODES.limitReached), 'limitReached'],
    [new ApiRequestError('/g', 409, GOAL_ERROR_CODES.subscriptionRequired), 'subscriptionRequired'],
    [new ApiNotFoundError('/g'), 'notFound'],
  ])('answers the refusal %s as %s, when creating and when changing', async (failure, kind) => {
    const refuse = vi.fn(() => Promise.reject(failure));
    const service = serviceWith({ post: refuse, patch: refuse });

    await expect(service.create(PROJECT, PAGE_CHANGES)).resolves.toEqual({ kind });
    await expect(service.update(PROJECT, GOAL_ID, PAGE_CHANGES)).resolves.toEqual({ kind });
  });

  it.each([[new ApiRequestError('/g', 409, 'something_else')], [new UnauthenticatedError()]])(
    'lets %s through when saving',
    async (failure) => {
      const refuse = vi.fn(() => Promise.reject(failure));

      await expect(serviceWith({ post: refuse }).create(PROJECT, PAGE_CHANGES)).rejects.toBe(
        failure,
      );
    },
  );

  it('deletes a goal, taking one that is already gone as deleted', async () => {
    const remove = vi.fn(() => Promise.resolve());
    const gone = vi.fn(() => Promise.reject(new ApiNotFoundError('/g')));

    await expect(serviceWith({ delete: remove }).remove(PROJECT, GOAL_ID)).resolves.toEqual({
      kind: 'deleted',
    });
    expect(remove).toHaveBeenCalledWith(`/v1/projects/${PROJECT}/goals/${GOAL_ID}`);
    await expect(serviceWith({ delete: gone }).remove(PROJECT, GOAL_ID)).resolves.toEqual({
      kind: 'deleted',
    });
  });

  it('answers a deletion the plan refuses, and lets any other failure through', async () => {
    const refused = vi.fn(() =>
      Promise.reject(new ApiRequestError('/g', 409, GOAL_ERROR_CODES.subscriptionRequired)),
    );
    const failure = new UnauthenticatedError();
    const failing = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ delete: refused }).remove(PROJECT, GOAL_ID)).resolves.toEqual({
      kind: 'subscriptionRequired',
    });
    await expect(serviceWith({ delete: failing }).remove(PROJECT, GOAL_ID)).rejects.toBe(failure);
  });
});

describe('MockGoalsService', () => {
  const service = new MockGoalsService(() => NOW);

  it('lists the invented goals of the demo store, events and pages', async () => {
    const goals = await service.list(DEMO_STORE.id);

    expect(goals).toEqual(DEMO_STORE.goals);
    expect(goals.map((goal) => goal.kind)).toEqual(['event', 'event', 'page', 'page']);
  });

  it('counts each goal over the visits of the range', async () => {
    const summary = await service.summary(DEMO_STORE.id, {
      from: '2026-09-06',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
    });

    expect(summary.visits).toBeGreaterThan(0);
    expect(summary.goals.map((goal) => goal.name)).toEqual(
      DEMO_STORE.goals.map((goal) => goal.name),
    );
    for (const goal of summary.goals) {
      expect(goal.convertingVisits).toBeGreaterThan(0);
      expect(goal.conversions).toBeGreaterThanOrEqual(goal.convertingVisits);
      expect(goal.conversionRate).toBeCloseTo(goal.convertingVisits / summary.visits);
    }
  });

  it('answers a new goal after the last one, and refuses one past the limit', async () => {
    const full = new MockGoalsService(
      () => NOW,
      () => Array.from({ length: 10 }, (_, position) => ({ ...GOAL, position })),
    );

    await expect(service.create(DEMO_STORE.id, PAGE_CHANGES)).resolves.toEqual({
      kind: 'saved',
      goal: { id: DEMO_CREATED_GOAL_ID, ...PAGE_CHANGES, position: 6 },
    });
    await expect(
      new MockGoalsService(
        () => NOW,
        () => [],
      ).create('p1', PAGE_CHANGES),
    ).resolves.toMatchObject({ goal: { position: 1 } });
    await expect(full.create('p1', PAGE_CHANGES)).resolves.toEqual({ kind: 'limitReached' });
  });

  it('answers a changed goal, a goal it does not know, and every deletion', async () => {
    const [first] = DEMO_STORE.goals;

    await expect(service.update(DEMO_STORE.id, String(first?.id), PAGE_CHANGES)).resolves.toEqual({
      kind: 'saved',
      goal: { ...first, ...PAGE_CHANGES },
    });
    await expect(service.update(DEMO_STORE.id, GOAL_ID, PAGE_CHANGES)).resolves.toEqual({
      kind: 'notFound',
    });
    await expect(service.remove()).resolves.toEqual({ kind: 'deleted' });
  });

  it('reads the clock of the moment by default', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    const summary = await new MockGoalsService().summary(DEMO_STORE.id, {
      from: '2026-10-05',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
    });

    vi.useRealTimers();
    expect(summary.goals).toHaveLength(DEMO_STORE.goals.length);
  });
});

describe('createGoalsService', () => {
  it('reads the API when its address is set, and the demo otherwise', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.example.com');
    expect(createGoalsService()).toBeInstanceOf(HttpGoalsService);

    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    expect(createGoalsService()).toBeInstanceOf(MockGoalsService);
  });
});
