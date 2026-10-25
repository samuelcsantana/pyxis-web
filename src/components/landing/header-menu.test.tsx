import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HeaderMenu } from './header-menu';

function renderMenu() {
  const view = render(
    <HeaderMenu label="Menu" className="hidden md:block">
      <ul aria-label="Sections">
        <li>
          <a href="#pricing">Pricing</a>
        </li>
      </ul>
    </HeaderMenu>,
  );
  const details = view.container.querySelector('details');
  if (details === null) {
    throw new Error('the menu renders no disclosure');
  }
  return details;
}

describe('HeaderMenu', () => {
  it('folds the links behind a button named only for screen readers', () => {
    const details = renderMenu();

    expect(details).not.toHaveAttribute('open');
    expect(details).toHaveClass('hidden', 'md:block');
    expect(screen.getByText('Menu')).toHaveClass('sr-only');
    expect(
      [...details.querySelectorAll('summary svg')].map((icon) => icon.getAttribute('aria-hidden')),
    ).toEqual(['true', 'true']);
  });

  it('opens from its button and closes once a link is chosen', async () => {
    const details = renderMenu();

    await userEvent.click(screen.getByText('Menu'));
    expect(details).toHaveAttribute('open');

    await userEvent.click(screen.getByRole('link', { name: 'Pricing' }));
    expect(details).not.toHaveAttribute('open');
  });

  it('stays open when the space around the links is clicked', () => {
    const details = renderMenu();
    details.open = true;

    fireEvent.click(screen.getByRole('list', { name: 'Sections' }));

    expect(details).toHaveAttribute('open');
  });
});
