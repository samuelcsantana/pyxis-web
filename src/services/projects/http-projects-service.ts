import { type Admin, meResponseSchema } from '@/domain/admin';
import { ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { SESSION_COOKIE_NAME } from '@/lib/api-config';
import type { IProjectsService } from './projects-service.interface';

const STATUS_UNAUTHORIZED = 401;
const ME_PATH = '/v1/me';

export class HttpProjectsService implements IProjectsService {
  constructor(
    private readonly baseUrl: string,
    private readonly sessionToken: () => Promise<string | undefined>,
  ) {}

  async currentAdmin(): Promise<Admin> {
    const token = await this.sessionToken();
    if (token === undefined) {
      throw new UnauthenticatedError();
    }
    const response = await fetch(`${this.baseUrl}${ME_PATH}`, {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${token}`, accept: 'application/json' },
      cache: 'no-store',
    });
    if (response.status === STATUS_UNAUTHORIZED) {
      throw new UnauthenticatedError();
    }
    if (!response.ok) {
      throw new ApiRequestError(ME_PATH, response.status);
    }
    return meResponseSchema.parse(await response.json());
  }
}
