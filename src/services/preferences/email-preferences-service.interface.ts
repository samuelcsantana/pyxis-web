import type { EmailPreferences } from '@/domain/email-preferences';

export interface IEmailPreferencesService {
  preferences(projectId: string): Promise<EmailPreferences>;
  choose(projectId: string, preferences: EmailPreferences): Promise<EmailPreferences>;
}
