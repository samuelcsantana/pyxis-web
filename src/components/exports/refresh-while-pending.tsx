'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface RefreshWhilePendingProps {
  readonly pending: boolean;
}

export const EXPORT_REFRESH_MS = 5_000;
export const EXPORT_REFRESH_LIMIT = 120;

export function RefreshWhilePending({ pending }: RefreshWhilePendingProps) {
  const router = useRouter();

  useEffect(() => {
    if (!pending) {
      return;
    }
    let refreshes = 0;
    const timer = setInterval(() => {
      refreshes += 1;
      router.refresh();
      if (refreshes >= EXPORT_REFRESH_LIMIT) {
        clearInterval(timer);
      }
    }, EXPORT_REFRESH_MS);
    return () => {
      clearInterval(timer);
    };
  }, [pending, router]);

  return null;
}
