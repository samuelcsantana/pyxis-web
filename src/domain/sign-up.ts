export const TRIAL_DAYS = 14;

export interface SignUpStatus {
  readonly open: boolean;
  readonly termsVersion: string | null;
  readonly termsUrl: string | null;
}

export interface OpenSignUp {
  readonly termsVersion: string;
  readonly termsUrl: string;
}

export type VerifySignUpOutcome =
  | { readonly kind: 'verified'; readonly accountId: string }
  | { readonly kind: 'invalidCode' }
  | { readonly kind: 'termsOutdated' }
  | { readonly kind: 'closed' };

export function openSignUpOf(status: SignUpStatus): OpenSignUp | null {
  return status.open && status.termsVersion !== null && status.termsUrl !== null
    ? { termsVersion: status.termsVersion, termsUrl: status.termsUrl }
    : null;
}
