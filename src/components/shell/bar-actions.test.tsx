import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderInProject, TEST_PROJECT, withProjectChoices } from '@/test-utils/project-choices';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { BarActions, LINK_COPIED_SHOWN_MS } from './bar-actions';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('range=7d&country=BR&kind=reads'),
}));

const writeText = vi.fn<(text: string) => Promise<void>>();

function useClipboard(clipboard: unknown) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
}

async function copy() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  writeText.mockReset();
  useClipboard({ writeText });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('BarActions copy link', () => {
  it('copies the address of the view and says so for a few seconds', async () => {
    writeText.mockResolvedValue(undefined);
    renderInProject(<BarActions projectId="p1" />);

    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveAttribute(
      'title',
      'Copy the address of this view, with its period and filters',
    );
    await copy();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText('Link copied')).toHaveAttribute('aria-live', 'polite');
    act(() => {
      vi.advanceTimersByTime(LINK_COPIED_SHOWN_MS);
    });
    expect(screen.queryByText('Link copied')).not.toBeInTheDocument();
  });

  it('shows the address selected when the browser refuses to copy, until Escape', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    renderInProject(<BarActions projectId="p1" />);

    await copy();

    const link = screen.getByRole('textbox', { name: 'Copy link' });
    expect(link).toHaveValue(window.location.href);
    expect(link).toHaveFocus();
    expect(link).toHaveProperty('selectionEnd', window.location.href.length);
    fireEvent.keyDown(link, { key: 'Enter' });
    expect(link).toBeInTheDocument();
    fireEvent.keyDown(link, { key: 'Escape' });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveFocus();
  });

  it('shows the address too where there is no clipboard, and hides it when the focus leaves', async () => {
    useClipboard(undefined);
    renderInProject(<BarActions projectId="p1" />);

    await copy();
    const link = screen.getByRole('textbox', { name: 'Copy link' });
    fireEvent.blur(link);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

describe('BarActions export', () => {
  it("opens the window's Export events part for the owner, keeping the view", () => {
    renderWithMessages(withProjectChoices(<BarActions projectId="p1" />, TEST_PROJECT, true));

    const exportLink = screen.getByRole('link', { name: 'Export' });
    expect(exportLink).toHaveAttribute('href', '/p1/settings/export?range=7d&country=BR');
    expect(exportLink).toHaveAttribute('title', "Export the project's events");
  });

  it('is left out for a member, who has no Export events part', () => {
    renderInProject(<BarActions projectId="p1" />);

    expect(screen.queryByRole('link', { name: 'Export' })).not.toBeInTheDocument();
  });
});
