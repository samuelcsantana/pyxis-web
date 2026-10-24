import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheerOnCopy } from './cheer-on-copy';
import { CODE_COPIED_EVENT } from './copy-code-button';

function renderRobot() {
  return render(
    <CheerOnCopy codeId="request">
      <svg data-testid="robot" />
    </CheerOnCopy>,
  );
}

function announce(event: Event) {
  act(() => {
    window.dispatchEvent(event);
  });
}

const copied = (codeId: string) => new CustomEvent(CODE_COPIED_EVENT, { detail: codeId });

const cheering = () => screen.getByTestId('robot').parentElement;

describe('CheerOnCopy', () => {
  it('stays still until the code it watches is copied', () => {
    renderRobot();

    expect(cheering()).not.toHaveClass('landing-robot-cheer');
  });

  it('cheers when the code it watches is copied, and starts over on every copy', () => {
    renderRobot();

    announce(copied('request'));
    const first = cheering();
    expect(first).toHaveClass('landing-robot-cheer');

    announce(copied('request'));
    expect(cheering()).toHaveClass('landing-robot-cheer');
    expect(cheering()).not.toBe(first);
  });

  it('ignores copies of other code and events that carry no code', () => {
    renderRobot();

    announce(copied('install-command'));
    announce(new Event(CODE_COPIED_EVENT));

    expect(cheering()).not.toHaveClass('landing-robot-cheer');
  });

  it('stops listening once it leaves the page', () => {
    const { unmount } = renderRobot();
    unmount();

    expect(() => {
      announce(copied('request'));
    }).not.toThrow();
  });
});
