import { AccessTokensPanel } from '@/components/settings/access-tokens-panel';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import type { AccountBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { createAccessToken, revokeAccessToken } from '../access-actions';

export async function tokensBody({ i18n, when }: AccountBodyInput) {
  return (
    <AccessTokensPanel
      tokens={await readOrSignIn(() => createAccessTokensService().list())}
      i18n={i18n}
      when={when}
      create={createAccessToken}
      revoke={revokeAccessToken}
    />
  );
}
