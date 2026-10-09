'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PENDING_HOST, SEGMENTED_IDLE, SEGMENTED_OPTION } from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';
import type { PeriodPreset } from '@/domain/period';

export interface PresetLink {
  readonly preset: PeriodPreset;
  readonly label: string;
  readonly href: string;
}

export interface PeriodPresetsProps {
  readonly label: string;
  readonly links: readonly PresetLink[];
  readonly current: PeriodPreset | 'custom';
}

interface Choice {
  readonly preset: PeriodPreset;
  readonly madeOn: PeriodPreset | 'custom';
}

const GROUP =
  'relative grid auto-cols-fr grid-flow-col gap-0.5 rounded-input border border-line bg-soft p-[3px]';
const OPTION = `relative z-[1] justify-center min-h-11 px-2 sm:min-h-8.5 sm:px-3 ${PENDING_HOST} ${SEGMENTED_OPTION}`;
const INDICATOR =
  'pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] rounded-control bg-ink transition-[translate,opacity] duration-200 ease-out motion-reduce:transition-none';
const GROUP_PADDING_PX = 3;
const OPTION_GAP_PX = 2;

function indicatorWidth(options: number): string {
  const taken = 2 * GROUP_PADDING_PX + (options - 1) * OPTION_GAP_PX;
  return `calc((100% - ${String(taken)}px) / ${String(options)})`;
}

export function PeriodPresets({ label, links, current }: PeriodPresetsProps) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const shown = choice !== null && choice.madeOn === current ? choice.preset : current;
  const index = links.findIndex((link) => link.preset === shown);
  return (
    <nav aria-label={label} className={GROUP}>
      <span
        aria-hidden="true"
        data-testid="period-indicator"
        className={`${INDICATOR} ${index === -1 ? 'opacity-0' : 'opacity-100'}`}
        style={{
          width: indicatorWidth(links.length),
          translate: `calc(${String(Math.max(index, 0))} * (100% + ${String(OPTION_GAP_PX)}px)) 0`,
        }}
      />
      {links.map((link) => (
        <Link
          key={link.preset}
          href={link.href}
          aria-current={link.preset === current ? 'page' : undefined}
          onClick={() => {
            setChoice({ preset: link.preset, madeOn: current });
          }}
          className={`${OPTION} ${link.preset === shown ? 'text-card' : SEGMENTED_IDLE}`}
        >
          {link.label}
          <PendingMark />
        </Link>
      ))}
    </nav>
  );
}
