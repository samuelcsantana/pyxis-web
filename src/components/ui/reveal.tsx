'use client';

import { type ReactNode, useState } from 'react';

export interface RevealProps {
  readonly show: string;
  readonly className?: string;
  readonly children: ReactNode;
}

const REVEALING = 'motion-safe:animate-reveal';

export function Reveal({ show, className = '', children }: RevealProps) {
  const [shown, setShown] = useState(show);
  const [switched, setSwitched] = useState(false);
  if (shown !== show) {
    setShown(show);
    setSwitched(true);
  }
  return (
    <div
      key={show}
      data-testid="reveal"
      className={`min-w-0 ${switched ? REVEALING : ''} ${className}`}
    >
      {children}
    </div>
  );
}
