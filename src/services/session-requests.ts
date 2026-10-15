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
const ACCESS_TOKEN_PATH = /^\/v1\/me\/tokens\/[^/?]+/;
const ACCESS_TOKEN_PATH_TEMPLATE = '/v1/me/tokens/:tokenId';
const PROJECT_KEY_PATH = /\/keys\/[^/?]+/;
const PROJECT_KEY_PATH_TEMPLATE = '/keys/:keyId';
const JSON_ACCEPT = 'application/json';
const IMAGE_ACCEPT = 'image/*';
const UNKNOWN_CONTENT_TYPE = 'application/octet-stream';

export type RequestEvent = 'api_read' | 'api_write';

export interface ResponseSchema<Value> {
  parse(body: unknown): Value;
}

export type RequestLogger = (line: string) => void;
export type Clock = () => number;

export interface FetchedBytes {
  readonly contentType: string;
  readonly bytes: ArrayBuffer;
}

export type OutgoingBody =
  | { readonly method: 'POST' | 'PUT' | 'PATCH'; readonly body: unknown }
  | { readonly method: 'DELETE' };

export function pathTemplate(path: string): string {
  const queryStart = path.indexOf(QUERY_START);
  const route = queryStart === -1 ? path : path.slice(0, queryStart);
  return route
    .replace(PROJECT_PATH, PROJECT_PATH_TEMPLATE)
    .replace(PROJECT_KEY_PATH, PROJECT_KEY_PATH_TEMPLATE)
    .replace(SESSION_PATH, SESSION_PATH_TEMPLATE)
    .replace(ACCESS_TOKEN_PATH, ACCESS_TOKEN_PATH_TEMPLATE);
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

function errorCodeOf(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return null;
  }
  return typeof body.error === 'string' ? body.error : null;
}

async function readErrorCode(response: Response): Promise<string | null> {
  try {
    return errorCodeOf(await response.json());
  } catch {
    return null;
  }
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
  accept = JSON_ACCEPT,
): RequestInit {
  const headers = {
    cookie: `${API_SESSION_COOKIE_NAME}=${token}`,
    accept,
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
    const token = await this.requiredToken();
    const origin = outgoing === undefined ? null : await this.origin();
    const response = await this.checked(
      path,
      await this.timedFetch(event, path, requestInit(token, origin, outgoing)),
    );
    return schema.parse(response.status === STATUS_NO_CONTENT ? undefined : await response.json());
  }

  async sendForBytes(event: RequestEvent, path: string): Promise<FetchedBytes> {
    const token = await this.requiredToken();
    const response = await this.checked(
      path,
      await this.timedFetch(event, path, requestInit(token, null, undefined, IMAGE_ACCEPT)),
    );
    return {
      contentType: response.headers.get('content-type') ?? UNKNOWN_CONTENT_TYPE,
      bytes: await response.arrayBuffer(),
    };
  }

  private async requiredToken(): Promise<string> {
    const token = await this.sessionToken();
    if (token === undefined) {
      throw new UnauthenticatedError();
    }
    return token;
  }

  private async checked(path: string, response: Response): Promise<Response> {
    if (response.status === STATUS_UNAUTHORIZED) {
      throw new UnauthenticatedError();
    }
    if (response.status === STATUS_NOT_FOUND) {
      throw new ApiNotFoundError(path);
    }
    if (!response.ok) {
      throw new ApiRequestError(path, response.status, await readErrorCode(response));
    }
    return response;
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
