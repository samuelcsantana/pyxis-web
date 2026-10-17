import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DeviceStore } from '@/lib/device-theme';
import { NUDGE_DISMISSED_KEY } from '@/lib/nudge-dismissal';
import {
  AskClaudeNudge,
  type AskClaudeNudgeLabels,
  NUDGE_ARRIVES_AFTER_MS,
  NUDGE_LEAVE_MS,
  NUDGE_TYPE_MS,
  READING_BAND,
} from './ask-claude-nudge';

const LABELS: AskClaudeNudgeLabels = {
  label: 'News: Pyxis in Claude',
  badge: 'New',
  title: 'MCP access is here!',
  tips: ['Psst! Pyxis now answers right inside Claude.', 'Ask and Claude reads your numbers.'],
  another: 'Another tip',
  cta: 'See how to connect',
  dismiss: 'Dismiss',
};

const LONGEST_TIP_MS = 60 * NUDGE_TYPE_MS;
const PARTICLES = 8;

function memoryStore(): { readonly store: () => DeviceStore; readonly items: Map<string, string> } {
  const items = new Map<string, string>();
  const device: DeviceStore = {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
  return { store: () => device, items };
}

type Watch = (entries: readonly { readonly isIntersecting: boolean }[]) => void;

interface Viewport {
  readonly reach: () => void;
  readonly watched: () => readonly Element[];
  readonly band: () => string | undefined;
  readonly stopped: () => boolean;
}

function watchTheViewport(): Viewport {
  let callback: Watch = () => undefined;
  let rootMargin: string | undefined;
  const watched: Element[] = [];
  let disconnected = false;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(watch: Watch, options?: IntersectionObserverInit) {
        callback = watch;
        rootMargin = options?.rootMargin;
      }
      observe(target: Element): void {
        watched.push(target);
      }
      disconnect(): void {
        disconnected = true;
      }
    },
  );
  return {
    reach: () => {
      act(() => {
        callback([{ isIntersecting: false }]);
        callback([{ isIntersecting: true }]);
      });
    },
    watched: () => watched,
    band: () => rootMargin,
    stopped: () => disconnected,
  };
}

function askClaudeSection(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'ask-claude';
  document.body.append(section);
  return section;
}

function wait(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function preferReducedMotion(): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList,
  );
}

function bubbleText(): string {
  return (
    screen.getByRole('complementary').querySelector('p[aria-hidden="true"] span')?.textContent ?? ''
  );
}

describe('AskClaudeNudge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.getElementById('ask-claude')?.remove();
  });

  it('arrives on its own a moment after the page opens, with no scrolling', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} />);

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    wait(NUDGE_ARRIVES_AFTER_MS);

    expect(screen.getByRole('complementary', { name: 'News: Pyxis in Claude' })).toHaveAttribute(
      'data-phase',
      'here',
    );
  });

  it('wears a badge and a title over its tip, and a robot ready to blast off', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);

    const nudge = screen.getByRole('complementary');
    expect(nudge).toHaveTextContent('New');
    expect(nudge).toHaveTextContent('MCP access is here!');
    expect(nudge.querySelectorAll('.landing-robot-particle')).toHaveLength(PARTICLES);
    expect(nudge.querySelector('.landing-robot-ring')).not.toBeNull();
    expect(nudge.querySelector('svg.landing-robot-svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('types its first tip letter by letter, while a screen reader hears it whole', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);

    expect(bubbleText()).toBe('');
    expect(screen.getByText(LABELS.tips[0] ?? '', { selector: '.sr-only' })).toBeInTheDocument();
    wait(5 * NUDGE_TYPE_MS);
    expect(bubbleText()).toBe('Psst!');
    wait(LONGEST_TIP_MS);
    expect(bubbleText()).toBe(LABELS.tips[0]);
  });

  it('tells another tip each time the mascot is pressed, round and round', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);
    const mascot = screen.getByRole('button', { name: 'Another tip' });

    fireEvent.click(mascot);
    wait(LONGEST_TIP_MS);
    expect(bubbleText()).toBe(LABELS.tips[1]);
    expect(mascot.querySelector('.landing-robot-cheer')).not.toBeNull();

    fireEvent.click(mascot);
    wait(LONGEST_TIP_MS);
    expect(bubbleText()).toBe(LABELS.tips[0]);
  });

  it('shows each tip at once for whoever prefers less motion, and leaves at once', () => {
    preferReducedMotion();
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);
    wait(NUDGE_TYPE_MS);

    expect(bubbleText()).toBe(LABELS.tips[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    wait(0);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('leads to the Ask Claude section, counting where the click came from', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);

    const cta = screen.getByRole('link', { name: 'See how to connect' });
    expect(cta).toHaveAttribute('href', '#ask-claude');
    expect(cta).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(cta).toHaveAttribute('data-track-from', 'mascot');
  });

  it('flies off once the reader reaches the Ask Claude section, and stays away for the visit', () => {
    const viewport = watchTheViewport();
    const section = askClaudeSection();
    const { store, items } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);

    expect(viewport.watched()).toEqual([section]);
    expect(viewport.band()).toBe(READING_BAND);
    expect(READING_BAND).toBe('0px 0px -65% 0px');
    viewport.reach();

    expect(screen.getByRole('complementary')).toHaveAttribute('data-phase', 'leaving');
    expect(items.get(NUDGE_DISMISSED_KEY)).toBe('dismissed');
    expect(viewport.stopped()).toBe(true);
    wait(NUDGE_LEAVE_MS);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('never arrives on a page that opened on the Ask Claude section', () => {
    const viewport = watchTheViewport();
    askClaudeSection();
    const { store, items } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} />);

    viewport.reach();
    wait(NUDGE_ARRIVES_AFTER_MS);

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(items.get(NUDGE_DISMISSED_KEY)).toBe('dismissed');
  });

  it('never arrives there either where the browser cannot remember it', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const viewport = watchTheViewport();
    askClaudeSection();
    const forgetful: DeviceStore = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      },
    };
    render(<AskClaudeNudge labels={LABELS} store={() => forgetful} />);

    viewport.reach();
    wait(NUDGE_ARRIVES_AFTER_MS);

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('waits for a dismissal where the page has no such section, or cannot tell what is on screen', () => {
    const viewport = watchTheViewport();
    const { store } = memoryStore();
    const withoutSection = render(
      <AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />,
    );
    wait(0);
    expect(viewport.watched()).toEqual([]);
    withoutSection.unmount();

    vi.stubGlobal('IntersectionObserver', undefined);
    askClaudeSection();
    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(NUDGE_LEAVE_MS);

    expect(screen.getByRole('complementary')).toHaveAttribute('data-phase', 'here');
  });

  it('stops watching for the section when the page goes away', () => {
    const viewport = watchTheViewport();
    askClaudeSection();
    const { store } = memoryStore();
    const { unmount } = render(<AskClaudeNudge labels={LABELS} store={store} />);

    unmount();

    expect(viewport.stopped()).toBe(true);
  });

  it('flies off when dismissed, and stays away for the rest of the visit', () => {
    const { store, items } = memoryStore();
    const first = render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);

    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveAttribute('data-track', 'nudge_dismissed');
    fireEvent.click(close);
    expect(screen.getByRole('complementary')).toHaveAttribute('data-phase', 'leaving');
    expect(items.get(NUDGE_DISMISSED_KEY)).toBe('dismissed');
    wait(NUDGE_LEAVE_MS);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    first.unmount();

    render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(NUDGE_ARRIVES_AFTER_MS);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('stops its timers when the page goes away mid-way', () => {
    const { store } = memoryStore();
    const waiting = render(<AskClaudeNudge labels={LABELS} store={store} />);
    waiting.unmount();

    const leaving = render(<AskClaudeNudge labels={LABELS} store={store} arriveAfterMs={0} />);
    wait(0);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    leaving.unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('renders nothing on the server, so a dismissed nudge never flashes', () => {
    expect(renderToString(<AskClaudeNudge labels={LABELS} />)).toBe('');
  });
});
