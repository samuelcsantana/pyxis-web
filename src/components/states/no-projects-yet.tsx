import Link from 'next/link';
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
}

export function NoProjectsYet({
  email,
  authService,
  i18n,
  canCreateProject = false,
}: NoProjectsYetProps) {
  return (
    <>
      <EmptyState headingLevel="h1" title={i18n.t('states.noProjects.title')}>
        {canCreateProject ? (
          <p>{i18n.t('states.noProjects.bodyOwner')}</p>
        ) : (
          <p>
            {rich(i18n.t('states.noProjects.body'), {
              email: () => <strong className="text-ink">{email}</strong>,
              code: (text) => <code>{text}</code>,
            })}
          </p>
        )}
      </EmptyState>
      {canCreateProject ? (
        <Link
          href={NEW_PROJECT_PAGE}
          className={`flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
        >
          {i18n.t('states.noProjects.create')}
        </Link>
      ) : null}
      <SignOutButton variant="page" authService={authService} />
    </>
  );
}
