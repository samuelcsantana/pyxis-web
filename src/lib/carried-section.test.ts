import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DeviceStore } from './device-theme';
import {
  bestEffortCarrySection,
  bestEffortOpenOnCarriedSection,
  CARRIED_SECTION_KEY,
  carriedSectionScript,
} from './carried-section';

function blockedStore(): DeviceStore {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

const address = (): string =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

describe('carried section', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/pt-br?theme=dark');
  });

  afterEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });

  it('carries the address to open in this tab only, with no cookie', () => {
    bestEffortCarrySection('/pt-br#pricing');

    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBe('/pt-br#pricing');
    expect(window.localStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
    expect(document.cookie).toBe('');
  });

  it('opens the page on the carried section, keeping its query, and forgets it', () => {
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/pt-br#pricing');

    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);

    expect(address()).toBe('/pt-br?theme=dark#pricing');
    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
  });

  it('forgets a section carried to another page without opening on it', () => {
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/es#faq');

    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);

    expect(address()).toBe('/pt-br?theme=dark');
    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
  });

  it('keeps a section the address already names, and opens nothing from the top', () => {
    window.history.replaceState(null, '', '/pt-br#faq');
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/pt-br#pricing');
    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);
    expect(address()).toBe('/pt-br#faq');

    window.history.replaceState(null, '', '/pt-br');
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/pt-br');
    const replace = vi.spyOn(window.history, 'replaceState');
    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);
    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);

    expect(replace).not.toHaveBeenCalled();
    expect(address()).toBe('/pt-br');
  });

  it('opens the page as it is when the browser blocks storage, saying why in the console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });

    bestEffortCarrySection('/pt-br#pricing', blockedStore);
    bestEffortOpenOnCarriedSection(CARRIED_SECTION_KEY);

    expect(address()).toBe('/pt-br?theme=dark');
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('ships as a script that runs on its own, before the page is read', () => {
    window.sessionStorage.setItem(CARRIED_SECTION_KEY, '/pt-br#faq');

    const script = document.createElement('script');
    script.textContent = carriedSectionScript();
    document.body.append(script);

    expect(address()).toBe('/pt-br?theme=dark#faq');
    expect(window.sessionStorage.getItem(CARRIED_SECTION_KEY)).toBeNull();
    script.remove();
  });
});
