import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { NewSecretKeyReveal } from './new-secret-key-reveal';

const SECRET = `pyxis_sk_${'S'.repeat(32)}`;

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('NewSecretKeyReveal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.getSelection()?.removeAllRanges();
  });

  it('shows the secret key once, says where it belongs, and copies it', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    renderWithMessages(<NewSecretKeyReveal secretKey={SECRET} onDone={() => undefined} />);

    const reveal = screen.getByRole('group', { name: 'Copy the secret key now' });
    expect(reveal).toHaveTextContent(SECRET);
    expect(reveal).toHaveTextContent("Keep it in your backend's environment, never in a page.");
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(SECRET);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('selects the key when the browser refuses the clipboard, naming what it was', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new DOMException('Denied', 'NotAllowedError')));
    renderWithMessages(<NewSecretKeyReveal secretKey={SECRET} onDone={() => undefined} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Selected, press Ctrl+C' })).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(SECRET);
    expect(warn).toHaveBeenCalledWith(
      'secret key: could not copy it, selecting it instead',
      expect.any(DOMException),
    );
  });
});
