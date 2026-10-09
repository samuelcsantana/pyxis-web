import {
  type Clock,
  type RequestLogger,
  type ResponseSchema,
  SessionRequests,
} from './session-requests';

export class ApiWriter {
  private readonly requests: SessionRequests;

  constructor(
    baseUrl: string,
    sessionToken: () => Promise<string | undefined>,
    log?: RequestLogger,
    now?: Clock,
  ) {
    this.requests = new SessionRequests(baseUrl, sessionToken, log, now);
  }

  put<Value>(path: string, body: unknown, schema: ResponseSchema<Value>): Promise<Value> {
    return this.requests.send('api_write', path, schema, { method: 'PUT', body });
  }
}
