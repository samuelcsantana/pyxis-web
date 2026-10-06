import Link from 'next/link';
import type { FunnelMode } from '@/domain/funnel';

export interface FunnelModeLink {
  readonly mode: FunnelMode;
  readonly label: string;
  readonly href: string;
}

export interface FunnelModesProps {
  readonly links: readonly FunnelModeLink[];
  readonly current: FunnelMode;
}

const OPTION_CLASS =
  'flex min-h-9 items-center rounded-control px-3.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

export function FunnelModes({ links, current }: FunnelModesProps) {
  return (
    <nav
      aria-label="Count by"
      className="flex w-fit gap-0.5 rounded-input border border-line bg-soft p-[3px]"
    >
      {links.map((link) => {
        const selected = link.mode === current;
        return (
          <Link
            key={link.mode}
            href={link.href}
            aria-current={selected ? 'page' : undefined}
            className={`${OPTION_CLASS} ${selected ? 'bg-ink text-card' : 'text-muted hover:text-ink'}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
