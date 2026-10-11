import { useCallback, useRef, useSyncExternalStore } from 'react';

export interface PendingSignIn {
  readonly email: string;
  readonly sentAt: number;
}

export interface RestoredSignIn extends PendingSignIn {
  readonly readAt: number;
}

export type SessionStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const PENDING_SIGN_IN_KEY = 'pyxis:pending-sign-in';
export const PENDING_SIGN_IN_LIFETIME_MS = 10 * 60 * 1000;

const browserSessionStore = (): SessionStore => window.sessionStorage;
const subscribeToNothing = () => () => undefined;
const nothingOnTheServer = () => null;

interface CachedSnapshot {
  readonly raw: string | null;
  readonly value: RestoredSignIn | null;
}

function isPendingSignIn(value: unknown): value is PendingSignIn {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.email === 'string' &&
    candidate.email !== '' &&
    typeof candidate.sentAt === 'number' &&
    Number.isFinite(candidate.sentAt)
  );
}

function warn(action: string, error: unknown): void {
  console.warn(`sign-in: could not ${action} the pending sign-in in this tab`, error);
}

function bestEffortReadRaw(store: () => SessionStore): string | null {
  try {
    return store().getItem(PENDING_SIGN_IN_KEY);
  } catch (error) {
    warn('read', error);
    return null;
  }
}

export function restoredSignIn(raw: string | null, now: number): RestoredSignIn | null {
  if (raw === null) {
    return null;
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    warn('parse', error);
    return null;
  }
  if (!isPendingSignIn(value) || now >= value.sentAt + PENDING_SIGN_IN_LIFETIME_MS) {
    return null;
  }
  return { email: value.email, sentAt: value.sentAt, readAt: now };
}

export function useRestoredSignIn(
  store: () => SessionStore = browserSessionStore,
): RestoredSignIn | null {
  const cache = useRef<CachedSnapshot | null>(null);
  const snapshot = useCallback(() => {
    const raw = bestEffortReadRaw(store);
    if (cache.current !== null && cache.current.raw === raw) {
      return cache.current.value;
    }
    const value = restoredSignIn(raw, Date.now());
    cache.current = { raw, value };
    return value;
  }, [store]);
  return useSyncExternalStore(subscribeToNothing, snapshot, nothingOnTheServer);
}

export function bestEffortRememberPendingSignIn(
  pending: PendingSignIn,
  store: () => SessionStore = browserSessionStore,
): void {
  try {
    store().setItem(PENDING_SIGN_IN_KEY, JSON.stringify(pending));
  } catch (error) {
    warn('remember', error);
  }
}

export function bestEffortForgetPendingSignIn(
  store: () => SessionStore = browserSessionStore,
): void {
  try {
    store().removeItem(PENDING_SIGN_IN_KEY);
  } catch (error) {
    warn('forget', error);
  }
}
