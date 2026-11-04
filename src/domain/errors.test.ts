import { describe, expect, it } from 'vitest';
import {
  ApiRequestError,
  InvalidCodeError,
  isAccountSuspended,
  isPlanRequired,
  RateLimitedError,
  SignUpBusyError,
  UnauthenticatedError,
} from './errors';

describe('domain errors', () => {
  it.each([
    [new UnauthenticatedError(), 'UnauthenticatedError'],
    [new InvalidCodeError(), 'InvalidCodeError'],
    [new RateLimitedError(), 'RateLimitedError'],
    [new SignUpBusyError(), 'SignUpBusyError'],
  ])('%s is named after its class', (error, name) => {
    expect(error.name).toBe(name);
    expect(error).toBeInstanceOf(Error);
  });

  it('says which call failed and with which status, and keeps both', () => {
    const error = new ApiRequestError('/v1/me', 503);

    expect(error.message).toBe('The Pyxis API answered 503 to /v1/me.');
    expect(error).toMatchObject({
      name: 'ApiRequestError',
      path: '/v1/me',
      status: 503,
      code: null,
    });
  });

  it('tells a suspended account from any other refusal', () => {
    expect(
      isAccountSuspended(new ApiRequestError('/v1/projects/p/overview', 403, 'account_suspended')),
    ).toBe(true);
    expect(
      isAccountSuspended(new ApiRequestError('/v1/projects/p/overview', 403, 'forbidden')),
    ).toBe(false);
    expect(isAccountSuspended(new UnauthenticatedError())).toBe(false);
  });

  it('tells a refusal for the plan from the other 403 answers', () => {
    expect(
      isPlanRequired(new ApiRequestError('/v1/projects/p/share-link', 403, 'plan_required')),
    ).toBe(true);
    expect(isPlanRequired(new ApiRequestError('/v1/batch', 403, 'quota_exceeded'))).toBe(false);
    expect(isPlanRequired(new RateLimitedError())).toBe(false);
  });

  it('keeps the error code the API named', () => {
    expect(new ApiRequestError('/v1/projects/p/keys', 409, 'key_limit_reached').code).toBe(
      'key_limit_reached',
    );
  });
});
