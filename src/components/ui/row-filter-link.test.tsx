import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RowFilterLink } from './row-filter-link';
import { VisitsLink } from './visits-link';

const IDLE = {
  href: '/p1/devices?os=ios',
  active: false,
  label: 'Filter by iOS',
  title: 'Filter every screen by iOS',
};

describe('RowFilterLink', () => {
  it('offers to filter by the value, and names what it does', () => {
    render(<RowFilterLink filter={IDLE} />);

    const link = screen.getByRole('link', { name: 'Filter by iOS' });
    expect(link).toHaveAttribute('href', '/p1/devices?os=ios');
    expect(link).toHaveAttribute('title', 'Filter every screen by iOS');
    expect(link.className).not.toContain('bg-ink');
  });

  it('shows a filled button that removes the filter when it is on', () => {
    render(
      <RowFilterLink
        filter={{ ...IDLE, active: true, label: 'Remove filter iOS', title: 'Remove filter iOS' }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Remove filter iOS' }).className).toContain('bg-ink');
  });
});

describe('VisitsLink with a filter', () => {
  it('puts the filter button right after the name, which still opens Visits', () => {
    render(
      <VisitsLink href="/p1/visits?os=ios" label="iOS" purpose=": see its visits" filter={IDLE} />,
    );

    expect(screen.getByRole('link', { name: 'iOS: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?os=ios',
    );
    expect(screen.getByRole('link', { name: 'Filter by iOS' })).toBeInTheDocument();
  });
});
