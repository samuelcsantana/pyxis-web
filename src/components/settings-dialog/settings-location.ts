'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import {
  type SettingsLocation,
  type SettingsSection,
  settingsHash,
  settingsLocationOf,
} from './settings-sections';

const CLOSED_ON_SERVER = '';

let shownHash: string | null = null;
let shownView: string | null = null;
let openedByThisPage = false;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();

function announce() {
  for (const listener of listeners) {
    listener();
  }
}

function viewInTheAddressBar(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function followTheAddressBar() {
  shownHash = window.location.hash;
  shownView = viewInTheAddressBar();
  announce();
}

function currentHash(): string {
  shownHash ??= window.location.hash;
  return shownHash;
}

function onlyTheSettingsHashMoved(): boolean {
  const settingsWasShown = settingsLocationOf(currentHash()).kind !== 'closed';
  const settingsIsAsked = settingsLocationOf(window.location.hash).kind !== 'closed';
  return shownView === viewInTheAddressBar() && (settingsWasShown || settingsIsAsked);
}

function keepTheRouterOutOfSettingsSteps(event: PopStateEvent) {
  if (onlyTheSettingsHashMoved()) {
    event.stopImmediatePropagation();
  }
  followTheAddressBar();
}

const BEFORE_THE_ROUTER = { capture: true } as const;

function subscribe(onChange: () => void) {
  shownView ??= viewInTheAddressBar();
  listeners.add(onChange);
  window.addEventListener('popstate', keepTheRouterOutOfSettingsSteps, BEFORE_THE_ROUTER);
  window.addEventListener('hashchange', followTheAddressBar);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('popstate', keepTheRouterOutOfSettingsSteps, BEFORE_THE_ROUTER);
    window.removeEventListener('hashchange', followTheAddressBar);
  };
}

function serverHash(): string {
  return CLOSED_ON_SERVER;
}

function urlWithHash(hash: string): string {
  const { pathname, search } = window.location;
  return `${pathname}${search}${hash}`;
}

function keepingTheRouterState(write: 'pushState' | 'replaceState', hash: string) {
  window.history[write](window.history.state, '', urlWithHash(hash));
  shownHash = hash;
  announce();
}

export function useSettingsLocation(): SettingsLocation {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(followTheAddressBar, [pathname, search]);
  return settingsLocationOf(useSyncExternalStore(subscribe, currentHash, serverHash));
}

export function useAddressBarShowingSettings() {
  useEffect(() => {
    const hash = currentHash();
    if (settingsLocationOf(hash).kind !== 'closed' && hash !== window.location.hash) {
      window.history.replaceState(window.history.state, '', urlWithHash(hash));
    }
  });
}

export function openSettings(section?: SettingsSection, openedFrom?: HTMLElement) {
  if (settingsLocationOf(currentHash()).kind === 'closed') {
    openedByThisPage = true;
    opener = openedFrom ?? null;
    keepingTheRouterState('pushState', settingsHash(section));
    return;
  }
  keepingTheRouterState('replaceState', settingsHash(section));
}

export function showSettingsList() {
  keepingTheRouterState('replaceState', settingsHash());
}

export function closeSettings() {
  if (openedByThisPage) {
    openedByThisPage = false;
    window.history.back();
    return;
  }
  keepingTheRouterState('replaceState', '');
}

export function forgetHowSettingsOpened() {
  openedByThisPage = false;
}

export function takeTheSettingsOpener(): HTMLElement | null {
  const taken = opener;
  opener = null;
  return taken;
}
