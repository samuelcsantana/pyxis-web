import { isSessionToken } from './session-token';
import type { SignUpStatus } from './sign-up';

export class MalformedSignUpAnswerError extends Error {
  constructor() {
    super('The sign-up answer is not shaped as the API documents it.');
    this.name = 'MalformedSignUpAnswerError';
  }
}

export interface SignedUp {
  readonly accountId: string;
  readonly sessionToken: string;
}

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

export function signUpStatusOf(body: unknown): SignUpStatus {
  const record = recordOf(body);
  if (typeof record.open !== 'boolean') {
    throw new MalformedSignUpAnswerError();
  }
  return {
    open: record.open,
    termsVersion: nullableText(record.terms_version),
    termsUrl: nullableText(record.terms_url),
  };
}

export function signedUpOf(body: unknown): SignedUp {
  const record = recordOf(body);
  if (typeof record.account_id !== 'string' || !isSessionToken(record.session_token)) {
    throw new MalformedSignUpAnswerError();
  }
  return { accountId: record.account_id, sessionToken: record.session_token };
}

export function signUpCodeWire(email: string, locale: string) {
  return { email: email.trim(), locale };
}

export function signUpVerifyWire(email: string, code: string, termsVersion: string) {
  return { email: email.trim(), code, terms_version: termsVersion };
}
