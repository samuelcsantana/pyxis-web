import Link from 'next/link';
import { ACCOUNT_PAGE } from '@/components/account/account-notice-banner';
import { NEW_PROJECT_PAGE } from '@/components/shell/project-switcher';
import { SignOutButton } from '@/components/shell/sign-out-button';
import { BUTTON_PRIMARY } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { EmptyState } from './empty-state';

export interface NoProjectsYetProps {
  readonly email: string;
  readonly authService?: IAuthService;
  readonly i18n: I18n;
  readonly canCreateProject?: boolean;
  readonly hasUnfinishedSignUp?: boolean;
}

const ACTION = `flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`;

function Body({ email, i18n, canCreateProject, hasUnfinishedSignUp }: NoProjectsYetProps) {
  if (canCreateProject === true) {
    return <p>{i18n.t('states.noProjects.bodyOwner')}</p>;
  }
  if (hasUnfinishedSignUp === true) {
    return <p>{i18n.t('states.noProjects.bodyUnfinished')}</p>;
  }
  return (
    <p>
      {rich(i18n.t('states.noProjects.body'), {
        email: () => <strong className="text-ink">{email}</strong>,
        code: (text) => <code>{text}</code>,
      })}
    </p>
  );
}

function NextStep({ i18n, canCreateProject, hasUnfinishedSignUp }: NoProjectsYetProps) {
  if (canCreateProject === true) {
    return (
      <Link href={NEW_PROJECT_PAGE} className={ACTION}>
        {i18n.t('states.noProjects.create')}
      </Link>
    );
  }
  if (hasUnfinishedSignUp === true) {
    return (
      <Link href={ACCOUNT_PAGE} className={ACTION}>
        {i18n.t('states.noProjects.finish')}
      </Link>
    );
  }
  return null;
}

export function NoProjectsYet(props: NoProjectsYetProps) {
  return (
    <>
      <EmptyState headingLevel="h1" title={props.i18n.t('states.noProjects.title')}>
        <Body {...props} />
      </EmptyState>
      <NextStep {...props} />
      <SignOutButton variant="page" authService={props.authService} />
    </>
  );
}
