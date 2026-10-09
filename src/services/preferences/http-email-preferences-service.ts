import { type EmailPreferences, emailPreferencesWire } from '@/domain/email-preferences';
import { emailPreferencesResponseSchema } from '@/domain/email-preferences.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IEmailPreferencesService } from './email-preferences-service.interface';

function preferencesPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/email-preferences`;
}

export class HttpEmailPreferencesService implements IEmailPreferencesService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  preferences(projectId: string): Promise<EmailPreferences> {
    return this.reader.get(preferencesPath(projectId), emailPreferencesResponseSchema);
  }

  choose(projectId: string, preferences: EmailPreferences): Promise<EmailPreferences> {
    return this.writer.put(
      preferencesPath(projectId),
      emailPreferencesWire(preferences),
      emailPreferencesResponseSchema,
    );
  }
}
