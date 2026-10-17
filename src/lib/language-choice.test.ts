import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DeviceStore } from './device-theme';
import {
  bestEffortMarkLanguageSwitch,
  bestEffortRememberLanguageChoice,
  DEVICE_LOCALE_KEY,
  LANGUAGE_SWITCH_KEY,
} from './language-choice';

function blockedStore(): DeviceStore {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

describe('the language choice', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('is kept on this device only, with no cookie', () => {
    bestEffortRememberLanguageChoice('pt-BR');

    expect(window.localStorage.getItem(DEVICE_LOCALE_KEY)).toBe('pt-BR');
    expect(document.cookie).toBe('');
  });

  it('marks the next page of this tab as reached by a switch', () => {
    bestEffortMarkLanguageSwitch();

    expect(window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY)).not.toBeNull();
    expect(window.localStorage.getItem(LANGUAGE_SWITCH_KEY)).toBeNull();
  });

  it('still lets the visitor switch when the browser blocks storage, saying why', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    bestEffortRememberLanguageChoice('es', blockedStore);
    bestEffortMarkLanguageSwitch(blockedStore);

    expect(warn).toHaveBeenCalledTimes(2);
  });
});
