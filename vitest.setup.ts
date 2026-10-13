import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('@/i18n/current-locale', () => ({
  currentLocale: () => Promise.resolve('en'),
}));

HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.open = true;
};

HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

class ResizeObserverForTests implements ResizeObserver {
  private readonly observed = new Set<Element>();

  observe(target: Element): void {
    this.observed.add(target);
  }

  unobserve(target: Element): void {
    this.observed.delete(target);
  }

  disconnect(): void {
    this.observed.clear();
  }
}

globalThis.ResizeObserver = ResizeObserverForTests;

function noMediaQueryMatches(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  };
}

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: noMediaQueryMatches,
});

Element.prototype.getAnimations = function noAnimations(): Animation[] {
  return [];
};

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});
