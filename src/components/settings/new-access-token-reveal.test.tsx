import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  AUTHORIZATION_EXAMPLE,
  COPY_STATE_MS,
  NewAccessTokenReveal,
  selectContents,
} from './new-access-token-reveal';

const TOKEN = `pyxis_at_${'Q'.repeat(32)}`;

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('NewAccessTokenReveal', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.getSelection()?.removeAllRanges();
  });

  it('shows the token once, says so, and moves focus to its heading', () => {
    renderWithMessages(<NewAccessTokenReveal token={TOKEN} onDone={() => undefined} />);

    const reveal = screen.getByRole('group', { name: 'Copy your new token now' });
    expect(reveal).toHaveTextContent(TOKEN);
    expect(reveal).toHaveTextContent('This is the only time it is shown.');
    expect(reveal).toHaveTextContent(AUTHORIZATION_EXAMPLE);
    expect(screen.getByRole('heading', { name: 'Copy your new token now' })).toHaveFocus();
  });

  it('copies the token, says so, then offers to copy again', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderWithMessages(<NewAccessTokenReveal token={TOKEN} onDone={() => undefined} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(TOKEN);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(COPY_STATE_MS);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('selects the token when the browser refuses the clipboard', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new DOMException('Denied', 'NotAllowedError')));
    renderWithMessages(<NewAccessTokenReveal token={TOKEN} onDone={() => undefined} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Selected, press Ctrl+C' })).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(TOKEN);
    expect(warn).toHaveBeenCalledWith(
      'access token: could not copy it, selecting it instead',
      expect.any(DOMException),
    );
  });

  it('hands control back when the admin is done', async () => {
    const onDone = vi.fn();
    renderWithMessages(<NewAccessTokenReveal token={TOKEN} onDone={onDone} />);

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onDone).toHaveBeenCalledOnce();
  });
});

describe('selectContents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('leaves the selection alone without an element', () => {
    const kept = document.createElement('p');
    kept.textContent = 'kept';
    document.body.append(kept);
    selectContents(kept);

    selectContents(null);

    expect(window.getSelection()?.toString()).toBe('kept');
    kept.remove();
  });

  it('selects nothing when the page offers no selection', () => {
    const element = document.createElement('code');
    vi.spyOn(window, 'getSelection').mockReturnValue(null);

    expect(() => {
      selectContents(element);
    }).not.toThrow();
  });
});
