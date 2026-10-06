import { ApiRequestError, InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from './auth-service.interface';

const STATUS_BAD_REQUEST = 400;
const STATUS_TOO_MANY_REQUESTS = 429;

export class HttpAuthService implements IAuthService {
  constructor(private readonly baseUrl: string) {}

  requestCode(email: string): Promise<void> {
    return this.post('/v1/auth/request-code', { email });
  }

  async verifyCode(email: string, code: string): Promise<void> {
    try {
      await this.post('/v1/auth/verify-code', { email, code });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
        throw new InvalidCodeError();
      }
      throw error;
    }
  }

  signOut(): Promise<void> {
    return this.post('/v1/auth/logout', {});
  }

  private async post(path: string, body: Readonly<Record<string, string>>): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.status === STATUS_TOO_MANY_REQUESTS) {
      throw new RateLimitedError();
    }
    if (!response.ok) {
      throw new ApiRequestError(path, response.status);
    }
  }
}
