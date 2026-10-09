'use client';

import Link from 'next/link';
import {
  PENDING_HOST,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  SEGMENTED_THUMB,
} from './control-classes';
import { PendingMark } from './pending-mark';
import { SlidingIndicator } from './sliding-indicator';
import { useChoiceAhead } from './use-choice-ahead';
import { choiceMark, useSlidingIndicator } from './use-sliding-indicator';

export interface SegmentedLink<Key extends string> {
  readonly key: Key;
  readonly label: string;
  readonly href: string;
}

export interface SegmentedLinksProps<Key extends string> {
  readonly label: string;
  readonly links: readonly SegmentedLink<Key>[];
  readonly current: Key;
  readonly className?: string;
}

const OPTION = `min-h-9 px-3.5 ${PENDING_HOST} ${SEGMENTED_OPTION}`;

export function SegmentedLinks<Key extends string>({
  label,
  links,
  current,
  className = '',
}: SegmentedLinksProps<Key>) {
  const [shown, choose] = useChoiceAhead(current);
  const { attach, frame, sliding } = useSlidingIndicator(shown);
  return (
    <nav
      ref={attach}
      aria-label={label}
      data-sliding={sliding}
      className={`${SEGMENTED_GROUP} ${className}`}
    >
      <SlidingIndicator frame={frame} shape="fill" className={SEGMENTED_THUMB} />
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          {...choiceMark(link.key)}
          aria-current={link.key === current ? 'page' : undefined}
          onClick={() => {
            choose(link.key);
          }}
          className={`${OPTION} ${link.key === shown ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
        >
          {link.label}
          <PendingMark />
        </Link>
      ))}
    </nav>
  );
}
