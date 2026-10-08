'use client';

import { type ReactNode, useId, useState } from 'react';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';

export interface CollapsibleFiltersProps {
  readonly label: string;
  readonly initiallyOpen: boolean;
  readonly children: ReactNode;
}

const CHEVRON = 'M4 6l4 4 4-4';

export function CollapsibleFilters({ label, initiallyOpen, children }: CollapsibleFiltersProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const fieldsId = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={fieldsId}
        onClick={() => {
          setOpen((wasOpen) => !wasOpen);
        }}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-input px-4 text-sm font-medium sm:hidden ${BUTTON_SECONDARY}`}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`size-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          <path
            d={CHEVRON}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div id={fieldsId} className={`${open ? 'flex' : 'hidden'} flex-col gap-4 sm:flex`}>
        {children}
      </div>
    </>
  );
}
