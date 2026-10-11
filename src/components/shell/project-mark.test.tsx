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
    const { container } = render(
      <ProjectMark project={{ ...PROJECT, iconVersion: 'abc' }} size="large" />,
    );

    const icon = screen.getByTestId('project-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.style.backgroundImage).toBe('url("/p-store/icon?v=abc")');
    expect(icon).toHaveClass('size-8', 'bg-white', 'bg-contain');
    expect(container).not.toHaveTextContent('DS');
  });

  it('draws the initials of the project when it has no icon', () => {
    render(<ProjectMark project={PROJECT} size="large" />);

    expect(screen.getByText('DS')).toHaveClass('size-8', 'bg-accent');
    expect(screen.queryByTestId('project-icon')).not.toBeInTheDocument();
  });

  it('draws the smaller mark of the project list', () => {
    const { rerender } = render(<ProjectMark project={PROJECT} size="small" />);
    expect(screen.getByText('DS')).toHaveClass('size-6', 'bg-nav-border');

    rerender(<ProjectMark project={PROJECT} size="small" iconHref="data:image/png;base64,AA==" />);
    expect(screen.getByTestId('project-icon')).toHaveClass('size-6');
  });
});
