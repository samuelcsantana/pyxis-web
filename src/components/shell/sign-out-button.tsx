'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  NAV_CONTROL,
  NAV_ITEM_IDLE,
} from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { createAuthService } from '@/services/auth/auth-service.factory';

export const SIGN_OUT_MIN_BUSY_MS = 400;
const SIGN_OUT_ICON = 'M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10';

export interface SignOutButtonProps {
  readonly authService?: IAuthService;
  readonly variant?: 'nav' | 'page';
}

const VARIANT_CLASSES = {
  nav: {
    frame: 'contents',
    button: `px-2.5 text-caption ${NAV_ITEM_IDLE} ${NAV_CONTROL}`,
    error: 'basis-full px-1 text-nav-text',
    withIcon: false,
  },
  page: {
    frame: 'flex flex-col gap-1',
    button: `gap-2.5 self-start px-3 text-sm ${BUTTON_SECONDARY}`,
    error: 'px-3 text-bad',
    withIcon: true,
  },
} as const;

function SignOutIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" className="text-muted">
      <path
        d={SIGN_OUT_ICON}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SignOutButton({ authService, variant = 'nav' }: SignOutButtonProps) {
  const t = useT();
  const classes = VARIANT_CLASSES[variant];
  const router = useRouter();
  const service = useMemo(() => authService ?? createAuthService(), [authService]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const signOut = () => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => service.signOut())
      .pipe(
        tap(() => {
          router.replace('/sign-in');
          router.refresh();
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, SIGN_OUT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <div className={classes.frame}>
      <button
        type="button"
        onClick={signOut}
        disabled={busy}
        aria-busy={busy}
        className={`flex min-h-11 shrink-0 items-center rounded-input ${CONTROL_BUSY} ${classes.button}`}
      >
        {classes.withIcon ? <SignOutIcon /> : null}
        <span>{busy ? t('nav.signingOut') : t('nav.signOut')}</span>
      </button>
      {error === null ? null : (
        <p role="alert" className={`text-xs ${classes.error}`}>
          {t('nav.signOutFailed')}
        </p>
      )}
    </div>
  );
}
