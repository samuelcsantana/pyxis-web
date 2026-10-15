import type { Metadata } from 'next';
import { AccountSuspendedPanel } from '@/components/account/account-suspended-panel';
import { BrandedPage } from '@/components/brand/branded-page';
import { getI18n, getTranslator } from '@/i18n/get-messages';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('accountSuspended.title') };
}

export default async function AccountSuspendedPage() {
  return (
    <BrandedPage>
      <AccountSuspendedPanel i18n={await getI18n()} />
    </BrandedPage>
  );
}
