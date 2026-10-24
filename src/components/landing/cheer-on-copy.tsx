'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { CODE_COPIED_EVENT } from './copy-code-button';

export interface CheerOnCopyProps {
  readonly codeId: string;
  readonly children: ReactNode;
}

export function CheerOnCopy({ codeId, children }: CheerOnCopyProps) {
  const [cheers, setCheers] = useState(0);

  useEffect(() => {
    const cheer = (event: Event) => {
      if (event instanceof CustomEvent && event.detail === codeId) {
        setCheers((count) => count + 1);
      }
    };
    window.addEventListener(CODE_COPIED_EVENT, cheer);
    return () => {
      window.removeEventListener(CODE_COPIED_EVENT, cheer);
    };
  }, [codeId]);

  return (
    <span key={cheers} className={cheers === 0 ? 'block' : 'landing-robot-cheer block'}>
      {children}
    </span>
  );
}
