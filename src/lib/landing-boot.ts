import type { Locale } from '@/i18n/locales';
import { DEVICE_THEME_KEY, type DeviceStore } from './device-theme';
import { DEFAULT_LANDING_PAGE, LANDING_PAGES } from './landing-pages';
import { LANDING_HOST } from './site';
import { THEMES } from './theme';

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

export interface LandingBootSettings {
  readonly themeKey: string;
  readonly themes: readonly string[];
  readonly localeKey: string;
  readonly switchKey: string;
  readonly switchedAttribute: string;
  readonly undecidedPath: string;
  readonly pyxisHost: string;
  readonly pages: readonly { readonly locale: string; readonly path: string }[];
}

export function bestEffortBootLanding(settings: LandingBootSettings): void {
  try {
    const root = document.documentElement;
    const theme = window.localStorage.getItem(settings.themeKey);
    if (theme !== null && settings.themes.includes(theme)) {
      root.dataset.theme = theme;
    }
    if (window.sessionStorage.getItem(settings.switchKey) !== null) {
      window.sessionStorage.removeItem(settings.switchKey);
      root.setAttribute(settings.switchedAttribute, '');
    }
    if (window.location.pathname !== settings.undecidedPath) {
      return;
    }
    const pageOf = (tag: string) => {
      const wanted = tag.toLowerCase();
      const primary = (each: string) => each.toLowerCase().split('-', 1).join('');
      return (
        settings.pages.find((page) => page.locale.toLowerCase() === wanted) ??
        settings.pages.find((page) => primary(page.locale) === primary(wanted))
      );
    };
    const referrerHost = document.referrer === '' ? '' : new URL(document.referrer).hostname;
    const cameFromPyxis =
      referrerHost === settings.pyxisHost || referrerHost.endsWith(`.${settings.pyxisHost}`);
    const chosen = window.localStorage.getItem(settings.localeKey);
    const browserPage = () =>
      cameFromPyxis
        ? undefined
        : window.navigator.languages.map(pageOf).find((each) => each !== undefined);
    const page = settings.pages.find((each) => each.locale === chosen) ?? browserPage();
    if (page === undefined || page.path === settings.undecidedPath) {
      return;
    }
    const { search, hash } = window.location;
    window.location.replace(`${page.path}${search}${hash}`);
  } catch (error) {
    console.warn('landing: could not apply the preferences kept on this device', error);
  }
}

export function landingBootSettings(): LandingBootSettings {
  return {
    themeKey: DEVICE_THEME_KEY,
    themes: THEMES,
    localeKey: DEVICE_LOCALE_KEY,
    switchKey: LANGUAGE_SWITCH_KEY,
    switchedAttribute: LANGUAGE_SWITCHED_ATTRIBUTE,
    undecidedPath: DEFAULT_LANDING_PAGE.path,
    pyxisHost: LANDING_HOST,
    pages: LANDING_PAGES.map(({ locale, path }) => ({ locale, path })),
  };
}

export function landingBootScript(): string {
  return `(${bestEffortBootLanding.toString()})(${JSON.stringify(landingBootSettings())});`;
}
