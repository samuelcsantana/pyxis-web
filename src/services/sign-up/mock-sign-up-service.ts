import type { AccountStatus } from '@/domain/accounts';
import type { FreePlanState, SignUpStatus, VerifySignUpOutcome } from '@/domain/sign-up';
import { LANDING_ORIGIN } from '@/lib/site';
import { DEMO_SIGN_IN_CODE } from '../auth/mock-auth-service';
import { DEMO_ACCOUNT_ID } from '../projects/demo-project-settings';
import type { ISignUpService } from './sign-up-service.interface';

export const DEMO_TERMS_VERSION = '2026-11-01';
export const DEMO_TERMS_URL = `${LANDING_ORIGIN}/`;

const STATUS_OF_A_NEW_ACCOUNT: Readonly<Record<FreePlanState, AccountStatus>> = {
  open: 'free',
  full: 'incomplete',
  closed: 'incomplete',
};

export class MockSignUpService implements ISignUpService {
  constructor(private readonly freePlan: FreePlanState = 'closed') {}

  status(): Promise<SignUpStatus> {
    return Promise.resolve({
      open: true,
      termsVersion: DEMO_TERMS_VERSION,
      termsUrl: DEMO_TERMS_URL,
      freePlan: this.freePlan,
    });
  }

  requestCode(): Promise<void> {
    return Promise.resolve();
  }

  verify(_email: string, code: string): Promise<VerifySignUpOutcome> {
    return Promise.resolve(
      code === DEMO_SIGN_IN_CODE
        ? {
            kind: 'verified',
            accountId: DEMO_ACCOUNT_ID,
            accountStatus: STATUS_OF_A_NEW_ACCOUNT[this.freePlan],
          }
        : { kind: 'invalidCode' },
    );
  }
}
