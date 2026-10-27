import { describe, expect, it } from 'vitest';
import {
  MalformedSignUpAnswerError,
  signedUpOf,
  signUpCodeWire,
  signUpStatusOf,
  signUpVerifyWire,
} from './sign-up.schema';

const TOKEN = 'T'.repeat(43);

describe('sign-up answers', () => {
  it('reads the status, open or closed, and the state of the free plan', () => {
    expect(
      signUpStatusOf({
        open: true,
        terms_version: '2026-11-01',
        terms_url: 'https://t',
        free_plan: 'full',
      }),
    ).toEqual({ open: true, termsVersion: '2026-11-01', termsUrl: 'https://t', freePlan: 'full' });
    expect(
      signUpStatusOf({ open: false, terms_version: null, terms_url: null, free_plan: 'closed' }),
    ).toEqual({ open: false, termsVersion: null, termsUrl: null, freePlan: 'closed' });
  });

  it('reads the free plan as closed from an API that has none yet', () => {
    expect(
      signUpStatusOf({ open: true, terms_version: '2026-11-01', terms_url: 'https://t' }).freePlan,
    ).toBe('closed');
  });

  it.each([
    [null],
    ['open'],
    [{ open: 'yes', terms_version: null, terms_url: null }],
    [{ open: true, terms_version: 1, terms_url: null }],
    [{ open: true, terms_version: null, terms_url: null, free_plan: 'maybe' }],
    [{ open: true, terms_version: null, terms_url: null, free_plan: null }],
  ])('refuses a status shaped otherwise: %j', (body) => {
    expect(() => signUpStatusOf(body)).toThrow(MalformedSignUpAnswerError);
  });

  it('reads the new account, its status and its session', () => {
    expect(
      signedUpOf({
        email: 'a@example.com',
        account_id: 'a1',
        session_token: TOKEN,
        account_status: 'free',
      }),
    ).toEqual({ accountId: 'a1', sessionToken: TOKEN, accountStatus: 'free' });
  });

  it('reads the account of an API that does not say its status as one waiting for Checkout', () => {
    expect(
      signedUpOf({ email: 'a@example.com', account_id: 'a1', session_token: TOKEN }).accountStatus,
    ).toBe('incomplete');
  });

  it.each([
    [{ account_id: 7, session_token: TOKEN }],
    [{ account_id: 'a1', session_token: 'short' }],
    [{ account_id: 'a1', session_token: TOKEN, account_status: 'gifted' }],
  ])('refuses a sign-up answer shaped otherwise: %j', (body) => {
    expect(() => signedUpOf(body)).toThrow(MalformedSignUpAnswerError);
  });

  it('names its error', () => {
    expect(new MalformedSignUpAnswerError().name).toBe('MalformedSignUpAnswerError');
  });

  it('writes the code and verify requests', () => {
    expect(signUpCodeWire(' a@example.com ', 'es')).toEqual({
      email: 'a@example.com',
      locale: 'es',
    });
    expect(signUpVerifyWire(' a@example.com ', '123456', 'v1')).toEqual({
      email: 'a@example.com',
      code: '123456',
      terms_version: 'v1',
    });
  });
});
