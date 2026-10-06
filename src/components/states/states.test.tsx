import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DemoBanner } from './demo-banner';
import { EmptyState } from './empty-state';
import { ErrorPanel } from './error-panel';
import { LoadingPanel } from './loading-panel';

describe('EmptyState', () => {
  it('shows its title and explanation', () => {
    render(
      <EmptyState title="No projects yet">
        <p>Ask the operator to grant you one.</p>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByText('Ask the operator to grant you one.')).toBeInTheDocument();
  });
});

describe('ErrorPanel', () => {
  it('is announced, shows the request detail and retries on demand', async () => {
    const retry = vi.fn();
    render(<ErrorPanel detail="GET /v1/me · 503" onRetry={retry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load this data');
    expect(screen.getByText('GET /v1/me · 503')).toBeInTheDocument();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('shows neither detail nor retry when it has none', () => {
    render(<ErrorPanel />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('alert').querySelectorAll('p')).toHaveLength(1);
  });
});

describe('LoadingPanel', () => {
  it('marks itself busy under the label it is given', () => {
    render(<LoadingPanel label="Loading the project" />);

    expect(screen.getByRole('region', { name: 'Loading the project' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByText('Loading the project…')).toBeInTheDocument();
  });
});

describe('DemoBanner', () => {
  it('says the numbers are invented', () => {
    render(<DemoBanner />);

    expect(screen.getByRole('note')).toHaveTextContent('Demo data');
  });
});
