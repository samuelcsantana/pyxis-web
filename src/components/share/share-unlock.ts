const UNLOCK_KEY_PREFIX = 'pyxis.share-unlock.';
const SECONDS_PER_MINUTE = 60;

function unlockKey(token: string): string {
  return `${UNLOCK_KEY_PREFIX}${token}`;
}

export function storedUnlock(token: string): string | null {
  return window.sessionStorage.getItem(unlockKey(token));
}

export function keepUnlock(token: string, unlock: string): void {
  window.sessionStorage.setItem(unlockKey(token), unlock);
}

export function forgetUnlock(token: string): void {
  window.sessionStorage.removeItem(unlockKey(token));
}

export function unlockOf(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('unlock' in body)) {
    return null;
  }
  return typeof body.unlock === 'string' ? body.unlock : null;
}

export function minutesUntilRetry(retryAfter: string | null): number {
  const seconds = Number(retryAfter);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / SECONDS_PER_MINUTE) : 1;
}
