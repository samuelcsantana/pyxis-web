import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DeviceStore } from './device-theme';
import {
  bestEffortReadNudgeDismissed,
  bestEffortRememberNudgeDismissed,
  NUDGE_DISMISSED_KEY,
} from './nudge-dismissal';

function blockedStore(): DeviceStore {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

describe('nudge dismissal', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('remembers on this device that the nudge was dismissed, with no cookie', () => {
    expect(bestEffortReadNudgeDismissed()).toBe(false);

    bestEffortRememberNudgeDismissed();

    expect(window.localStorage.getItem(NUDGE_DISMISSED_KEY)).toBe('dismissed');
    expect(bestEffortReadNudgeDismissed()).toBe(true);
    expect(document.cookie).toBe('');
  });

  it('ignores a stored value it did not write', () => {
    window.localStorage.setItem(NUDGE_DISMISSED_KEY, 'maybe');

    expect(bestEffortReadNudgeDismissed()).toBe(false);
  });

  it('shows the nudge when the browser blocks storage, saying why in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(bestEffortReadNudgeDismissed(blockedStore)).toBe(false);
    bestEffortRememberNudgeDismissed(blockedStore);

    expect(warn).toHaveBeenCalledWith(
      'nudge: could not read its dismissal on this device',
      expect.any(DOMException),
    );
    expect(warn).toHaveBeenCalledWith(
      'nudge: could not remember its dismissal on this device',
      expect.any(DOMException),
    );
  });
});
