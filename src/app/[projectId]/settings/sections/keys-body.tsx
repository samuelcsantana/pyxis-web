import { KeysPart } from '@/components/settings/keys-part';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { createProjectKey, revokeProjectKey } from '../actions';

export function keysBody({ settings, i18n, when, owner }: ProjectBodyInput) {
  return (
    <KeysPart
      settings={settings}
      i18n={i18n}
      when={when}
      manage={
        owner
          ? {
              createKey: createProjectKey.bind(null, settings.id),
              revokeKey: revokeProjectKey.bind(null, settings.id),
            }
          : null
      }
    />
  );
}
