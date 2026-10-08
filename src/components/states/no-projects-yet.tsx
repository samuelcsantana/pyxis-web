import { SignOutButton } from '@/components/shell/sign-out-button';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { EmptyState } from './empty-state';

export interface NoProjectsYetProps {
  readonly email: string;
  readonly authService?: IAuthService;
}

export function NoProjectsYet({ email, authService }: NoProjectsYetProps) {
  return (
    <>
      <EmptyState headingLevel="h1" title="No projects yet">
        <p>
          <strong className="text-ink">{email}</strong> can sign in, but no project was granted to
          it yet. Ask the operator of this Pyxis to run <code>admin:grant</code> for your email.
        </p>
      </EmptyState>
      <SignOutButton variant="page" authService={authService} />
    </>
  );
}
