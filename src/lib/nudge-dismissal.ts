import type { DeviceStore } from './device-theme';

export const NUDGE_DISMISSED_KEY = 'pyxis:ask-claude-nudge';
const DISMISSED = 'dismissed';

const browserVisitStore = (): DeviceStore => window.sessionStorage;

function warn(action: string, error: unknown): void {
  console.warn(`nudge: could not ${action} its dismissal in this visit`, error);
}

export function bestEffortReadNudgeDismissed(
  store: () => DeviceStore = browserVisitStore,
): boolean {
  try {
    return store().getItem(NUDGE_DISMISSED_KEY) === DISMISSED;
  } catch (error) {
    warn('read', error);
    return false;
  }
}

export function bestEffortRememberNudgeDismissed(
  store: () => DeviceStore = browserVisitStore,
): void {
  try {
    store().setItem(NUDGE_DISMISSED_KEY, DISMISSED);
  } catch (error) {
    warn('remember', error);
  }
}
