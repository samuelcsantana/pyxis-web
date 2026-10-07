import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DemoBanner } from './demo-banner';
import { EmptyState } from './empty-state';
import { ErrorPanel } from './error-panel';
import { installSnippet, NoActivityYet, PLACEHOLDER_ENDPOINT } from './no-activity-yet';

describe('EmptyState', () => {
  it('shows its title and explanation', () => {
    render(
      <EmptyState title="No projects yet">
        <p>Ask the operator to grant you one.</p>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByText('Ask the operator to grant you one.')).toBeInTheDocument();
  });

  it('heads a whole page when asked to', () => {
    render(
      <EmptyState headingLevel="h1" title="Page not found">
        <p>This page does not exist.</p>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
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

  it('promises nothing it cannot know about the events being collected', () => {
    render(<ErrorPanel />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The dashboard could not read this data. Try again in a moment.',
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(/still being collected/);
  });

  it('heads a section by default and a whole page when asked to', () => {
    const { unmount } = render(<ErrorPanel />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Could not load this data' }),
    ).toBeInTheDocument();
    unmount();

    render(<ErrorPanel headingLevel="h1" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
  });

  it('shows neither detail nor retry when it has none', () => {
    render(<ErrorPanel />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('alert').querySelectorAll('p')).toHaveLength(1);
  });
});

describe('DemoBanner', () => {
  it('says the numbers are invented and links to the source code', () => {
    render(<DemoBanner />);

    expect(screen.getByRole('note')).toHaveTextContent('Demo data');
    expect(screen.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-web',
    );
  });
});

describe('NoActivityYet', () => {
  it('shows the install snippet for the API the dashboard talks to', () => {
    render(<NoActivityYet endpoint="https://api.pyxis.example.org" />);

    expect(screen.getByText(/endpoint: 'https:\/\/api\.pyxis\.example\.org'/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "SDK's README" })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-sdk#readme',
    );
  });

  it('shows a placeholder endpoint in demo mode', () => {
    render(<NoActivityYet endpoint={undefined} />);

    expect(screen.getByText(/npm install pyxis-analytics/).textContent).toBe(
      installSnippet(PLACEHOLDER_ENDPOINT),
    );
  });
});
