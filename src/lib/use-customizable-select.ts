import { useSyncExternalStore } from 'react';
import { subscribeToNothing } from './static-store';

function browserCustomizesSelects(): boolean {
  return CSS.supports('appearance', 'base-select');
}

function notOnTheServer(): boolean {
  return false;
}

export function useCustomizableSelect(): boolean {
  return useSyncExternalStore(subscribeToNothing, browserCustomizesSelects, notOnTheServer);
}
