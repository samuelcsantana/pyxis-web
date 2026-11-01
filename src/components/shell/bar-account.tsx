'use client';

import { createContext, type ReactNode, useContext } from 'react';

const BarAccountContext = createContext<ReactNode>(null);

export interface BarAccountProviderProps {
  readonly account: ReactNode;
  readonly children: ReactNode;
}

export function BarAccountProvider({ account, children }: BarAccountProviderProps) {
  return <BarAccountContext value={account}>{children}</BarAccountContext>;
}

export interface BarAccountProps {
  readonly className: string;
}

export function BarAccount({ className }: BarAccountProps) {
  const account = useContext(BarAccountContext);
  if (account === null) {
    return null;
  }
  return <div className={className}>{account}</div>;
}
