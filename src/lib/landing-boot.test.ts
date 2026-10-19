import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CARRIED_REFERRER_KEY } from './carried-referrer';
import { DEVICE_THEME_KEY } from './device-theme';
import { bestEffortBootLanding, landingBootScript, landingBootSettings } from './landing-boot';
import {
  DEVICE_LOCALE_KEY,
  LANGUAGE_SWITCH_KEY,
  LANGUAGE_SWITCHED_ATTRIBUTE,
} from './language-choice';

const replace = vi.fn<(address: string) => void>();

function visit(pathname: string, search = '', hash = ''): void {
  vi.stubGlobal('location', { pathname, search, hash, replace });
}

function arriveFrom(referrer: string): void {
  Object.defineProperty(document, 'referrer', { configurable: true, value: referrer });
}

function speak(...languages: string[]): void {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
}

function boot(): void {
  bestEffortBootLanding(landingBootSettings());
}

describe('landing boot', () => {
  beforeEach(() => {
    replace.mockClear();
    visit('/');
    arriveFrom('');
    speak('en-US', 'en');
  });

  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.removeAttribute(LANGUAGE_SWITCHED_ATTRIBUTE);
    Reflect.deleteProperty(document, 'referrer');
  });

  describe('the theme kept on this device', () => {
    it('is applied before the page is drawn', () => {
      window.localStorage.setItem(DEVICE_THEME_KEY, 'dark');

      boot();

      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('leaves the system theme alone when none, or an unknown one, is kept', () => {
      boot();
      expect(document.documentElement.dataset.theme).toBeUndefined();

      window.localStorage.setItem(DEVICE_THEME_KEY, 'sepia');
      boot();
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });
  });

  describe('a page reached through the language select', () => {
    it('is marked so its entrance plays no animation, once', () => {
      window.sessionStorage.setItem(LANGUAGE_SWITCH_KEY, LANGUAGE_SWITCH_KEY);
      visit('/pt-br');

      boot();

      expect(document.documentElement).toHaveAttribute(LANGUAGE_SWITCHED_ATTRIBUTE, '');
      expect(window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY)).toBeNull();
    });

    it('is not marked when the visit did not come from a switch', () => {
      boot();

      expect(document.documentElement).not.toHaveAttribute(LANGUAGE_SWITCHED_ATTRIBUTE);
    });
  });

  describe('the address that names no language', () => {
    it('opens the language chosen before on this device, keeping the query and section', () => {
      window.localStorage.setItem(DEVICE_LOCALE_KEY, 'pt-BR');
      visit('/', '?utm_source=post', '#pricing');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/pt-br?utm_source=post#pricing');
    });

    it('stays in English when English was the language chosen, whatever the browser speaks', () => {
      window.localStorage.setItem(DEVICE_LOCALE_KEY, 'en');
      speak('pt-BR');

      boot();

      expect(replace).not.toHaveBeenCalled();
    });

    it('opens the language the browser asks for first, matching on the language', () => {
      speak('ja-JP', 'es-MX', 'pt-BR');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/es');
    });

    it('matches the browser language whatever its case', () => {
      speak('PT-br');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/pt-br');
    });

    it('stays in English when the browser asks only for languages it does not ship', () => {
      speak('ja-JP', 'pl');

      boot();

      expect(replace).not.toHaveBeenCalled();
    });

    it('ignores a kept language it does not ship, and asks the browser instead', () => {
      window.localStorage.setItem(DEVICE_LOCALE_KEY, 'ja');
      speak('es');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/es');
    });

    it('trusts a link from another site, and the browser, over the address', () => {
      arriveFrom('https://www.linkedin.com/feed/');
      speak('pt-PT');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/pt-br');
    });

    it('keeps English when the visitor came from a Pyxis page, which already chose it', () => {
      speak('pt-BR');

      arriveFrom('https://app.pyxis-analytics.dev/');
      boot();
      arriveFrom('https://pyxis-analytics.dev/legal/terms');
      boot();

      expect(replace).not.toHaveBeenCalled();
    });

    it('still opens the language chosen before when the visitor came from a Pyxis page', () => {
      window.localStorage.setItem(DEVICE_LOCALE_KEY, 'es');
      arriveFrom('https://demo.pyxis-analytics.dev/');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/es');
    });
  });

  describe('the site the visitor came from', () => {
    it('is carried to the page it opens, so the visit keeps its source', () => {
      arriveFrom('https://www.linkedin.com/feed/');
      speak('pt-BR');

      boot();

      expect(window.sessionStorage.getItem(CARRIED_REFERRER_KEY)).toBe(
        'https://www.linkedin.com/feed/',
      );
    });

    it('is carried as empty for a direct visit, so it stays direct', () => {
      speak('pt-BR');

      boot();

      expect(window.sessionStorage.getItem(CARRIED_REFERRER_KEY)).toBe('');
    });

    it('is not carried when the page stays where it is', () => {
      arriveFrom('https://www.linkedin.com/feed/');

      boot();

      expect(window.sessionStorage.getItem(CARRIED_REFERRER_KEY)).toBeNull();
    });

    it('does not keep the page from opening when it cannot be carried, saying why', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      });
      speak('es');

      boot();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/es');
      expect(warn).toHaveBeenCalledOnce();
    });
  });

  it('never moves away from an address that names its language', () => {
    window.localStorage.setItem(DEVICE_LOCALE_KEY, 'pt-BR');
    speak('es');
    visit('/es');

    boot();

    expect(replace).not.toHaveBeenCalled();
  });

  it('draws the page as it is when the browser blocks storage, saying why in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });

    boot();

    expect(replace).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledOnce();
  });

  it('runs as one self-contained script, before any module of the page is loaded', () => {
    window.history.replaceState(null, '', '/pt-br');
    window.localStorage.setItem(DEVICE_THEME_KEY, 'dark');
    window.sessionStorage.setItem(LANGUAGE_SWITCH_KEY, LANGUAGE_SWITCH_KEY);

    const script = document.createElement('script');
    script.textContent = landingBootScript();
    document.body.append(script);
    script.remove();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement).toHaveAttribute(LANGUAGE_SWITCHED_ATTRIBUTE, '');
    window.history.replaceState(null, '', '/');
  });
});
