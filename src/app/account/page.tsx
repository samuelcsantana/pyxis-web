import type { Metadata } from 'next';
import Link from 'next/link';
import { AccountOverview } from '@/components/account/account-overview';
import { BrandedPage } from '@/components/brand/branded-page';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { ownedAccounts } from '@/domain/accounts';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { currentAdmin, readOrSignIn } from '@/lib/current-admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import { openBillingPortal, openCheckout } from './actions';

export const DASHBOARD_HOME = '/';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('account.title') };
}

export default async function AccountPage() {
  const admin = await currentAdmin();
  const accounts = await readOrSignIn(() => createAccountsService().list());
  const owned = ownedAccounts(accounts);
  const i18n = await getI18n();
  const now = new Date();
  return (
    <BrandedPage>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{i18n.t('account.title')}</h1>
        <p className="text-sm text-muted">{admin.email}</p>
      </div>
      {owned.length === 0 ? (
        <p className="text-sm">{i18n.t('account.noAccount')}</p>
      ) : (
        owned.map((account) => (
          <AccountOverview
            key={account.id}
            account={account}
            i18n={i18n}
            now={now}
            openCheckout={openCheckout.bind(null, account.id)}
            openPortal={openBillingPortal.bind(null, account.id)}
          />
        ))
      )}
      <Link href={DASHBOARD_HOME} className={`self-start text-sm ${TEXT_LINK}`}>
        {i18n.t('account.back')}
      </Link>
    </BrandedPage>
  );
}
