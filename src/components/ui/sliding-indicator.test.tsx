import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LinkTabs } from './link-tabs';
import { SegmentedLinks } from './segmented-links';
import { SlidingIndicator } from './sliding-indicator';
import { useSlidingIndicator } from './use-sliding-indicator';

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

interface Box {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

const BOXES: Readonly<Record<string, Box>> = {
  all: { left: 3, top: 3, width: 110, height: 36 },
  failing: { left: 115, top: 3, width: 90, height: 36 },
  events: { left: 0, top: 0, width: 96, height: 44 },
  screens: { left: 100, top: 0, width: 80, height: 44 },
};

const NO_BOX: Box = { left: 0, top: 0, width: 0, height: 0 };

function boxOf(element: HTMLElement): Box {
  return BOXES[element.dataset.choice ?? ''] ?? NO_BOX;
}

const ROUTES = [
  { key: 'all', label: 'All routes', href: '/p/requests' },
  { key: 'failing', label: 'Failing only', href: '/p/requests?show=failing' },
] as const;

const TABS = [
  { key: 'events', label: 'Events', href: '/p/features' },
  { key: 'screens', label: 'Screens', href: '/p/features?kind=screens' },
] as const;

function indicator() {
  return screen.getByTestId('sliding-indicator');
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function left(
    this: HTMLElement,
  ) {
    return boxOf(this).left;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function top(
    this: HTMLElement,
  ) {
    return boxOf(this).top;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function width(
    this: HTMLElement,
  ) {
    return boxOf(this).width;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function height(
    this: HTMLElement,
  ) {
    return boxOf(this).height;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SegmentedLinks', () => {
  it('lays a thumb over the current link, measured from it, and clears the link own fill', () => {
    render(<SegmentedLinks label="Show" links={ROUTES} current="all" />);

    expect(indicator()).toHaveStyle({ width: '110px', height: '36px', translate: '3px 3px' });
    expect(screen.getByRole('navigation', { name: 'Show' })).toHaveAttribute('data-sliding');
    expect(screen.getByRole('link', { name: 'All routes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'All routes' })).toHaveClass(
      'bg-ink',
      'group-data-sliding/segmented:bg-transparent',
    );
  });

  it('slides the thumb to a clicked link at once, before the new page arrives', () => {
    render(<SegmentedLinks label="Show" links={ROUTES} current="all" />);

    fireEvent.click(screen.getByRole('link', { name: 'Failing only' }));

    expect(indicator()).toHaveStyle({ width: '90px', translate: '115px 3px' });
    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveClass('bg-ink');
    expect(screen.getByRole('link', { name: 'All routes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('follows the page once it changes, whatever was clicked before', () => {
    const view = render(<SegmentedLinks label="Show" links={ROUTES} current="all" />);
    fireEvent.click(screen.getByRole('link', { name: 'Failing only' }));

    view.rerender(<SegmentedLinks label="Show" links={ROUTES} current="failing" />);
    fireEvent.click(screen.getByRole('link', { name: 'All routes' }));
    view.rerender(<SegmentedLinks label="Show" links={ROUTES} current="failing" />);

    expect(indicator()).toHaveStyle({ translate: '3px 3px' });
    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

describe('LinkTabs', () => {
  it('underlines the current tab with a line laid on its bottom edge', () => {
    render(<LinkTabs label="Feature kind" tabs={TABS} current="events" />);

    expect(indicator()).toHaveStyle({ width: '96px', translate: '0px calc(44px - 100%)' });
    expect(screen.getByRole('link', { name: 'Events' })).toHaveClass(
      'border-ink',
      'group-data-sliding/tabs:border-transparent',
    );
  });

  it('moves the line to a clicked tab at once', () => {
    render(<LinkTabs label="Feature kind" tabs={TABS} current="events" />);

    fireEvent.click(screen.getByRole('link', { name: 'Screens' }));

    expect(indicator()).toHaveStyle({ width: '80px', translate: '100px calc(44px - 100%)' });
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('SlidingIndicator', () => {
  it('draws nothing before the chosen item is measured', () => {
    const { container } = render(<SlidingIndicator frame={null} shape="fill" className="thumb" />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('useSlidingIndicator', () => {
  it('ignores a container React lets go of', () => {
    const { result } = renderHook(() => useSlidingIndicator('all'));

    expect(result.current.attach(null)).toBeUndefined();
    expect(result.current.frame).toBeNull();
    expect(result.current.sliding).toBeUndefined();
  });

  it('measures nothing when the chosen item is not in the container', () => {
    const { result } = renderHook(() => useSlidingIndicator('missing'));
    const container = document.createElement('nav');

    const release = result.current.attach(container);

    expect(result.current.frame).toBeNull();
    expect(release).toBeTypeOf('function');
  });

  it('measures nothing while the chosen item is not drawn, as in a closed menu', () => {
    const { result } = renderHook(() => useSlidingIndicator('folded'));
    const container = document.createElement('div');
    const item = document.createElement('button');
    item.dataset.choice = 'folded';
    container.append(item);

    result.current.attach(container);

    expect(result.current.frame).toBeNull();
  });
});
