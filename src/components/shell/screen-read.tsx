'use client';

import { useEffect } from 'react';
import { noteScreenRead } from './arrival-news';

export interface ScreenReadProps {
  readonly readAt: number;
}

export function ScreenRead({ readAt }: ScreenReadProps) {
  useEffect(() => {
    noteScreenRead({
      path: window.location.pathname,
      search: window.location.search,
      readAt,
    });
  }, [readAt]);
  return null;
}
