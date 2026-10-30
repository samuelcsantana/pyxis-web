import {
  type AccountPageProps,
  AccountSectionPage,
  accountSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { sessionsBody } from '@/app/account/sections/sessions-body';

export function generateMetadata() {
  return accountSectionMetadata('sessions');
}

export default function AccountSessionsPage(props: AccountPageProps) {
  return <AccountSectionPage {...props} section="sessions" body={sessionsBody} />;
}
