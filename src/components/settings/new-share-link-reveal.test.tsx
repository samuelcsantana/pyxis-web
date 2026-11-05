import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { NewShareLinkReveal } from './new-share-link-reveal';

const TOKEN = `pyxis_sh_${'Q'.repeat(32)}`;

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('NewShareLinkReveal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.getSelection()?.removeAllRanges();
  });

  it('shows the address of the public page on this dashboard, once', () => {
    renderWithMessages(<NewShareLinkReveal token={TOKEN} onDone={() => undefined} />);

    expect(screen.getByRole('group', { name: 'Copy the link now' })).toHaveTextContent(
      `${window.location.origin}/share/${TOKEN}`,
    );
    expect(screen.getByRole('heading', { name: 'Copy the link now' })).toHaveFocus();
  });

  it('selects the address when the browser refuses the clipboard', async () => {
    stubClipboard(() => Promise.reject(new Error('denied')));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithMessages(<NewShareLinkReveal token={TOKEN} onDone={() => undefined} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Selected, press Ctrl+C' })).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(`${window.location.origin}/share/${TOKEN}`);
  });
});
