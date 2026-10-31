import {
  type AccountPageProps,
  AccountSectionPage,
  accountSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { planBody } from '@/app/account/sections/plan-body';

export function generateMetadata() {
  return accountSectionMetadata('plan');
}

export default function AccountPlanPage(props: AccountPageProps) {
  return <AccountSectionPage {...props} section="plan" body={planBody} />;
}
