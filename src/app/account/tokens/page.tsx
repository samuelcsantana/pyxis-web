import {
  type AccountPageProps,
  AccountSectionPage,
  accountSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { tokensBody } from '@/app/account/sections/tokens-body';

export function generateMetadata() {
  return accountSectionMetadata('tokens');
}

export default function AccountTokensPage(props: AccountPageProps) {
  return <AccountSectionPage {...props} section="tokens" body={tokensBody} />;
}
