import type { FreePlanState } from '@/domain/sign-up';
import { isDemoMode } from './api-config';
import { bestEffortOpenSignUp } from './landing-sign-up';

export const FREE_PLAN_STATE_WHEN_UNKNOWN: FreePlanState = 'closed';

export async function bestEffortFreePlanState(): Promise<FreePlanState> {
  if (isDemoMode()) {
    return FREE_PLAN_STATE_WHEN_UNKNOWN;
  }
  const openSignUp = await bestEffortOpenSignUp();
  return openSignUp?.freePlan ?? FREE_PLAN_STATE_WHEN_UNKNOWN;
}
