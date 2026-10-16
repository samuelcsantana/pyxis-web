'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { DeviceStore } from '@/lib/device-theme';
import {
  bestEffortReadNudgeDismissed,
  bestEffortRememberNudgeDismissed,
} from '@/lib/nudge-dismissal';
import { ASK_CLAUDE_ID } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { NudgeRobot } from './nudge-robot';

export interface AskClaudeNudgeLabels {
  readonly label: string;
  readonly badge: string;
  readonly title: string;
  readonly tips: readonly string[];
  readonly another: string;
  readonly cta: string;
  readonly dismiss: string;
}

export interface AskClaudeNudgeProps {
  readonly labels: AskClaudeNudgeLabels;
  readonly store?: () => DeviceStore;
  readonly arriveAfterMs?: number;
}

type Phase = 'waiting' | 'here' | 'leaving' | 'gone';

export const NUDGE_ARRIVES_AFTER_MS = 1_200;
export const NUDGE_TYPE_MS = 18;
export const NUDGE_LEAVE_MS = 1_150;
const PARTICLES = 8;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const CLOSE_ICON = 'M18 6 6 18 M6 6l12 12';

const noSubscription = () => () => undefined;
const hiddenOnTheServer = () => true;

const reducedMotion = (): boolean => window.matchMedia(REDUCED_MOTION).matches;

export function AskClaudeNudge({
  labels,
  store,
  arriveAfterMs = NUDGE_ARRIVES_AFTER_MS,
}: AskClaudeNudgeProps) {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [tip, setTip] = useState(0);
  const [typed, setTyped] = useState(0);
  const remembered = useSyncExternalStore(
    noSubscription,
    () => bestEffortReadNudgeDismissed(store),
    hiddenOnTheServer,
  );
  const shownTip = tip % labels.tips.length;
  const text = labels.tips.filter((_, index) => index === shownTip).join('');

  useEffect(() => {
    if (remembered) {
      return;
    }
    const arrival = window.setTimeout(() => {
      setPhase('here');
    }, arriveAfterMs);
    return () => {
      window.clearTimeout(arrival);
    };
  }, [remembered, arriveAfterMs]);

  useEffect(() => {
    if (phase !== 'here') {
      return;
    }
    const step = reducedMotion() ? text.length : 1;
    const typing = window.setInterval(() => {
      setTyped((count) => {
        const next = Math.min(text.length, count + step);
        if (next === text.length) {
          window.clearInterval(typing);
        }
        return next;
      });
    }, NUDGE_TYPE_MS);
    return () => {
      window.clearInterval(typing);
    };
  }, [phase, text]);

  useEffect(() => {
    if (phase !== 'leaving') {
      return;
    }
    const departure = window.setTimeout(
      () => {
        setPhase('gone');
      },
      reducedMotion() ? 0 : NUDGE_LEAVE_MS,
    );
    return () => {
      window.clearTimeout(departure);
    };
  }, [phase]);

  if (phase === 'waiting' || phase === 'gone') {
    return null;
  }
  const nextTip = () => {
    setTyped(0);
    setTip((current) => current + 1);
  };
  const dismiss = () => {
    bestEffortRememberNudgeDismissed(store);
    setPhase('leaving');
  };
  return (
    <aside
      aria-label={labels.label}
      data-phase={phase}
      className="landing-nudge fixed right-3 bottom-16 z-30 flex items-center gap-1 sm:right-7 sm:bottom-6 sm:gap-3"
    >
      <div className="landing-nudge-bubble relative flex w-[min(18rem,calc(100vw-8.5rem))] flex-col gap-2 rounded-panel border border-accent/35 bg-nav/95 p-3.5 text-nav-strong shadow-raised backdrop-blur-md sm:w-72 sm:p-5">
        <button
          type="button"
          aria-label={labels.dismiss}
          onClick={dismiss}
          className={`absolute top-3 right-3 grid size-8 place-items-center rounded-control border border-nav-line bg-nav-raised text-nav-muted hover:border-bad hover:bg-bad/20 hover:text-nav-strong ${FOCUS_RING} ${CONTROL_TRANSITION}`}
          {...trackAttributes(LANDING_EVENTS.nudgeDismissed)}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={CLOSE_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </button>
        <p className="flex w-fit items-center gap-2 rounded-pill border border-nav-line bg-nav-raised px-2.5 py-1 font-mono text-micro font-semibold tracking-[0.06em] text-nav-text uppercase">
          <span aria-hidden="true" className="landing-nudge-dot size-2 rounded-pill bg-accent" />
          {labels.badge}
        </p>
        <p className="pr-8 text-base leading-tight font-bold tracking-[-0.01em] text-balance sm:text-lg">
          {labels.title}
        </p>
        <p aria-hidden="true" className="hidden text-sm leading-normal text-nav-text sm:block">
          <span>{text.slice(0, typed)}</span>
          <span className="invisible">{text.slice(typed)}</span>
        </p>
        <p aria-live="polite" className="sr-only">
          {text}
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <a
            href={`#${ASK_CLAUDE_ID}`}
            className={`landing-nudge-cta rounded-control text-sm font-semibold text-accent ${FOCUS_RING}`}
            {...trackAttributes(LANDING_EVENTS.askClaudeOpened, { from: 'mascot' })}
          >
            {labels.cta}
            <span aria-hidden="true">{' →'}</span>
          </a>
          <span aria-hidden="true" className="hidden gap-1 sm:flex">
            {labels.tips.map((each, index) => (
              <span
                key={each}
                className={`size-1.5 rounded-pill ${index === shownTip ? 'bg-accent' : 'bg-nav-line'}`}
              />
            ))}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={labels.another}
        title={labels.another}
        onClick={nextTip}
        className={`landing-robot relative flex shrink-0 flex-col items-center rounded-panel ${FOCUS_RING}`}
      >
        <span aria-hidden="true" className="landing-robot-ring" />
        {Array.from({ length: PARTICLES }, (_, index) => (
          <span key={index} aria-hidden="true" className="landing-robot-particle" />
        ))}
        <span key={tip} className={tip === 0 ? 'block' : 'landing-robot-cheer block'}>
          <NudgeRobot />
        </span>
        <span aria-hidden="true" className="landing-robot-shadow" />
      </button>
    </aside>
  );
}
