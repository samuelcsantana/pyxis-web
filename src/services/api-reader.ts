import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { SESSION_COOKIE_NAME } from '@/lib/api-config';

const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;

export interface ResponseSchema<Value> {
  parse(body: unknown): Value;
}

export class ApiReader {
  constructor(
    private readonly baseUrl: string,
    private readonly sessionToken: () => Promise<string | undefined>,
  ) {}

  async get<Value>(path: string, schema: ResponseSchema<Value>): Promise<Value> {
    const token = await this.sessionToken();
    if (token === undefined) {
      throw new UnauthenticatedError();
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${token}`, accept: 'application/json' },
      cache: 'no-store',
    });
    if (response.status === STATUS_UNAUTHORIZED) {
      throw new UnauthenticatedError();
    }
    if (response.status === STATUS_NOT_FOUND) {
      throw new ApiNotFoundError(path);
    }
    if (!response.ok) {
      throw new ApiRequestError(path, response.status);
    }
    return schema.parse(await response.json());
  }
}
