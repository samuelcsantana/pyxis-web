import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CODE_COPIED_EVENT, COPY_STATE_MS, CopyCodeButton } from './copy-code-button';

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

  it('tells the page which code it copied', async () => {
    stubClipboard(() => Promise.resolve());
    const heard = vi.fn();
    const listen = (event: Event) => {
      heard(event instanceof CustomEvent ? event.detail : null);
    };
    window.addEventListener(CODE_COPIED_EVENT, listen);
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    window.removeEventListener(CODE_COPIED_EVENT, listen);
    expect(heard).toHaveBeenCalledExactlyOnceWith('code');
  });

  it('tells the page nothing when it could only select the code', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new Error('no clipboard')));
    const heard = vi.fn();
    window.addEventListener(CODE_COPIED_EVENT, heard);
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(
      await screen.findByRole('button', { name: 'Selected, press Ctrl+C' }),
    ).toBeInTheDocument();
    window.removeEventListener(CODE_COPIED_EVENT, heard);
    expect(heard).not.toHaveBeenCalled();
  });

  it('stands out with a copy icon when asked to look prominent, and stays quiet otherwise', () => {
    const { unmount } = renderButton();
    const quiet = screen.getByRole('button', { name: 'Copy' });
    expect(quiet).toHaveClass('bg-nav-raised');
    expect(quiet.querySelector('svg')).toBeNull();
    unmount();

    render(
      <CopyCodeButton
        code="hello"
        targetId="code"
        labels={LABELS}
        placement="inline"
        appearance="prominent"
      />,
    );

    const prominent = screen.getByRole('button', { name: 'Copy' });
    expect(prominent).toHaveClass('landing-copy-prominent');
    expect(prominent).not.toHaveClass('bg-nav-raised', 'absolute');
    expect(prominent.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
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
