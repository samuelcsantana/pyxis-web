'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { CONTROL_TRANSITION, NAV_FOCUS_RING } from '@/components/ui/control-classes';

export interface ConversationPlayerProps {
  readonly tools: readonly string[];
  readonly answer: string;
  readonly replay: string;
  readonly header: ReactNode;
  readonly question: ReactNode;
  readonly used: ReactNode;
  readonly claude: ReactNode;
  readonly footer: ReactNode;
}

export type ToolState = 'waiting' | 'reading' | 'read';

export interface DemoFrame {
  readonly questionShown: boolean;
  readonly toolsShown: boolean;
  readonly tools: readonly { readonly name: string; readonly state: ToolState }[];
  readonly answerShown: boolean;
  readonly wordsShown: number;
  readonly finished: boolean;
}

export const QUESTION_AT_MS = 250;
export const TOOLS_AT_MS = 950;
export const FIRST_TOOL_AT_MS = 1_150;
export const TOOL_GAP_MS = 550;
export const TOOL_READ_MS = 480;
export const WORD_MS = 45;
export const FRAME_MS = 40;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const NUMBER = /(\d+(?:[.,]\d+)?\s?%)/;
const REPLAY_ICON = 'M20 11a8 8 0 1 0-2.3 5.7 M20 5v6h-6';
const CHECK = '✓';

export function answerStartsAt(toolCount: number): number {
  return FIRST_TOOL_AT_MS + toolCount * TOOL_GAP_MS + 250;
}

export function demoEndsAt(toolCount: number, wordCount: number): number {
  return answerStartsAt(toolCount) + wordCount * WORD_MS;
}

function toolStateAt(elapsed: number, index: number): ToolState {
  const startsAt = FIRST_TOOL_AT_MS + index * TOOL_GAP_MS;
  if (elapsed < startsAt) {
    return 'waiting';
  }
  return elapsed < startsAt + TOOL_READ_MS ? 'reading' : 'read';
}

export function demoFrame(
  elapsed: number,
  toolNames: readonly string[],
  wordCount: number,
): DemoFrame {
  const toolCount = toolNames.length;
  const answerAt = answerStartsAt(toolCount);
  const tools = toolNames.map((name, index) => ({ name, state: toolStateAt(elapsed, index) }));
  return {
    questionShown: elapsed >= QUESTION_AT_MS,
    toolsShown: elapsed >= TOOLS_AT_MS,
    tools,
    answerShown: elapsed >= answerAt,
    wordsShown: Math.max(0, Math.min(wordCount, Math.floor((elapsed - answerAt) / WORD_MS) + 1)),
    finished: elapsed >= demoEndsAt(toolCount, wordCount),
  };
}

export function withNumbersHighlighted(text: string): readonly ReactNode[] {
  return text.split(NUMBER).map((part, index) =>
    index % 2 === 1 ? (
      <span
        key={`${String(index)}-${part}`}
        className="rounded-control border border-accent/25 bg-accent/12 px-1.5 font-bold text-accent"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const SHOWN = 'translate-y-0 opacity-100';
const HIDDEN = 'translate-y-2.5 opacity-0';
const STEP = 'transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none';

function ToolChip({ name, state }: { readonly name: string; readonly state: ToolState }) {
  const look = {
    waiting: 'scale-90 border-nav-line opacity-0',
    reading: 'landing-demo-scan scale-100 border-sky text-nav-text opacity-100',
    read: 'scale-100 border-accent/55 bg-accent/8 text-nav-strong opacity-100',
  }[state];
  return (
    <code
      className={`relative inline-flex max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-control border bg-nav-raised px-2.5 py-1 font-mono text-micro break-all transition-[opacity,scale,border-color] duration-300 motion-reduce:transition-none ${look}`}
    >
      <span aria-hidden="true" className="grid size-3 place-items-center">
        {state === 'reading' ? (
          <span className="landing-demo-spinner size-2.5 rounded-pill" />
        ) : null}
        {state === 'read' ? <span className="font-bold text-accent">{CHECK}</span> : null}
      </span>
      {name}
    </code>
  );
}

export function ConversationPlayer({
  tools,
  answer,
  replay,
  header,
  question,
  used,
  claude,
  footer,
}: ConversationPlayerProps) {
  const words = answer.split(' ');
  const end = demoEndsAt(tools.length, words.length);
  const [elapsed, setElapsed] = useState(0);
  const [run, setRun] = useState(0);
  const [card, setCard] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (card === null) {
      return;
    }
    let timer = 0;
    const play = () => {
      if (window.matchMedia(REDUCED_MOTION).matches) {
        setElapsed(end);
        return;
      }
      const startedAt = performance.now();
      setElapsed(0);
      timer = window.setInterval(() => {
        const now = performance.now() - startedAt;
        setElapsed(Math.min(now, end));
        if (now >= end) {
          window.clearInterval(timer);
        }
      }, FRAME_MS);
    };
    if (typeof IntersectionObserver === 'undefined' || run > 0) {
      play();
      return () => {
        window.clearInterval(timer);
      };
    }
    const watcher = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          watcher.disconnect();
          play();
        }
      },
      { threshold: 0.35 },
    );
    watcher.observe(card);
    return () => {
      watcher.disconnect();
      window.clearInterval(timer);
    };
  }, [card, run, end]);

  const frame = demoFrame(elapsed, tools, words.length);
  const typed = words.slice(0, frame.wordsShown).join(' ');

  return (
    <figure
      ref={setCard}
      aria-labelledby="ask-claude-example"
      className="flex flex-col overflow-hidden rounded-panel border border-nav-border bg-nav text-nav-strong shadow-raised"
    >
      <div className="flex flex-wrap items-center gap-2.5 border-b border-nav-line bg-nav-raised px-4 py-3 sm:px-5">
        {header}
        <button
          type="button"
          onClick={() => {
            setRun((count) => count + 1);
          }}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-control border border-nav-line bg-nav px-2.5 py-1 text-micro font-medium text-nav-text hover:bg-nav-hover hover:text-nav-strong ${NAV_FOCUS_RING} ${CONTROL_TRANSITION}`}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={REPLAY_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {replay}
        </button>
      </div>
      <ol className="flex min-h-80 flex-col gap-4 px-4 py-5 sm:px-6">
        <li className={`${STEP} ${frame.questionShown ? SHOWN : HIDDEN}`}>{question}</li>
        <li
          className={`flex flex-wrap items-center gap-2 rounded-card border border-dashed border-nav-line bg-nav/60 px-3.5 py-2.5 ${STEP} ${frame.toolsShown ? SHOWN : HIDDEN}`}
        >
          {used}
          {frame.tools.map((tool) => (
            <ToolChip key={tool.name} name={tool.name} state={tool.state} />
          ))}
        </li>
        <li className={`${STEP} ${frame.answerShown ? SHOWN : HIDDEN}`}>
          {claude}
          <p
            aria-hidden="true"
            className="rounded-card border border-accent/28 bg-nav-raised px-4 py-3.5 text-sm leading-relaxed text-nav-text shadow-raised"
          >
            {withNumbersHighlighted(typed)}
            {frame.finished ? null : (
              <span className="landing-demo-cursor ml-0.5 inline-block h-3.5 w-1.5 bg-accent align-middle" />
            )}
          </p>
          <p className="sr-only">{answer}</p>
        </li>
      </ol>
      {footer}
    </figure>
  );
}
