import { ApiReader } from './api-reader';
import { sessionToken } from './session-token';

export function createApiReader(baseUrl: string): ApiReader {
  return new ApiReader(baseUrl, sessionToken);
}
