import type { EmailPreferences } from '@/domain/email-preferences';
import { emailPreferencesResponseSchema } from '@/domain/email-preferences.schema';
import type { IEmailPreferencesService } from './email-preferences-service.interface';

export const DEMO_EMAIL_PREFERENCES_WIRE = { weekly_digest: true };

export class MockEmailPreferencesService implements IEmailPreferencesService {
  preferences(): Promise<EmailPreferences> {
    return Promise.resolve(emailPreferencesResponseSchema.parse(DEMO_EMAIL_PREFERENCES_WIRE));
  }

  choose(_projectId: string, preferences: EmailPreferences): Promise<EmailPreferences> {
    return Promise.resolve({ weeklyDigest: preferences.weeklyDigest });
  }
}
