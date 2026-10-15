import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountSuspendedPage, { generateMetadata } from './page';

describe('AccountSuspendedPage', () => {
  it('says the account is suspended in its one heading and points to Account and billing', async () => {
    render(await AccountSuspendedPage());

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'This account is suspended',
    );
    expect(screen.getByText(/its screens stay closed/)).toBeInTheDocument();
    expect(screen.getByText(/finds the reason, and how to contest it/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Account and billing' })).toHaveAttribute(
      'href',
      '/account',
    );
  });

  it('names itself in the title', async () => {
    expect((await generateMetadata()).title).toBe('This account is suspended');
  });
});
