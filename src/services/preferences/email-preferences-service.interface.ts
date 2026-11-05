import type { EmailPreferenceChoice, EmailPreferences } from '@/domain/email-preferences';

export interface IEmailPreferencesService {
  preferences(projectId: string): Promise<EmailPreferences>;
  choose(projectId: string, choice: EmailPreferenceChoice): Promise<EmailPreferences>;
}
