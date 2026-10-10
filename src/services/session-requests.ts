import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { API_SESSION_COOKIE_NAME } from '@/lib/session-cookie';

const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;
const STATUS_NO_CONTENT = 204;
const NO_RESPONSE_STATUS = 0;
const QUERY_START = '?';
const PROJECT_PATH = /^\/v1\/projects\/[^/?]+/;
const PROJECT_PATH_TEMPLATE = '/v1/projects/:projectId';
const SESSION_PATH = /^\/v1\/me\/sessions\/[^/?]+/;
const SESSION_PATH_TEMPLATE = '/v1/me/sessions/:sessionId';

export type RequestEvent = 'api_read' | 'api_write';

export interface ResponseSchema<Value> {
  parse(body: unknown): Value;
}

export type RequestLogger = (line: string) => void;
export type Clock = () => number;

export type OutgoingBody =
  { readonly method: 'PUT'; readonly body: unknown } | { readonly method: 'DELETE' };

export function pathTemplate(path: string): string {
  const queryStart = path.indexOf(QUERY_START);
  const route = queryStart === -1 ? path : path.slice(0, queryStart);
  return route
    .replace(PROJECT_PATH, PROJECT_PATH_TEMPLATE)
    .replace(SESSION_PATH, SESSION_PATH_TEMPLATE);
}

export function requestLogLine(
  event: RequestEvent,
  path: string,
  status: number,
  durationMs: number,
): string {
  return JSON.stringify({
    event,
    path: pathTemplate(path),
    status,
    duration_ms: Math.round(durationMs),
  });
}

function writeToConsole(line: string): void {
  console.info(line);
}

function monotonicNow(): number {
  return performance.now();
}

export type OriginProvider = () => Promise<string | null>;

function noOrigin(): Promise<string | null> {
  return Promise.resolve(null);
}

function requestInit(
  token: string,
  origin: string | null,
  outgoing: OutgoingBody | undefined,
): RequestInit {
  const headers = {
    cookie: `${API_SESSION_COOKIE_NAME}=${token}`,
    accept: 'application/json',
    ...(origin === null ? {} : { origin }),
  };
  if (outgoing === undefined) {
    return { headers, cache: 'no-store' };
  }
  if (outgoing.method === 'DELETE') {
    return { method: 'DELETE', headers, cache: 'no-store' };
  }
  return {
    method: outgoing.method,
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify(outgoing.body),
    cache: 'no-store',
  };
}

export class SessionRequests {
  constructor(
    private readonly baseUrl: string,
    private readonly sessionToken: () => Promise<string | undefined>,
    private readonly log: RequestLogger = writeToConsole,
    private readonly now: Clock = monotonicNow,
    private readonly origin: OriginProvider = noOrigin,
  ) {}

  async send<Value>(
    event: RequestEvent,
    path: string,
    schema: ResponseSchema<Value>,
    outgoing?: OutgoingBody,
  ): Promise<Value> {
    const token = await this.sessionToken();
    if (token === undefined) {
      throw new UnauthenticatedError();
    }
    const origin = outgoing === undefined ? null : await this.origin();
    const response = await this.timedFetch(event, path, requestInit(token, origin, outgoing));
    if (response.status === STATUS_UNAUTHORIZED) {
      throw new UnauthenticatedError();
    }
    if (response.status === STATUS_NOT_FOUND) {
      throw new ApiNotFoundError(path);
    }
    if (!response.ok) {
      throw new ApiRequestError(path, response.status);
    }
    return schema.parse(response.status === STATUS_NO_CONTENT ? undefined : await response.json());
  }

  private async timedFetch(
    event: RequestEvent,
    path: string,
    init: RequestInit,
  ): Promise<Response> {
    const started = this.now();
    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      this.log(requestLogLine(event, path, response.status, this.now() - started));
      return response;
    } catch (error) {
      this.log(requestLogLine(event, path, NO_RESPONSE_STATUS, this.now() - started));
      throw error;
    }
  }
}
