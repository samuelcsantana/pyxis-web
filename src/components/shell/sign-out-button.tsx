'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { FOCUS_RING, NAV_CONTROL, NAV_ITEM_IDLE } from '@/components/ui/control-classes';
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
    button: `${NAV_ITEM_IDLE} ${NAV_CONTROL}`,
    icon: 'text-nav-muted',
    error: 'text-nav-text',
  },
  page: {
    button: `self-start border border-line bg-card text-ink hover:border-muted ${FOCUS_RING}`,
    icon: 'text-muted',
    error: 'text-bad',
  },
} as const;

export function SignOutButton({ authService, variant = 'nav' }: SignOutButtonProps) {
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
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={signOut}
        disabled={busy}
        aria-busy={busy}
        className={`flex min-h-11 items-center gap-2.5 rounded-input px-3 text-sm disabled:cursor-wait ${classes.button}`}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" className={classes.icon}>
          <path
            d={SIGN_OUT_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{busy ? 'Signing out…' : 'Sign out'}</span>
      </button>
      {error === null ? null : (
        <p role="alert" className={`px-3 text-xs ${classes.error}`}>
          Could not sign out. Try again.
        </p>
      )}
    </div>
  );
}
