import { notFound } from 'next/navigation';
import {
  type AccountBody,
  AccountSectionWindow,
  accountWindowMetadata,
  type PageSearch,
} from '@/app/[projectId]/settings/settings-sections';
import { appsBody } from '@/app/account/sections/apps-body';
import { sessionsBody } from '@/app/account/sections/sessions-body';
import { tokensBody } from '@/app/account/sections/tokens-body';
import { type AccountSection, isAccountSection } from '@/components/settings-window/sections';

const BODIES: Readonly<Record<AccountSection, AccountBody>> = {
  sessions: sessionsBody,
  tokens: tokensBody,
  apps: appsBody,
};

export interface AccountWindowProps {
  readonly params: Promise<{ readonly projectId: string; readonly section: string }>;
  readonly searchParams: Promise<PageSearch>;
}

async function sectionOf(props: AccountWindowProps): Promise<AccountSection> {
  const { section } = await props.params;
  if (!isAccountSection(section)) {
    notFound();
  }
  return section;
}

export async function generateMetadata(props: AccountWindowProps) {
  return accountWindowMetadata(props, await sectionOf(props));
}

export default async function AccountWindow(props: AccountWindowProps) {
  const section = await sectionOf(props);
  return <AccountSectionWindow {...props} section={section} body={BODIES[section]} />;
}
