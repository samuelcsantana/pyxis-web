import type { Locale } from '@/i18n/locales';

export interface IAuthService {
  requestCode(email: string, locale: Locale): Promise<void>;
  verifyCode(email: string, code: string): Promise<void>;
  signOut(): Promise<void>;
}
