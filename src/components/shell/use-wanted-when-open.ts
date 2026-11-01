'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

export interface WantedWhenOpen {
  readonly anchor: RefObject<HTMLDivElement | null>;
  readonly wanted: boolean;
}

export function useWantedWhenOpen(openAtFirst: boolean): WantedWhenOpen {
  const anchor = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(openAtFirst);

  useEffect(() => {
    const details = anchor.current?.closest('details');
    if (details === null || details === undefined) {
      return undefined;
    }
    const loadWhenOpen = () => {
      if (details.open) {
        setWanted(true);
      }
    };
    details.addEventListener('toggle', loadWhenOpen);
    return () => {
      details.removeEventListener('toggle', loadWhenOpen);
    };
  }, []);

  return { anchor, wanted };
}
