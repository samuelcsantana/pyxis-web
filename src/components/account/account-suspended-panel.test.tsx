import { fireEvent, render, screen } from '@testing-library/react';
import type { MouseEvent, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { AccountSuspendedPanel } from './account-suspended-panel';

vi.mock('next/link', () => ({
  default: ({
    href,
    className,
    children,
  }: {
    readonly href: string;
    readonly className?: string;
    readonly children: ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-next-link=""
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
      }}
    >
      {children}
    </a>
  ),
}));

function preventedClick(element: HTMLElement): boolean {
  let prevented = false;
  const settle = (event: Event) => {
    prevented = event.defaultPrevented;
    event.preventDefault();
  };
  window.addEventListener('click', settle);
  fireEvent.click(element);
  window.removeEventListener('click', settle);
  return prevented;
}

describe('AccountSuspendedPanel', () => {
  it('says the account is suspended in its one heading, and why the screens stay closed', () => {
    render(<AccountSuspendedPanel i18n={english} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'This account is suspended',
    );
    expect(screen.getByText(/its screens stay closed/)).toBeInTheDocument();
    expect(screen.getByText(/finds the reason, and how to contest it/)).toBeInTheDocument();
  });

  it('opens Account and billing with a full page load, never a soft navigation a window could intercept', () => {
    render(<AccountSuspendedPanel i18n={english} />);

    const link = screen.getByRole('link', { name: 'Open Account and billing' });
    expect(link).toHaveAttribute('href', '/account');
    expect(link).not.toHaveAttribute('data-next-link');
    expect(preventedClick(link)).toBe(false);
  });
});
