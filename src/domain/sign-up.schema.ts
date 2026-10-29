import { ACCOUNT_STATUSES, type AccountStatus } from './accounts';
import { isSessionToken } from './session-token';
import {
  FREE_PLACES,
  FREE_PLAN_STATES,
  type FreePlace,
  type FreePlanState,
  type SignUpStatus,
} from './sign-up';

export class MalformedSignUpAnswerError extends Error {
  constructor() {
    super('The sign-up answer is not shaped as the API documents it.');
    this.name = 'MalformedSignUpAnswerError';
  }
}

export interface SignedUp {
  readonly accountId: string;
  readonly sessionToken: string;
  readonly accountStatus: AccountStatus;
  readonly freePlace: FreePlace | null;
}

const FREE_PLAN_OF_AN_API_WITHOUT_ONE: FreePlanState = 'closed';
const STATUS_OF_AN_ACCOUNT_BEFORE_THE_FREE_PLAN: AccountStatus = 'incomplete';

function recordOf(body: unknown): Readonly<Record<string, unknown>> {
  if (typeof body !== 'object' || body === null) {
    throw new MalformedSignUpAnswerError();
  }
  return body as Readonly<Record<string, unknown>>;
}

function nullableText(value: unknown): string | null {
  if (value === null || typeof value === 'string') {
    return value;
  }
  throw new MalformedSignUpAnswerError();
}

function knownOf<const Value extends string>(values: readonly Value[], value: unknown): Value {
  const known = values.find((candidate) => candidate === value);
  if (known === undefined) {
    throw new MalformedSignUpAnswerError();
  }
  return known;
}

function oneOf<const Value extends string>(
  values: readonly Value[],
  value: unknown,
  absent: Value,
): Value {
  return value === undefined ? absent : knownOf(values, value);
}

function optionalOneOf<const Value extends string>(
  values: readonly Value[],
  value: unknown,
): Value | null {
  return value === undefined ? null : knownOf(values, value);
}

export function signUpStatusOf(body: unknown): SignUpStatus {
  const record = recordOf(body);
  if (typeof record.open !== 'boolean') {
    throw new MalformedSignUpAnswerError();
  }
  return {
    open: record.open,
    termsVersion: nullableText(record.terms_version),
    termsUrl: nullableText(record.terms_url),
    freePlan: oneOf(FREE_PLAN_STATES, record.free_plan, FREE_PLAN_OF_AN_API_WITHOUT_ONE),
  };
}

export function signedUpOf(body: unknown): SignedUp {
  const record = recordOf(body);
  if (typeof record.account_id !== 'string' || !isSessionToken(record.session_token)) {
    throw new MalformedSignUpAnswerError();
  }
  return {
    accountId: record.account_id,
    sessionToken: record.session_token,
    accountStatus: oneOf(
      ACCOUNT_STATUSES,
      record.account_status,
      STATUS_OF_AN_ACCOUNT_BEFORE_THE_FREE_PLAN,
    ),
    freePlace: optionalOneOf(FREE_PLACES, record.free_place),
  };
}

export function signUpCodeWire(email: string, locale: string) {
  return { email: email.trim(), locale };
}

export function signUpVerifyWire(email: string, code: string, termsVersion: string) {
  return { email: email.trim(), code, terms_version: termsVersion };
}
