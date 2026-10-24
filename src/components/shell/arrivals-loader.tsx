'use client';

import { type ComponentType, startTransition, useEffect, useState } from 'react';
import type { ArrivalsWatcherProps } from './arrivals-watcher';

export function ArrivalsLoader(props: ArrivalsWatcherProps) {
  const [Watcher, setWatcher] = useState<ComponentType<ArrivalsWatcherProps>>();
  useEffect(() => {
    import('./arrivals-watcher').then(
      (watcher) => {
        startTransition(() => {
          setWatcher(() => watcher.default);
        });
      },
      (error: unknown) => {
        console.warn('arrivals: could not load the watcher', error);
      },
    );
  }, []);
  return Watcher === undefined ? null : <Watcher {...props} />;
}
