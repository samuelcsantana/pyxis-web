import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY_STATE_MS, CopyCodeButton } from './copy-code-button';

const LABELS = { copy: 'Copy', copied: 'Copied', selected: 'Selected, press Ctrl+C' };

function renderButton(targetId = 'code') {
  return render(
    <>
      <pre id="code">npm install pyxis-analytics</pre>
      <CopyCodeButton code="npm install pyxis-analytics" targetId={targetId} labels={LABELS} />
    </>,
  );
}

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('CopyCodeButton', () => {
  afterEach(() => {
    vi.useRealTimers();
    window.getSelection()?.removeAllRanges();
  });

  it('copies the code, says so, then offers to copy again', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('npm install pyxis-analytics');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(COPY_STATE_MS);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('selects the code for the visitor when the browser refuses the clipboard', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new DOMException('Denied', 'NotAllowedError')));
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(
      await screen.findByRole('button', { name: 'Selected, press Ctrl+C' }),
    ).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe('npm install pyxis-analytics');
    expect(warn).toHaveBeenCalledWith(
      'install: could not copy the code, selecting it instead',
      expect.any(DOMException),
    );
  });

  it('still answers when the page offers no selection', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new Error('no clipboard')));
    vi.spyOn(window, 'getSelection').mockReturnValue(null);
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(
      await screen.findByRole('button', { name: 'Selected, press Ctrl+C' }),
    ).toBeInTheDocument();
  });

  it('sits in the corner of its code block unless asked to sit beside the code', () => {
    const { unmount } = renderButton();
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveClass('absolute');
    unmount();

    render(<CopyCodeButton code="hello" targetId="code" labels={LABELS} placement="inline" />);

    expect(screen.getByRole('button', { name: 'Copy' })).not.toHaveClass('absolute');
  });

  it('selects nothing when the code it names is not on the page', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new Error('no clipboard')));
    renderButton('missing');

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(
      await screen.findByRole('button', { name: 'Selected, press Ctrl+C' }),
    ).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe('');
  });
});
