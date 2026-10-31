import { HelpView } from '@/components/help/help-view';
import { supportPlanOf } from '@/domain/support';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import type { HelpBodyInput } from '@/app/[projectId]/settings/settings-sections';

export async function helpBody({ i18n, admin, projectId }: HelpBodyInput) {
  const accounts = await readOrSignIn(() => createAccountsService().list());
  return (
    <HelpView
      projectId={projectId}
      email={admin.email}
      plan={supportPlanOf(accounts)}
      i18n={i18n}
      headingLevel="h3"
      idPrefix="help-window"
    />
  );
}
