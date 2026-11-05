import type { EmailPreferenceChoice, EmailPreferences } from '@/domain/email-preferences';
import { emailPreferencesResponseSchema } from '@/domain/email-preferences.schema';
import type { IEmailPreferencesService } from './email-preferences-service.interface';

export const DEMO_EMAIL_PREFERENCES_WIRE = {
  weekly_digest: true,
  no_events_alert: true,
  failed_writes_alert: true,
  conversion_drop_alert: true,
};

function demoPreferences(): EmailPreferences {
  return emailPreferencesResponseSchema.parse(DEMO_EMAIL_PREFERENCES_WIRE);
}

export class MockEmailPreferencesService implements IEmailPreferencesService {
  preferences(): Promise<EmailPreferences> {
    return Promise.resolve(demoPreferences());
  }

  choose(_projectId: string, choice: EmailPreferenceChoice): Promise<EmailPreferences> {
    return Promise.resolve({ ...demoPreferences(), [choice.preference]: choice.on });
  }
}
