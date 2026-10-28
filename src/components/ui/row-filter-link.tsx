import Link from 'next/link';
import { CONTROL_TRANSITION, FOCUS_RING } from './control-classes';

export interface RowFilter {
  readonly href: string;
  readonly active: boolean;
  readonly label: string;
  readonly title: string;
}

const LINK = `inline-flex size-7 shrink-0 items-center justify-center rounded-pill align-middle sm:size-6 ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const IDLE = 'text-muted hover:bg-soft hover:text-ink active:bg-line';
const ACTIVE = 'bg-ink text-card hover:bg-ink-hover active:bg-ink-pressed';
const FILTER_LINES = 'M5 7h14 M8 12h8 M11 17h2';
const CROSS = 'M7 7l10 10M17 7L7 17';

export function RowFilterLink({ filter }: { readonly filter: RowFilter }) {
  return (
    <Link
      href={filter.href}
      aria-label={filter.label}
      title={filter.title}
      className={`${LINK} ${filter.active ? ACTIVE : IDLE}`}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={filter.active ? CROSS : FILTER_LINES}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
