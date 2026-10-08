import Link from 'next/link';
import type { FunnelMode } from '@/domain/funnel';
import {
  PENDING_HOST,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';

export interface FunnelModeLink {
  readonly mode: FunnelMode;
  readonly label: string;
  readonly href: string;
}

export interface FunnelModesProps {
  readonly links: readonly FunnelModeLink[];
  readonly current: FunnelMode;
  readonly label: string;
}

const OPTION_CLASS = `min-h-9 px-3.5 ${PENDING_HOST} ${SEGMENTED_OPTION}`;

export function FunnelModes({ links, current, label }: FunnelModesProps) {
  return (
    <nav aria-label={label} className={`w-fit ${SEGMENTED_GROUP}`}>
      {links.map((link) => {
        const selected = link.mode === current;
        return (
          <Link
            key={link.mode}
            href={link.href}
            aria-current={selected ? 'page' : undefined}
            className={`${OPTION_CLASS} ${selected ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
          >
            {link.label}
            <PendingMark />
          </Link>
        );
      })}
    </nav>
  );
}
