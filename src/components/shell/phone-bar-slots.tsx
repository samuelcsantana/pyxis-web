'use client';

import { createContext, type ReactNode, useContext, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

export type PhoneBarSlot = 'period' | 'filters' | 'periodLabel';

type HostSetter = (host: HTMLElement | null) => void;

interface PhoneBarSlots {
  readonly subscribe: (listener: () => void) => () => void;
  readonly hostOf: (slot: PhoneBarSlot) => HTMLElement | null;
  readonly setters: Readonly<Record<PhoneBarSlot, HostSetter>>;
}

function createPhoneBarSlots(): PhoneBarSlots {
  const hosts = new Map<PhoneBarSlot, HTMLElement | null>();
  const listeners = new Set<() => void>();
  const setterOf =
    (slot: PhoneBarSlot): HostSetter =>
    (host) => {
      hosts.set(slot, host);
      for (const listener of listeners) {
        listener();
      }
    };
  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    hostOf: (slot) => hosts.get(slot) ?? null,
    setters: {
      period: setterOf('period'),
      filters: setterOf('filters'),
      periodLabel: setterOf('periodLabel'),
    },
  };
}

const PhoneBarSlotsContext = createContext<PhoneBarSlots | null>(null);

export function PhoneBarSlotsProvider({ children }: { readonly children: ReactNode }) {
  const [slots] = useState(createPhoneBarSlots);
  return <PhoneBarSlotsContext value={slots}>{children}</PhoneBarSlotsContext>;
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

function noHostBeforeHydration(): null {
  return null;
}

export function usePhoneBarHost(slot: PhoneBarSlot): HTMLElement | null {
  const slots = useContext(PhoneBarSlotsContext);
  return useSyncExternalStore(
    slots?.subscribe ?? subscribeToNothing,
    () => slots?.hostOf(slot) ?? null,
    noHostBeforeHydration,
  );
}

export function usePhoneBarHostSetter(slot: PhoneBarSlot): HostSetter | undefined {
  return useContext(PhoneBarSlotsContext)?.setters[slot];
}

export interface InPhoneBarProps {
  readonly slot: PhoneBarSlot;
  readonly children: ReactNode;
}

export function InPhoneBar({ slot, children }: InPhoneBarProps) {
  const host = usePhoneBarHost(slot);
  return host === null ? null : createPortal(children, host);
}
