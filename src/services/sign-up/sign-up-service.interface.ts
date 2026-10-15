import type { SignUpStatus, VerifySignUpOutcome } from '@/domain/sign-up';

export interface ISignUpService {
  status(): Promise<SignUpStatus>;
  requestCode(email: string, locale: string): Promise<void>;
  verify(email: string, code: string, termsVersion: string): Promise<VerifySignUpOutcome>;
}
