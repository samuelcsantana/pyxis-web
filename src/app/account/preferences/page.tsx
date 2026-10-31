import {
  type AccountPageProps,
  AccountSectionPage,
  accountSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { preferencesBody } from '@/app/account/sections/preferences-body';

export function generateMetadata() {
  return accountSectionMetadata('preferences');
}

export default function AccountPreferencesPage(props: AccountPageProps) {
  return <AccountSectionPage {...props} section="preferences" body={preferencesBody} />;
}
