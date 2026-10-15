import { keepSession } from '@/app/sign-in/actions';
import { apiBaseUrl } from '@/lib/api-config';
import { HttpSignUpService } from './http-sign-up-service';
import { MockSignUpService } from './mock-sign-up-service';
import type { ISignUpService } from './sign-up-service.interface';

export function createSignUpService(): ISignUpService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockSignUpService()
    : new HttpSignUpService(baseUrl, keepSession);
}
