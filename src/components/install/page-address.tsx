'use client';

import { useSyncExternalStore } from 'react';
import { type CopyCodeLabels, CopyCodeButton } from '@/components/landing/copy-code-button';

export interface PageAddressProps {
  readonly id: string;
  readonly labels: CopyCodeLabels;
}

const NO_ADDRESS_ON_THE_SERVER = '';

function neverChanges(): () => void {
  return () => undefined;
}

function currentAddress(): string {
  return window.location.href;
}

function addressOnTheServer(): string {
  return NO_ADDRESS_ON_THE_SERVER;
}

export function PageAddress({ id, labels }: PageAddressProps) {
  const address = useSyncExternalStore(neverChanges, currentAddress, addressOnTheServer);
  return (
    <div className="relative rounded-card bg-nav pt-13 pr-4 pb-4 pl-4 font-mono text-sm leading-6 text-nav-strong">
      <p id={id} className="m-0 break-all">
        {address}
      </p>
      <CopyCodeButton code={address} targetId={id} labels={labels} />
    </div>
  );
}
