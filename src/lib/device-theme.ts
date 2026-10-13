import { parseTheme, type Theme } from './theme';

export type DeviceStore = Pick<Storage, 'getItem' | 'setItem'>;

export const DEVICE_THEME_KEY = 'pyxis:theme';

const browserDeviceStore = (): DeviceStore => window.localStorage;

function warn(action: string, error: unknown): void {
  console.warn(`theme: could not ${action} the theme on this device`, error);
}

export function bestEffortReadDeviceTheme(
  store: () => DeviceStore = browserDeviceStore,
): Theme | undefined {
  try {
    return parseTheme(store().getItem(DEVICE_THEME_KEY) ?? undefined);
  } catch (error) {
    warn('read', error);
    return undefined;
  }
}

export function bestEffortRememberDeviceTheme(
  theme: Theme,
  store: () => DeviceStore = browserDeviceStore,
): void {
  try {
    store().setItem(DEVICE_THEME_KEY, theme);
  } catch (error) {
    warn('remember', error);
  }
}
