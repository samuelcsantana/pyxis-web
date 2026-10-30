import { ConnectedAppsPanel } from '@/components/settings/connected-apps-panel';
import { readOrSignIn } from '@/lib/current-admin';
import { createConnectionsService } from '@/services/connections/connections-service.factory';
import type { AccountBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { revokeConnection } from '../access-actions';

export async function appsBody({ i18n, when }: AccountBodyInput) {
  return (
    <ConnectedAppsPanel
      apps={await readOrSignIn(() => createConnectionsService().list())}
      i18n={i18n}
      when={when}
      revoke={revokeConnection}
    />
  );
}
