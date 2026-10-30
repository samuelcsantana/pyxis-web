import {
  type AccountPageProps,
  AccountSectionPage,
  accountSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { appsBody } from '@/app/account/sections/apps-body';

export function generateMetadata() {
  return accountSectionMetadata('apps');
}

export default function AccountAppsPage(props: AccountPageProps) {
  return <AccountSectionPage {...props} section="apps" body={appsBody} />;
}
