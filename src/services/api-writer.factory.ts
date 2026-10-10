import { ApiWriter } from './api-writer';
import { requestOrigin } from './request-origin';
import { sessionToken } from './session-token';

export function createApiWriter(baseUrl: string): ApiWriter {
  return new ApiWriter(baseUrl, sessionToken, undefined, undefined, requestOrigin);
}
