import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpenSignUp } from '@/domain/sign-up';
import { bestEffortFreePlanState } from './free-plan-state';

const state = vi.hoisted<{ demo: boolean; openSignUp: OpenSignUp | null }>(() => ({
  demo: false,
  openSignUp: null,
}));

vi.mock('./api-config', () => ({ isDemoMode: () => state.demo }));
vi.mock('./landing-sign-up', () => ({
  bestEffortOpenSignUp: () => Promise.resolve(state.openSignUp),
}));

const TERMS = { termsVersion: '1.3', termsUrl: 'https://example.com/terms' };

describe('bestEffortFreePlanState', () => {
  beforeEach(() => {
    state.demo = false;
    state.openSignUp = null;
  });

  it.each(['open', 'full', 'closed'] as const)(
    'reads the free plan %s from the sign-up status',
    async (freePlan) => {
      state.openSignUp = { ...TERMS, freePlan };

      await expect(bestEffortFreePlanState()).resolves.toBe(freePlan);
    },
  );

  it('takes the free plan as closed while sign-up is closed or cannot be read', async () => {
    await expect(bestEffortFreePlanState()).resolves.toBe('closed');
  });

  it('keeps the demo on the closed free plan, without asking', async () => {
    state.demo = true;
    state.openSignUp = { ...TERMS, freePlan: 'open' };

    await expect(bestEffortFreePlanState()).resolves.toBe('closed');
  });
});
