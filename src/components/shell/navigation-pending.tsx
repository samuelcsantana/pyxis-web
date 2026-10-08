'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Release = () => void;

interface NavigationPending {
  readonly pending: boolean;
  readonly hold: () => Release;
}

function releaseNothing() {
  return undefined;
}

const IDLE: NavigationPending = { pending: false, hold: () => releaseNothing };

const NavigationPendingContext = createContext<NavigationPending>(IDLE);

export interface NavigationPendingProviderProps {
  readonly children: ReactNode;
}

export function NavigationPendingProvider({ children }: NavigationPendingProviderProps) {
  const [holds, setHolds] = useState(0);
  const hold = useCallback(() => {
    setHolds((count) => count + 1);
    return () => {
      setHolds((count) => count - 1);
    };
  }, []);
  const value = useMemo(() => ({ pending: holds > 0, hold }), [holds, hold]);
  return <NavigationPendingContext value={value}>{children}</NavigationPendingContext>;
}

export function useHoldNavigationWhile(pending: boolean) {
  const { hold } = useContext(NavigationPendingContext);
  useEffect(() => (pending ? hold() : undefined), [pending, hold]);
}

export interface NavigationRegionProps {
  readonly className: string;
  readonly children: ReactNode;
}

export function NavigationRegion({ className, children }: NavigationRegionProps) {
  const { pending } = useContext(NavigationPendingContext);
  return (
    <div
      aria-busy={pending ? true : undefined}
      data-navigating={pending ? '' : undefined}
      className={`group/navigation ${className} data-navigating:cursor-progress`}
    >
      {children}
    </div>
  );
}
