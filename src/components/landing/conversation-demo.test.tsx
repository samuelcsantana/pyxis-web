import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  answerStartsAt,
  demoEndsAt,
  demoFrame,
  FIRST_TOOL_AT_MS,
  FRAME_MS,
  QUESTION_AT_MS,
  TOOL_READ_MS,
  TOOLS_AT_MS,
  withNumbersHighlighted,
} from './conversation-demo';
import { ConversationDemo, type ConversationDemoLabels } from './conversation-demo-card';

const TOOLS = ['overview', 'funnel', 'funnel_segments'] as const;

const LABELS: ConversationDemoLabels = {
  label: 'An example conversation',
  connected: 'MCP connected',
  replay: 'Replay',
  you: 'You',
  claude: 'Claude',
  question: 'How did last week go?',
  used: 'Claude read:',
  answer: 'Visits rose 12% and conversions 8%.',
  invented: 'Invented conversation and numbers, like the live demo.',
};

const WORDS = LABELS.answer.split(' ').length;
const END = demoEndsAt(TOOLS.length, WORDS);

type Watch = (entries: readonly { readonly isIntersecting: boolean }[]) => void;

function watchTheViewport(): { readonly enter: () => void; readonly stopped: () => boolean } {
  let callback: Watch = () => undefined;
  let disconnected = false;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(watch: Watch) {
        callback = watch;
      }
      observe(): void {
        return undefined;
      }
      disconnect(): void {
        disconnected = true;
      }
    },
  );
  return {
    enter: () => {
      act(() => {
        callback([{ isIntersecting: false }]);
        callback([{ isIntersecting: true }]);
      });
    },
    stopped: () => disconnected,
  };
}

function wait(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function answerBubble(): HTMLElement {
  return screen.getByText(
    (_, element) => element?.getAttribute('aria-hidden') === 'true' && element.tagName === 'P',
  );
}

describe('demoFrame', () => {
  it('shows nothing at first, then the question, then the tools row', () => {
    expect(demoFrame(0, TOOLS, WORDS)).toMatchObject({
      questionShown: false,
      toolsShown: false,
      answerShown: false,
      wordsShown: 0,
      finished: false,
    });
    expect(demoFrame(QUESTION_AT_MS, TOOLS, WORDS).questionShown).toBe(true);
    expect(demoFrame(TOOLS_AT_MS, TOOLS, WORDS).toolsShown).toBe(true);
  });

  it('reads the tools one after another, each waiting, then reading, then read', () => {
    const states = (elapsed: number) =>
      demoFrame(elapsed, TOOLS, WORDS).tools.map((tool) => tool.state);

    expect(states(FIRST_TOOL_AT_MS - 1)).toEqual(['waiting', 'waiting', 'waiting']);
    expect(states(FIRST_TOOL_AT_MS)).toEqual(['reading', 'waiting', 'waiting']);
    expect(states(FIRST_TOOL_AT_MS + TOOL_READ_MS)).toEqual(['read', 'waiting', 'waiting']);
    expect(states(answerStartsAt(TOOLS.length))).toEqual(['read', 'read', 'read']);
  });

  it('types the answer word by word and then finishes', () => {
    const answerAt = answerStartsAt(TOOLS.length);

    expect(demoFrame(answerAt, TOOLS, WORDS)).toMatchObject({ answerShown: true, wordsShown: 1 });
    expect(demoFrame(END, TOOLS, WORDS)).toMatchObject({ wordsShown: WORDS, finished: true });
  });
});

describe('withNumbersHighlighted', () => {
  it('marks every percentage, in either decimal style, and leaves the rest as text', () => {
    render(
      <p data-testid="text">{withNumbersHighlighted('Up 12% and 2,5 % or 3.5%, then words')}</p>,
    );

    const marked = [...screen.getByTestId('text').querySelectorAll('span')].map(
      (span) => span.textContent,
    );
    expect(marked).toEqual(['12%', '2,5 %', '3.5%']);
    expect(screen.getByTestId('text')).toHaveTextContent('Up 12% and 2,5 % or 3.5%, then words');
  });
});

describe('ConversationDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('waits until it is on screen, then plays the conversation to the end', () => {
    const viewport = watchTheViewport();
    render(<ConversationDemo labels={LABELS} tools={TOOLS} />);

    wait(END);
    expect(answerBubble()).toHaveTextContent('');

    viewport.enter();
    expect(viewport.stopped()).toBe(true);
    wait(FIRST_TOOL_AT_MS + FRAME_MS);
    expect(screen.getByText('overview')).toHaveClass('landing-demo-scan');
    expect(screen.getByText('funnel')).not.toHaveClass('landing-demo-scan');

    wait(END + FRAME_MS);

    expect(answerBubble()).toHaveTextContent('Visits rose 12% and conversions 8%.');
    expect(answerBubble().querySelectorAll('span')).toHaveLength(2);
    expect(screen.getAllByText('✓')).toHaveLength(TOOLS.length);
  });

  it('reads the whole answer to screen readers and offers to replay, with no close button', () => {
    watchTheViewport();
    render(<ConversationDemo labels={LABELS} tools={TOOLS} />);

    const example = screen.getByRole('figure', { name: 'An example conversation' });
    expect(within(example).getByText(LABELS.answer, { selector: '.sr-only' })).toBeInTheDocument();
    expect(
      within(example)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Replay']);
    expect(example).toHaveTextContent('Model Context Protocol');
  });

  it('starts over when Replay is pressed', () => {
    const viewport = watchTheViewport();
    render(<ConversationDemo labels={LABELS} tools={TOOLS} />);
    viewport.enter();
    wait(END + FRAME_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Replay' }));
    wait(FRAME_MS);
    expect(answerBubble()).toHaveTextContent('');

    wait(END + FRAME_MS);
    expect(answerBubble()).toHaveTextContent(LABELS.answer);
  });

  it('plays at once where the browser cannot tell what is on screen', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { unmount } = render(<ConversationDemo labels={LABELS} tools={TOOLS} />);

    wait(END + FRAME_MS);
    expect(answerBubble()).toHaveTextContent(LABELS.answer);
    unmount();
  });

  it('shows the finished conversation straight away to whoever prefers less motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList,
    );
    const viewport = watchTheViewport();
    render(<ConversationDemo labels={LABELS} tools={TOOLS} />);
    viewport.enter();

    expect(answerBubble()).toHaveTextContent(LABELS.answer);
  });
});
