import { EmailPart } from '@/components/settings/project-actions-parts';
import { readOrSignIn } from '@/lib/current-admin';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { chooseEmailPreferences } from '../actions';

export async function emailBody({ settings }: ProjectBodyInput) {
  return (
    <EmailPart
      settings={settings}
      preferences={await readOrSignIn(() =>
        createEmailPreferencesService().preferences(settings.id),
      )}
      choose={chooseEmailPreferences.bind(null, settings.id)}
    />
  );
}
