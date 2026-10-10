import { ApiRequestError, InvalidCodeError, RateLimitedError } from '@/domain/errors';
import { isSessionToken } from '@/domain/session-token';
import type { Locale } from '@/i18n/locales';
import type { IAuthService } from './auth-service.interface';

const STATUS_BAD_REQUEST = 400;
const STATUS_TOO_MANY_REQUESTS = 429;

export interface SessionKeeper {
  keep(token: string): Promise<void>;
  end(): Promise<void>;
}

export class MalformedSignInAnswerError extends Error {
  constructor() {
    super('The sign-in answer carries no well-formed session token.');
    this.name = 'MalformedSignInAnswerError';
  }
}

function sessionTokenOf(body: unknown): string {
  const token =
    typeof body === 'object' && body !== null && 'session_token' in body
      ? body.session_token
      : undefined;
  if (!isSessionToken(token)) {
    throw new MalformedSignInAnswerError();
  }
  return token;
}

export class HttpAuthService implements IAuthService {
  constructor(
    private readonly baseUrl: string,
    private readonly session: SessionKeeper,
  ) {}

  async requestCode(email: string, locale: Locale): Promise<void> {
    await this.post('/v1/auth/request-code', { email, locale });
  }

  async verifyCode(email: string, code: string): Promise<void> {
    let response: Response;
    try {
      response = await this.post('/v1/auth/verify-code', { email, code });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
        throw new InvalidCodeError();
      }
      throw error;
    }
    await this.session.keep(sessionTokenOf(await response.json()));
  }

  signOut(): Promise<void> {
    return this.session.end();
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
      throw new ApiRequestError(path, response.status);
    }
    return response;
  }
}
