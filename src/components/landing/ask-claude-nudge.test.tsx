import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import type { DeviceStore } from '@/lib/device-theme';
import { NUDGE_DISMISSED_KEY } from '@/lib/nudge-dismissal';
import {
  AskClaudeNudge,
  type AskClaudeNudgeLabels,
  NUDGE_REVEAL_AFTER_SCROLL_PX,
} from './ask-claude-nudge';

const LABELS: AskClaudeNudgeLabels = {
  label: 'News: Pyxis in Claude',
  message: 'Pyxis now answers in Claude. Ask about your numbers.',
  cta: 'See how to connect',
  dismiss: 'Dismiss',
};

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

function scrollTo(y: number, event: 'scroll' | 'resize' = 'scroll'): void {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  act(() => {
    if (event === 'scroll') {
      fireEvent.scroll(window);
    } else {
      fireEvent(window, new Event('resize'));
    }
  });
}

function sectionAt(top: number, bottom: number): HTMLElement {
  const section = document.createElement('section');
  section.id = 'ask-claude';
  section.getBoundingClientRect = () => ({ top, bottom }) as DOMRect;
  document.body.append(section);
  return section;
}

function nudge(): HTMLElement {
  return screen.getByRole('complementary', { name: 'News: Pyxis in Claude' });
}

describe('AskClaudeNudge', () => {
  afterEach(() => {
    document.getElementById('ask-claude')?.remove();
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('stays out of sight on the first screen', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} />);

    expect(nudge()).toHaveClass('invisible');
    expect(nudge()).toHaveTextContent('Pyxis now answers in Claude.');
  });

  it('floats in once the visitor scrolls past the first screen', () => {
    const { store } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} />);

    scrollTo(NUDGE_REVEAL_AFTER_SCROLL_PX);

    expect(nudge()).not.toHaveClass('invisible');
  });

  it('steps aside while the Ask Claude section is on screen, and comes back past it', () => {
    const { store } = memoryStore();
    const section = sectionAt(2_000, 2_800);
    render(<AskClaudeNudge labels={LABELS} store={store} revealAfterScroll={100} />);

    scrollTo(200);
    expect(nudge()).not.toHaveClass('invisible');

    section.getBoundingClientRect = () => ({ top: 100, bottom: 900 }) as DOMRect;
    scrollTo(1_900, 'resize');
    expect(nudge()).toHaveClass('invisible');

    section.getBoundingClientRect = () => ({ top: -900, bottom: -100 }) as DOMRect;
    scrollTo(2_900);
    expect(nudge()).not.toHaveClass('invisible');
  });

  it('leads to the section, counting where the click came from, and does not come back', () => {
    const { store, items } = memoryStore();
    render(<AskClaudeNudge labels={LABELS} store={store} />);

    const cta = screen.getByRole('link', { name: 'See how to connect' });
    expect(cta).toHaveAttribute('href', '#ask-claude');
    expect(cta).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(cta).toHaveAttribute('data-track-from', 'mascot');
    fireEvent.click(cta);

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(items.get(NUDGE_DISMISSED_KEY)).toBe('dismissed');
  });

  it('closes for good on this device when dismissed', () => {
    const { store } = memoryStore();
    const first = render(<AskClaudeNudge labels={LABELS} store={store} />);

    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveAttribute('data-track', 'nudge_dismissed');
    fireEvent.click(close);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    first.unmount();

    render(<AskClaudeNudge labels={LABELS} store={store} />);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('renders nothing on the server, so a dismissed nudge never flashes', () => {
    expect(renderToString(<AskClaudeNudge labels={LABELS} />)).toBe('');
  });
});
