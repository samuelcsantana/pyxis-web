import { useEffect, useRef, useState } from 'react';
import { catchToState } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import type { RouteDaysView } from '@/domain/route-days';
import type { RouteDaysState } from './route-days';

export type LoadRouteDays = (route: string) => Promise<RouteDaysView | null>;

interface LoadedDays {
  readonly route: string;
  readonly view: RouteDaysView | null;
}

export interface RouteDaysLoader {
  readonly show: (route: string) => void;
  readonly retry: (route: string) => void;
  readonly stateOf: (route: string) => RouteDaysState;
}

export function useRouteDays(load: LoadRouteDays): RouteDaysLoader {
  const [loaded, setLoaded] = useState<LoadedDays | null>(null);
  const [failedRoute, setFailedRoute] = useState<string | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const requestedRoute = useRef<string | null>(null);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
    },
    [],
  );

  const retry = (route: string) => {
    request.current?.unsubscribe();
    requestedRoute.current = route;
    setFailedRoute(null);
    request.current = defer(() => load(route))
      .pipe(
        tap((view) => {
          setLoaded({ route, view });
        }),
        catchToState(() => {
          setFailedRoute(route);
        }),
      )
      .subscribe();
  };

  const show = (route: string) => {
    if (requestedRoute.current !== route || failedRoute === route) {
      retry(route);
    }
  };

  const stateOf = (route: string): RouteDaysState => {
    if (failedRoute === route) {
      return { status: 'error' };
    }
    if (loaded?.route !== route) {
      return { status: 'loading' };
    }
    return loaded.view === null
      ? { status: 'unavailable' }
      : { status: 'ready', view: loaded.view };
  };

  return { show, retry, stateOf };
}
