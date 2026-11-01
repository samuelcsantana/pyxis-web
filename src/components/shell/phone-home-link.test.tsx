import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderInProject } from '@/test-utils/project-choices';
import { PhoneHomeLink } from './phone-home-link';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('from=2026-10-01&to=2026-10-10&device=mobile&tab=x'),
}));

describe('PhoneHomeLink', () => {
  it('links the logo to the overview of the project on phones, keeping the period and the filters', () => {
    renderInProject(<PhoneHomeLink />);

    const home = screen.getByRole('link', { name: 'Overview' });
    expect(home).toHaveAttribute(
      'href',
      '/p1/overview?from=2026-10-01&to=2026-10-10&device=mobile',
    );
    expect(home).toHaveClass('size-11', 'lg:hidden');
  });
});
