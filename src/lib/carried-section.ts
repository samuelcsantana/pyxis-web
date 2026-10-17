import type { DeviceStore } from './device-theme';

export const CARRIED_SECTION_KEY = 'pyxis:carried-section';

const browserVisitStore = (): DeviceStore => window.sessionStorage;

export function bestEffortCarrySection(
  destination: string,
  store: () => DeviceStore = browserVisitStore,
): void {
  try {
    store().setItem(CARRIED_SECTION_KEY, destination);
  } catch (error) {
    console.warn('landing: could not carry the section being read to the other language', error);
  }
}

export function bestEffortOpenOnCarriedSection(key: string): void {
  try {
    const carried = window.sessionStorage.getItem(key);
    window.sessionStorage.removeItem(key);
    if (carried === null || window.location.hash !== '') {
      return;
    }
    const destination = new URL(carried, window.location.href);
    if (destination.pathname === window.location.pathname && destination.hash !== '') {
      const { pathname, search } = window.location;
      window.history.replaceState(
        window.history.state,
        '',
        `${pathname}${search}${destination.hash}`,
      );
    }
  } catch (error) {
    console.warn('landing: could not open on the section carried from the other language', error);
  }
}

export function carriedSectionScript(): string {
  return `(${bestEffortOpenOnCarriedSection.toString()})(${JSON.stringify(CARRIED_SECTION_KEY)});`;
}
