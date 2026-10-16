'use client';

import { useState, useSyncExternalStore } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { DeviceStore } from '@/lib/device-theme';
import {
  bestEffortReadNudgeDismissed,
  bestEffortRememberNudgeDismissed,
} from '@/lib/nudge-dismissal';
import { ASK_CLAUDE_ID } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface AskClaudeNudgeLabels {
  readonly label: string;
  readonly message: string;
  readonly cta: string;
  readonly dismiss: string;
}

export interface AskClaudeNudgeProps {
  readonly labels: AskClaudeNudgeLabels;
  readonly store?: () => DeviceStore;
  readonly revealAfterScroll?: number;
}

export const NUDGE_REVEAL_AFTER_SCROLL_PX = 600;
const CLOSE_ICON = 'M18 6 6 18 M6 6l12 12';
const NUDGE_TRANSITION =
  'transition-[opacity,translate,visibility] duration-300 motion-reduce:transition-none';

const noSubscription = () => () => undefined;
const hiddenOnTheServer = () => true;
const awayOnTheServer = () => false;

function subscribeToViewport(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

export function awayFromTheSection(revealAfterScroll: number): boolean {
  if (window.scrollY < revealAfterScroll) {
    return false;
  }
  const section = document.getElementById(ASK_CLAUDE_ID);
  if (section === null) {
    return true;
  }
  const box = section.getBoundingClientRect();
  return box.bottom <= 0 || box.top >= window.innerHeight;
}

export function AskClaudeNudge({
  labels,
  store,
  revealAfterScroll = NUDGE_REVEAL_AFTER_SCROLL_PX,
}: AskClaudeNudgeProps) {
  const [dismissedNow, setDismissedNow] = useState(false);
  const remembered = useSyncExternalStore(
    noSubscription,
    () => bestEffortReadNudgeDismissed(store),
    hiddenOnTheServer,
  );
  const away = useSyncExternalStore(
    subscribeToViewport,
    () => awayFromTheSection(revealAfterScroll),
    awayOnTheServer,
  );
  if (remembered || dismissedNow) {
    return null;
  }
  const dismiss = () => {
    bestEffortRememberNudgeDismissed(store);
    setDismissedNow(true);
  };
  return (
    <aside
      aria-label={labels.label}
      className={`fixed right-4 bottom-18 z-30 flex w-[min(22rem,calc(100%-2rem))] items-start gap-3 rounded-panel border border-line-strong bg-card p-3.5 pr-2.5 text-ink shadow-raised sm:bottom-4 ${NUDGE_TRANSITION} ${away ? '' : 'invisible translate-y-3 opacity-0'}`}
    >
      <span
        aria-hidden="true"
        className="landing-nudge-mascot grid size-11 shrink-0 place-items-center rounded-pill bg-soft"
      >
        <LogoMark size={30} />
      </span>
      <div className="flex min-w-0 grow flex-col gap-1.5">
        <p className="text-sm leading-snug font-semibold text-pretty">{labels.message}</p>
        <a
          href={`#${ASK_CLAUDE_ID}`}
          onClick={dismiss}
          className={`self-start rounded-control text-sm font-semibold text-sky-ink underline-offset-4 hover:underline ${FOCUS_RING}`}
          {...trackAttributes(LANDING_EVENTS.askClaudeOpened, { from: 'mascot' })}
        >
          {labels.cta}
          <span aria-hidden="true">{' →'}</span>
        </a>
      </div>
      <button
        type="button"
        aria-label={labels.dismiss}
        onClick={dismiss}
        className={`grid size-8 shrink-0 place-items-center rounded-control text-muted hover:bg-soft hover:text-ink active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`}
        {...trackAttributes(LANDING_EVENTS.nudgeDismissed)}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={CLOSE_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  );
}
