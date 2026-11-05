import { describe, expect, it } from 'vitest';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import {
  DEMO_GOAL_CREATED_AT,
  demoConversionTest,
  demoCountedGoal,
  demoGoalsSummaryWire,
  demoGoalsWire,
  demoGoalWire,
} from './demo-goals';
import { DEMO_DOCS, DEMO_STORE } from './demo-projects';

const NOW = new Date('2026-10-06T02:30:00.000Z');
const [SIGN_UP, , PRICING] = DEMO_STORE.goals;

describe('demoCountedGoal', () => {
  it('counts the goal asked for, or the first one, or none for a project without goals', () => {
    expect(demoCountedGoal(DEMO_STORE, PRICING?.id)).toBe(PRICING);
    expect(demoCountedGoal(DEMO_STORE)).toBe(SIGN_UP);
    expect(demoCountedGoal(DEMO_STORE, '9b2e4c6a-3d5f-4a7b-8c9d-1e2f3a4b5c6d')).toBe(SIGN_UP);
    expect(demoCountedGoal(DEMO_DOCS)).toBeNull();
  });
});

describe('demoConversionTest', () => {
  it('tests the events of the counted goal, and nothing for a project without goals', () => {
    const test = demoConversionTest(DEMO_STORE, PRICING?.id);

    expect(test?.({ name: 'page_view', path: '/pricing' } as never)).toBe(true);
    expect(test?.({ name: 'page_view', path: '/pricing/team' } as never)).toBe(false);
    expect(demoConversionTest(DEMO_DOCS)).toBeNull();
  });
});

describe('demoGoalWire', () => {
  it('writes the target of each kind in its own field', () => {
    expect(demoGoalsWire(DEMO_STORE.id).goals.slice(1, 3)).toEqual([
      {
        id: 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f702',
        name: 'Order created',
        type: 'event',
        event: 'order_created',
        path: null,
        position: 2,
        created_at: DEMO_GOAL_CREATED_AT,
      },
      {
        id: 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703',
        name: 'Saw the pricing',
        type: 'page',
        event: null,
        path: '/pricing',
        position: 3,
        created_at: DEMO_GOAL_CREATED_AT,
      },
    ]);
    expect(demoGoalsWire(DEMO_DOCS.id)).toEqual({ goals: [] });
    expect(demoGoalWire({ id: 'g', name: 'G', kind: 'page', target: '/a', position: 1 }).path).toBe(
      '/a',
    );
  });
});

describe('demoGoalsSummaryWire', () => {
  it('counts every goal of the store over the visits of the range and the filters', () => {
    const range = { from: '2026-09-06', to: '2026-10-05' };
    const all = demoGoalsSummaryWire(DEMO_STORE.id, range, NOW);
    const onPhones = demoGoalsSummaryWire(
      DEMO_STORE.id,
      { ...range, filters: { ...NO_DASHBOARD_FILTERS, device: 'mobile' } },
      NOW,
    );

    expect(all.goals).toHaveLength(DEMO_STORE.goals.length);
    expect(onPhones.visits).toBeLessThan(all.visits);
    for (const goal of all.goals) {
      expect(goal.converting_visits).toBeGreaterThan(0);
      expect(goal.conversion_rate).toBe(goal.converting_visits / all.visits);
    }
  });

  it('has no rate before the first visit of the demo', () => {
    const summary = demoGoalsSummaryWire(
      DEMO_STORE.id,
      { from: '2024-01-01', to: '2024-01-02' },
      NOW,
    );

    expect(summary.visits).toBe(0);
    expect(summary.goals.map((goal) => goal.conversion_rate)).toEqual(
      DEMO_STORE.goals.map(() => null),
    );
  });
});
