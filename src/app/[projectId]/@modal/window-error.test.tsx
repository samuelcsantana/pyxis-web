import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import WindowError from './error';

describe('WindowError', () => {
  it('keeps the window named Settings and offers to try again when a part fails to load', async () => {
    const retry = vi.fn();

    renderWithMessages(<WindowError error={new Error('boom')} retry={retry} />);

    const title = screen.getByRole('heading', { name: 'Settings' });
    expect(title).toHaveAttribute('id', 'settings-window-title');
    expect(title).toHaveClass('sr-only');
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
