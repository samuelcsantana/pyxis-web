import { SessionsPanel } from '@/components/settings/sessions-panel';
import { readOrSignIn } from '@/lib/current-admin';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';
import type { AccountBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { endSession } from '../access-actions';

export async function sessionsBody({ i18n, when }: AccountBodyInput) {
  return (
    <SessionsPanel
      sessions={await readOrSignIn(() => createSessionsService().list())}
      i18n={i18n}
      when={when}
      end={endSession}
    />
  );
}
