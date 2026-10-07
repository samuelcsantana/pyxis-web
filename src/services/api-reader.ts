import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { SESSION_COOKIE_NAME } from '@/lib/api-config';

const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;
const NO_RESPONSE_STATUS = 0;
const READ_EVENT = 'api_read';
const QUERY_START = '?';
const PROJECT_PATH = /^\/v1\/projects\/[^/?]+/;
const PROJECT_PATH_TEMPLATE = '/v1/projects/:projectId';

export interface ResponseSchema<Value> {
  parse(body: unknown): Value;
}

export type ReadLogger = (line: string) => void;
export type Clock = () => number;

export function pathTemplate(path: string): string {
  const queryStart = path.indexOf(QUERY_START);
  const route = queryStart === -1 ? path : path.slice(0, queryStart);
  return route.replace(PROJECT_PATH, PROJECT_PATH_TEMPLATE);
}

export function readLogLine(path: string, status: number, durationMs: number): string {
  return JSON.stringify({
    event: READ_EVENT,
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

export class ApiReader {
  constructor(
    private readonly baseUrl: string,
    private readonly sessionToken: () => Promise<string | undefined>,
    private readonly log: ReadLogger = writeToConsole,
    private readonly now: Clock = monotonicNow,
  ) {}

  async get<Value>(path: string, schema: ResponseSchema<Value>): Promise<Value> {
    const token = await this.sessionToken();
    if (token === undefined) {
      throw new UnauthenticatedError();
    }
    const response = await this.timedFetch(path, {
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

  private async timedFetch(path: string, init: RequestInit): Promise<Response> {
    const started = this.now();
    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      this.log(readLogLine(path, response.status, this.now() - started));
      return response;
    } catch (error) {
      this.log(readLogLine(path, NO_RESPONSE_STATUS, this.now() - started));
      throw error;
    }
  }
}
