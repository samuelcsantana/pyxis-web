import {
  type Clock,
  type OriginProvider,
  type RequestLogger,
  type ResponseSchema,
  SessionRequests,
} from './session-requests';

const NO_CONTENT: ResponseSchema<void> = { parse: () => undefined };

export class ApiWriter {
  private readonly requests: SessionRequests;

  constructor(
    baseUrl: string,
    sessionToken: () => Promise<string | undefined>,
    log?: RequestLogger,
    now?: Clock,
    origin?: OriginProvider,
  ) {
    this.requests = new SessionRequests(baseUrl, sessionToken, log, now, origin);
  }

  put<Value>(path: string, body: unknown, schema: ResponseSchema<Value>): Promise<Value> {
    return this.requests.send('api_write', path, schema, { method: 'PUT', body });
  }

  delete(path: string): Promise<void> {
    return this.requests.send('api_write', path, NO_CONTENT, { method: 'DELETE' });
  }
}
