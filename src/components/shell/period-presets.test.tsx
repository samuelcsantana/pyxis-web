import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { type PeriodPresetsProps, type PresetLink, PeriodPresets } from './period-presets';

vi.mock('next/link', () => ({
  default: ({
    href,
    onClick,
    children,
    ...rest
  }: {
    readonly href: string;
    readonly onClick?: () => void;
    readonly children: React.ReactNode;
  }) => (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </a>
  ),
  useLinkStatus: () => ({ pending: false }),
}));

const LINKS: readonly PresetLink[] = [
  { preset: 'today', label: 'Today', href: '/p/overview?range=today' },
  { preset: '7d', label: '7 days', href: '/p/overview?range=7d' },
  { preset: '30d', label: '30 days', href: '/p/overview?range=30d' },
];

function renderPresets(current: PeriodPresetsProps['current']) {
  return render(<PeriodPresets label="Period" links={LINKS} current={current} />);
}

function indicator() {
  return screen.getByTestId('period-indicator');
}

describe('PeriodPresets', () => {
  it('lays the presets in equal columns and puts the indicator under the current one', () => {
    renderPresets('7d');

    expect(screen.getByRole('navigation', { name: 'Period' })).toHaveClass('grid', 'auto-cols-fr');
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '7 days' })).toHaveClass('text-card');
    expect(indicator()).toHaveStyle({
      width: 'calc((100% - 10px) / 3)',
      translate: 'calc(1 * (100% + 2px)) 0',
    });
    expect(indicator()).toHaveClass('opacity-100', 'motion-reduce:transition-none');
  });

  it('slides the indicator to a clicked preset at once, before the new page arrives', () => {
    renderPresets('30d');

    fireEvent.click(screen.getByRole('link', { name: 'Today' }));

    expect(indicator()).toHaveStyle({ translate: 'calc(0 * (100% + 2px)) 0' });
    expect(screen.getByRole('link', { name: 'Today' })).toHaveClass('text-card');
    expect(screen.getByRole('link', { name: '30 days' })).not.toHaveClass('text-card');
    expect(screen.getByRole('link', { name: '30 days' })).toHaveAttribute('aria-current', 'page');
  });

  it('follows the page once it changes, whatever was clicked before', () => {
    const view = renderPresets('30d');
    fireEvent.click(screen.getByRole('link', { name: 'Today' }));

    view.rerender(<PeriodPresets label="Period" links={LINKS} current="7d" />);

    expect(indicator()).toHaveStyle({ translate: 'calc(1 * (100% + 2px)) 0' });
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute('aria-current', 'page');
  });

  it('hides the indicator while a custom period is shown', () => {
    renderPresets('custom');

    expect(indicator()).toHaveClass('opacity-0');
    expect(indicator()).toHaveStyle({ translate: 'calc(0 * (100% + 2px)) 0' });
    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-current');
    }
  });
});
