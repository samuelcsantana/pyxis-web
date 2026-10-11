import {
  type Clock,
  type FetchedBytes,
  type RequestLogger,
  type ResponseSchema,
  SessionRequests,
} from './session-requests';

export class ApiReader {
  private readonly requests: SessionRequests;

  constructor(
    baseUrl: string,
    sessionToken: () => Promise<string | undefined>,
    log?: RequestLogger,
    now?: Clock,
  ) {
    this.requests = new SessionRequests(baseUrl, sessionToken, log, now);
  }

  get<Value>(path: string, schema: ResponseSchema<Value>): Promise<Value> {
    return this.requests.send('api_read', path, schema);
  }

  getBytes(path: string): Promise<FetchedBytes> {
    return this.requests.sendForBytes('api_read', path);
  }
}
