import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import { PendingSubmitButton } from './pending-submit-button';

function neverSettles(): Promise<void> {
  return new Promise(() => undefined);
}

describe('PendingSubmitButton', () => {
  it('submits under its label, keeps its own attributes and is not busy at rest', () => {
    render(
      <form>
        <PendingSubmitButton
          label="Apply filters"
          pendingLabel="Applying…"
          className="px-4"
          disabled
          aria-describedby="hint"
        />
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Apply filters' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-describedby', 'hint');
    expect(button).toHaveClass('px-4');
    expect(button).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('Applying…')).toHaveClass('invisible');
  });

  it('says it is working and keeps the content busy while its form is pending', async () => {
    render(
      <NavigationPendingProvider>
        <NavigationRegion className="flex">
          <form action={neverSettles}>
            <PendingSubmitButton label="Search" pendingLabel="Searching…" className="px-4" />
          </form>
        </NavigationRegion>
      </NavigationPendingProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    const button = await screen.findByRole('button', { name: 'Searching…' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Search')).toHaveClass('invisible');
    expect(button.closest('form')?.parentElement).toHaveAttribute('aria-busy', 'true');
  });
});
