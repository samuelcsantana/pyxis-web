import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

function chooseNothing(): Promise<void> {
  return Promise.resolve();
}

describe('LanguageSwitcher', () => {
  it('names the language in use on a compact button that opens the languages', async () => {
    render(
      <LanguageSwitcher
        locale="en"
        label="Language"
        summary="Language: English"
        choose={chooseNothing}
      />,
    );
    const summary = screen.getByText('Language: English').closest('summary');
    const details = summary?.closest('details');

    expect(details).not.toHaveAttribute('open');

    await userEvent.click(screen.getByText('Language: English'));

    expect(details).toHaveAttribute('open');
    expect(screen.getByRole('group', { name: 'Language' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
  });
});
