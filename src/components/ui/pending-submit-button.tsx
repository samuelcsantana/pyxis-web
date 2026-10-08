'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';
import { useHoldNavigationWhile } from '@/components/shell/navigation-pending';
import { CONTROL_BUSY } from './control-classes';

export interface PendingSubmitButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children' | 'className' | 'aria-busy'
> {
  readonly label: string;
  readonly pendingLabel: string;
  readonly className: string;
}

const STACKED = 'col-start-1 row-start-1';

function shownWhen(shown: boolean): string {
  return shown ? STACKED : `invisible ${STACKED}`;
}

export function PendingSubmitButton({
  label,
  pendingLabel,
  className,
  ...attributes
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();
  useHoldNavigationWhile(pending);
  return (
    <button
      {...attributes}
      type="submit"
      aria-busy={pending ? true : undefined}
      className={`grid items-center ${className} ${CONTROL_BUSY}`}
    >
      <span aria-hidden={pending ? true : undefined} className={shownWhen(!pending)}>
        {label}
      </span>
      <span aria-hidden={pending ? undefined : true} className={shownWhen(pending)}>
        {pendingLabel}
      </span>
    </button>
  );
}
