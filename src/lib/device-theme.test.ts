import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bestEffortReadDeviceTheme,
  bestEffortRememberDeviceTheme,
  DEVICE_THEME_KEY,
  type DeviceStore,
} from './device-theme';

function blockedStore(): DeviceStore {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

describe('device theme', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('remembers a theme on this device and reads it back, with no cookie', () => {
    bestEffortRememberDeviceTheme('dark');

    expect(window.localStorage.getItem(DEVICE_THEME_KEY)).toBe('dark');
    expect(bestEffortReadDeviceTheme()).toBe('dark');
    expect(document.cookie).toBe('');
  });

  it('reads nothing when no theme was chosen, or when the stored value is not a theme', () => {
    expect(bestEffortReadDeviceTheme()).toBeUndefined();

    window.localStorage.setItem(DEVICE_THEME_KEY, 'sepia');

    expect(bestEffortReadDeviceTheme()).toBeUndefined();
  });

  it('keeps the system theme when the browser blocks storage, saying why in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(bestEffortReadDeviceTheme(blockedStore)).toBeUndefined();
    bestEffortRememberDeviceTheme('light', blockedStore);

    expect(warn).toHaveBeenCalledWith(
      'theme: could not read the theme on this device',
      expect.any(DOMException),
    );
    expect(warn).toHaveBeenCalledWith(
      'theme: could not remember the theme on this device',
      expect.any(DOMException),
    );
  });
});
