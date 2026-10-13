import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COUNT_UP_MS, PreviewCountUp } from './preview-count-up';

function preferReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches: reduced && query.includes('reduce') })),
  );
}

function animateAs(playState: AnimationPlayState) {
  vi.spyOn(Element.prototype, 'getAnimations').mockReturnValue([{ playState } as Animation]);
}

function renderPreview(targetId = 'preview') {
  return render(
    <>
      <figure id="preview">
        <dd data-count>2,759</dd>
        <dd data-count>2.3%</dd>
        <dd>+5.1%</dd>
      </figure>
      <PreviewCountUp targetId={targetId} locale="en-US" />
    </>,
  );
}

describe('PreviewCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    preferReducedMotion(false);
    animateAs('running');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts the figures up from zero while the preview rises, ending on their exact text', () => {
    renderPreview();

    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(screen.getByText(/^\d[\d,]*$/).textContent).not.toBe('2,759');
    expect(screen.getByText('+5.1%')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(COUNT_UP_MS);
    });
    expect(screen.getByText('2,759')).toBeInTheDocument();
    expect(screen.getByText('2.3%')).toBeInTheDocument();
  });

  it('puts the exact figures back when it leaves before the count ends', () => {
    const { unmount } = renderPreview();
    act(() => {
      vi.advanceTimersByTime(100);
    });
    const figure = document.getElementById('preview');

    unmount();

    expect(figure?.textContent).toBe('2,7592.3%+5.1%');
  });

  it('leaves the figures still when the visitor asks for less motion', () => {
    preferReducedMotion(true);
    renderPreview();

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(screen.getByText('2,759')).toBeInTheDocument();
  });

  it('leaves the figures still once the preview has finished rising', () => {
    animateAs('finished');
    renderPreview();

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(screen.getByText('2,759')).toBeInTheDocument();
  });

  it('does nothing when the preview it names is not on the page', () => {
    renderPreview('missing');

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(screen.getByText('2,759')).toBeInTheDocument();
  });
});
