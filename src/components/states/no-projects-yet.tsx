import { SignOutButton } from '@/components/shell/sign-out-button';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { EmptyState } from './empty-state';

export interface NoProjectsYetProps {
  readonly email: string;
  readonly authService?: IAuthService;
  readonly i18n: I18n;
}

export function NoProjectsYet({ email, authService, i18n }: NoProjectsYetProps) {
  return (
    <>
      <EmptyState headingLevel="h1" title={i18n.t('states.noProjects.title')}>
        <p>
          {rich(i18n.t('states.noProjects.body'), {
            email: () => <strong className="text-ink">{email}</strong>,
            code: (text) => <code>{text}</code>,
          })}
        </p>
      </EmptyState>
      <SignOutButton variant="page" authService={authService} />
    </>
  );
}
