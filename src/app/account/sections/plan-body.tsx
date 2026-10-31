import { AccountOverview } from '@/components/account/account-overview';
import { AccountSupport } from '@/components/account/account-support';
import { ownedAccounts } from '@/domain/accounts';
import { ownsAnotherFreeAccount } from '@/domain/free-plan';
import { supportPlanOf } from '@/domain/support';
import { readOrSignIn } from '@/lib/current-admin';
import { bestEffortFreePlanState } from '@/lib/free-plan-state';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import type { AccountBodyInput } from '@/app/[projectId]/settings/settings-sections';
import {
  closeAccount,
  openBillingPortal,
  openCheckout,
  subscribeFromFreePlan,
  withdrawToFreePlan,
} from '../actions';

export async function planBody({ i18n, admin }: AccountBodyInput) {
  const [accounts, freePlan] = await Promise.all([
    readOrSignIn(() => createAccountsService().list()),
    bestEffortFreePlanState(),
  ]);
  const owned = ownedAccounts(accounts);
  const now = new Date();
  return (
    <div className="flex flex-col gap-4">
      {owned.length === 0 ? (
        <p className="text-sm">{i18n.t('account.noAccount')}</p>
      ) : (
        owned.map((account) => (
          <AccountOverview
            key={account.id}
            account={account}
            i18n={i18n}
            now={now}
            freePlan={freePlan}
            ownsAnotherFreeAccount={ownsAnotherFreeAccount(account, owned)}
            openCheckout={openCheckout.bind(null, account.id)}
            subscribe={subscribeFromFreePlan.bind(null, account.id)}
            openPortal={openBillingPortal.bind(null, account.id)}
            withdraw={withdrawToFreePlan.bind(null, account.id)}
            close={closeAccount.bind(null, account.id)}
          />
        ))
      )}
      <AccountSupport email={admin.email} plan={supportPlanOf(accounts)} i18n={i18n} />
    </div>
  );
}
