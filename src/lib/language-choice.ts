import type { Locale } from '@/i18n/locales';
import type { DeviceStore } from './device-theme';

export const DEVICE_LOCALE_KEY = 'pyxis:locale';
export const LANGUAGE_SWITCH_KEY = 'pyxis:language-switched';
export const LANGUAGE_SWITCHED_ATTRIBUTE = 'data-language-switched';

const browserDeviceStore = (): DeviceStore => window.localStorage;
const browserVisitStore = (): DeviceStore => window.sessionStorage;

export function bestEffortRememberLanguageChoice(
  locale: Locale,
  store: () => DeviceStore = browserDeviceStore,
): void {
  try {
    store().setItem(DEVICE_LOCALE_KEY, locale);
  } catch (error) {
    console.warn('landing: could not remember the language chosen on this device', error);
  }
}

export function bestEffortMarkLanguageSwitch(store: () => DeviceStore = browserVisitStore): void {
  try {
    store().setItem(LANGUAGE_SWITCH_KEY, LANGUAGE_SWITCH_KEY);
  } catch (error) {
    console.warn('landing: could not mark the page in the other language as a switch', error);
  }
}
