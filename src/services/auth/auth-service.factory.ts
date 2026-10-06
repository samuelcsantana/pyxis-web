import { apiBaseUrl } from '@/lib/api-config';
import type { IAuthService } from './auth-service.interface';
import { HttpAuthService } from './http-auth-service';
import { MockAuthService } from './mock-auth-service';

export function createAuthService(): IAuthService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined ? new MockAuthService() : new HttpAuthService(baseUrl);
}
