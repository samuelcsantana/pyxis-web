import { notFound } from 'next/navigation';
import {
  type AccountBody,
  AccountSectionWindow,
  accountWindowMetadata,
  type PageSearch,
} from '@/app/[projectId]/settings/settings-sections';
import { appsBody } from '@/app/account/sections/apps-body';
import { planBody } from '@/app/account/sections/plan-body';
import { preferencesBody } from '@/app/account/sections/preferences-body';
import { sessionsBody } from '@/app/account/sections/sessions-body';
import { tokensBody } from '@/app/account/sections/tokens-body';
import { type AccountSection, accountSectionOf } from '@/components/settings-window/sections';

const BODIES: Readonly<Record<AccountSection, AccountBody>> = {
  plan: planBody,
  preferences: preferencesBody,
  sessions: sessionsBody,
  tokens: tokensBody,
  apps: appsBody,
};

export interface AccountWindowProps {
  readonly params: Promise<{ readonly projectId: string; readonly section?: readonly string[] }>;
  readonly searchParams: Promise<PageSearch>;
}

async function sectionOf(props: AccountWindowProps): Promise<AccountSection> {
  const section = accountSectionOf((await props.params).section);
  if (section === undefined) {
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
