import { InvalidCodeError } from '@/domain/errors';
import type { IAuthService } from './auth-service.interface';

export const DEMO_SIGN_IN_CODE = '000000';

export class MockAuthService implements IAuthService {
  requestCode(): Promise<void> {
    return Promise.resolve();
  }

  verifyCode(_email: string, code: string): Promise<void> {
    return code === DEMO_SIGN_IN_CODE ? Promise.resolve() : Promise.reject(new InvalidCodeError());
  }

  signOut(): Promise<void> {
    return Promise.resolve();
  }
}
