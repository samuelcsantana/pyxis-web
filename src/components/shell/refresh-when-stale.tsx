'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export const STALE_AFTER_MS = 20_000;

export type ReadAge = (readAt: number, now: number) => number;

export function readAges(): ReadAge {
  let serverAhead: number | undefined;
  return (readAt, now) => {
    serverAhead ??= readAt - now;
    return now + serverAhead - readAt;
  };
}

const ageOfRead = readAges();

export interface RefreshWhenStaleProps {
  readonly readAt: number;
}

export function RefreshWhenStale({ readAt }: RefreshWhenStaleProps) {
  const router = useRouter();
  useEffect(() => {
    if (ageOfRead(readAt, Date.now()) > STALE_AFTER_MS) {
      startTransition(() => {
        router.refresh();
      });
    }
  }, [readAt, router]);
  return null;
}
