import type { ReactNode } from 'react';
import { rich } from '@/i18n/rich';

const ALERT_ICON = 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 7.5v5.5 M12 16.5h.01';

export interface DemoHintProps {
  readonly code: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export interface FieldErrorProps {
  readonly id: string;
  readonly text: string;
}

export function FieldError({ id, text }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-caption font-medium text-bad">
      <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="mt-px shrink-0">
        <path
          d={ALERT_ICON}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
    </p>
  );
}

export function DemoHint({ code, message, action }: DemoHintProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-input bg-soft px-3 py-2.5 text-caption text-muted">
      <p className="min-w-0 flex-[1_1_12rem]">
        {rich(message, {
          code: () => <code className="font-mono font-semibold text-ink">{code}</code>,
        })}
      </p>
      {action}
    </div>
  );
}
