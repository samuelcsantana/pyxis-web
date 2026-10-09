import { ApiWriter } from './api-writer';
import { sessionToken } from './session-token';

export function createApiWriter(baseUrl: string): ApiWriter {
  return new ApiWriter(baseUrl, sessionToken);
}
