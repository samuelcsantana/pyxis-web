import { CARRIED_REFERRER_KEY } from './carried-referrer';
import { DEVICE_THEME_KEY } from './device-theme';
import {
  DEVICE_LOCALE_KEY,
  LANGUAGE_SWITCH_KEY,
  LANGUAGE_SWITCHED_ATTRIBUTE,
} from './language-choice';
import { DEFAULT_LANDING_PAGE, LANDING_PAGES } from './landing-pages';
import { LANDING_HOST } from './site';
import { THEMES } from './theme';

export interface LandingBootSettings {
  readonly themeKey: string;
  readonly themes: readonly string[];
  readonly localeKey: string;
  readonly switchKey: string;
  readonly switchedAttribute: string;
  readonly referrerKey: string;
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
    try {
      window.sessionStorage.setItem(settings.referrerKey, document.referrer);
    } catch (error) {
      console.warn(
        'landing: could not carry the referrer to the page in the other language',
        error,
      );
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
    referrerKey: CARRIED_REFERRER_KEY,
    undecidedPath: DEFAULT_LANDING_PAGE.path,
    pyxisHost: LANDING_HOST,
    pages: LANDING_PAGES.map(({ locale, path }) => ({ locale, path })),
  };
}

export function landingBootScript(): string {
  return `(${bestEffortBootLanding.toString()})(${JSON.stringify(landingBootSettings())});`;
}
