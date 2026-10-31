import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectMark } from './project-mark';

const PROJECT = {
  id: 'p-store',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
};

describe('ProjectMark', () => {
  it('draws the icon of the project site on a white tile when it has one', () => {
    const { container } = render(<ProjectMark project={{ ...PROJECT, iconVersion: 'abc' }} />);

    const icon = screen.getByTestId('project-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.style.backgroundImage).toBe('url("/p-store/icon?v=abc")');
    expect(icon).toHaveClass('size-6', 'bg-white', 'bg-contain');
    expect(container).not.toHaveTextContent('DS');
  });

  it('draws the icon it is given in place of the project one', () => {
    render(<ProjectMark project={PROJECT} iconHref="data:image/png;base64,AA==" />);

    expect(screen.getByTestId('project-icon').style.backgroundImage).toBe(
      'url("data:image/png;base64,AA==")',
    );
  });

  it('draws the initials of the project when it has no icon', () => {
    render(<ProjectMark project={PROJECT} />);

    expect(screen.getByText('DS')).toHaveClass('size-6', 'bg-nav-border');
    expect(screen.getByText('DS')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByTestId('project-icon')).not.toBeInTheDocument();
  });
});
