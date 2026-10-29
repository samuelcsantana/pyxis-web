import { ApiRequestError, RateLimitedError } from '@/domain/errors';
import type { SignUpStatus, VerifySignUpOutcome } from '@/domain/sign-up';
import {
  signedUpOf,
  signUpCodeWire,
  signUpStatusOf,
  signUpVerifyWire,
} from '@/domain/sign-up.schema';
import type { ISignUpService } from './sign-up-service.interface';

export const SIGN_UP_PATH = '/v1/auth/sign-up';

const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_TOO_MANY_REQUESTS = 429;
const TERMS_OUTDATED = 'terms_outdated';

async function errorCodeOf(response: Response): Promise<string | null> {
  try {
    const body: unknown = await response.json();
    return typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
      ? body.error
      : null;
  } catch {
    return null;
  }
}

export class HttpSignUpService implements ISignUpService {
  constructor(
    private readonly baseUrl: string,
    private readonly keepSession: (token: string) => Promise<void>,
  ) {}

  async status(): Promise<SignUpStatus> {
    const response = await fetch(`${this.baseUrl}${SIGN_UP_PATH}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new ApiRequestError(SIGN_UP_PATH, response.status);
    }
    return signUpStatusOf(await response.json());
  }

  async requestCode(email: string, locale: string): Promise<void> {
    await this.post(`${SIGN_UP_PATH}/code`, signUpCodeWire(email, locale));
  }

  async verify(email: string, code: string, termsVersion: string): Promise<VerifySignUpOutcome> {
    let response: Response;
    try {
      response = await this.post(
        `${SIGN_UP_PATH}/verify`,
        signUpVerifyWire(email, code, termsVersion),
      );
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
        return { kind: 'invalidCode' };
      }
      if (error instanceof ApiRequestError && error.status === STATUS_NOT_FOUND) {
        return { kind: 'closed' };
      }
      if (error instanceof ApiRequestError && error.code === TERMS_OUTDATED) {
        return { kind: 'termsOutdated' };
      }
      throw error;
    }
    const signedUp = signedUpOf(await response.json());
    await this.keepSession(signedUp.sessionToken);
    return {
      kind: 'verified',
      accountId: signedUp.accountId,
      accountStatus: signedUp.accountStatus,
      freePlace: signedUp.freePlace,
    };
  }

  private async post(path: string, body: Readonly<Record<string, string>>): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.status === STATUS_TOO_MANY_REQUESTS) {
      throw new RateLimitedError();
    }
    if (!response.ok) {
      throw new ApiRequestError(path, response.status, await errorCodeOf(response));
    }
    return response;
  }
}
