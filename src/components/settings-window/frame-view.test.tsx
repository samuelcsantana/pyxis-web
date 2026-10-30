import { fireEvent, render, screen } from '@testing-library/react';
import type { MouseEvent, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  type FrameMode,
  FrameRoot,
  type FrameView,
  FrameViewProvider,
  SECTION_TITLE,
  SectionLink,
  ShowListButton,
} from './frame-view';

vi.mock('next/link', () => ({
  default: ({
    href,
    replace,
    scroll,
    onClick,
    className,
    children,
  }: {
    readonly href: string;
    readonly replace?: boolean;
    readonly scroll?: boolean;
    readonly onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    readonly className?: string;
    readonly children: ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-next-link=""
      data-replace={String(replace)}
      data-scroll={String(scroll)}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
  useLinkStatus: () => ({ pending: false }),
}));

const PROVIDER_MISSING = 'A settings frame needs a FrameViewProvider above it.';

type RowName = 'project' | 'keys' | 'none';

interface FrameProps {
  readonly mode: FrameMode;
  readonly initial: FrameView;
  readonly current: RowName;
  readonly section?: string;
}

function Frame({ mode, initial, current, section }: FrameProps) {
  return (
    <FrameViewProvider initial={initial} section={section}>
      <FrameRoot className="flex">
        <nav aria-label="Sections" data-frame-nav="">
          <SectionLink
            href="/p-store/settings"
            mode={mode}
            current={current === 'project'}
            className="row"
          >
            Project
          </SectionLink>
          <SectionLink
            href="/p-store/settings/keys"
            mode={mode}
            current={current === 'keys'}
            className="row"
          >
            Keys
          </SectionLink>
        </nav>
        <section>
          <ShowListButton className="back">All settings</ShowListButton>
          <h2 tabIndex={-1} data-section-title="">
            Keys
          </h2>
        </section>
      </FrameRoot>
    </FrameViewProvider>
  );
}

function frameRoot(): HTMLElement {
  const root = document.querySelector<HTMLElement>('[data-view]');
  if (root === null) {
    throw new Error('no frame root rendered');
  }
  return root;
}

function sectionTitle(): HTMLElement {
  return screen.getByRole('heading', { name: 'Keys' });
}

function row(name: string): HTMLElement {
  return screen.getByRole('link', { name });
}

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

describe('FrameRoot', () => {
  it('exposes the view it starts on and keeps the frame group class', () => {
    render(<Frame mode="window" initial="list" current="keys" />);

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(frameRoot()).toHaveClass('group/frame', 'flex');
  });

  it('starts on the section when asked to', () => {
    render(<Frame mode="page" initial="section" current="keys" />);

    expect(frameRoot()).toHaveAttribute('data-view', 'section');
  });

  it('throws the provider error when rendered without a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<FrameRoot className="flex">Settings</FrameRoot>)).toThrow(
      PROVIDER_MISSING,
    );
  });
});

describe('SectionLink', () => {
  it('marks the current row as the page and keeps its address', () => {
    render(<Frame mode="window" initial="list" current="keys" />);

    expect(row('Keys')).toHaveAttribute('aria-current', 'page');
    expect(row('Keys')).toHaveAttribute('href', '/p-store/settings/keys');
    expect(row('Project')).not.toHaveAttribute('aria-current');
  });

  it('stays on the current row when it is clicked, shows the section and focuses its title', () => {
    render(<Frame mode="window" initial="list" current="keys" />);

    expect(preventedClick(row('Keys'))).toBe(true);
    expect(frameRoot()).toHaveAttribute('data-view', 'section');
    expect(sectionTitle()).toHaveFocus();
    expect(document.querySelector(SECTION_TITLE)).toBe(sectionTitle());
  });

  it('focuses the section title again on every click of the current row', () => {
    render(<Frame mode="page" initial="section" current="keys" />);
    fireEvent.click(row('Keys'));
    row('Project').focus();

    fireEvent.click(row('Keys'));

    expect(sectionTitle()).toHaveFocus();
  });

  it('renders another row of a full page as a plain link that the frame does not intercept', () => {
    render(<Frame mode="page" initial="list" current="keys" />);

    expect(row('Project')).not.toHaveAttribute('data-next-link');
    expect(row('Project')).toHaveAttribute('href', '/p-store/settings');
    expect(row('Project')).toHaveClass('row');
    expect(preventedClick(row('Project'))).toBe(false);
    expect(frameRoot()).toHaveAttribute('data-view', 'list');
  });

  it('renders another row of the window as a client link that replaces the entry without scrolling', () => {
    render(<Frame mode="window" initial="list" current="keys" />);

    expect(row('Project')).toHaveAttribute('data-next-link');
    expect(row('Project')).toHaveAttribute('data-replace', 'true');
    expect(row('Project')).toHaveAttribute('data-scroll', 'false');
    expect(row('Project')).toHaveAttribute('href', '/p-store/settings');
    expect(row('Project')).toHaveClass('row');
    expect(row('Keys')).not.toHaveAttribute('data-next-link');
  });

  it('keeps the list while another row of the window is on its way, focus on that row', () => {
    render(<Frame mode="window" initial="list" current="keys" section="/p-store/settings/keys" />);
    row('Project').focus();

    fireEvent.click(row('Project'));

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(row('Project')).toHaveFocus();
  });

  it('shows the section and focuses its title once the section it asked for arrives', () => {
    const { rerender } = render(
      <Frame mode="window" initial="list" current="keys" section="/p-store/settings/keys" />,
    );

    rerender(<Frame mode="window" initial="list" current="project" section="/p-store/settings" />);

    expect(frameRoot()).toHaveAttribute('data-view', 'section');
    expect(sectionTitle()).toHaveFocus();
  });

  it('stays where it is when the same section renders again', () => {
    const { rerender } = render(
      <Frame mode="window" initial="list" current="keys" section="/p-store/settings/keys" />,
    );

    rerender(
      <Frame mode="window" initial="list" current="keys" section="/p-store/settings/keys" />,
    );

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(sectionTitle()).not.toHaveFocus();
  });

  it('adds a hidden pending mark that stays idle while the link is not pending', () => {
    render(<Frame mode="window" initial="list" current="keys" />);

    const mark = row('Project').querySelector('span[aria-hidden="true"]');

    expect(mark).not.toBeNull();
    expect(mark).not.toHaveAttribute('data-pending');
  });

  it('throws the provider error when rendered without a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <SectionLink href="/p-store/settings" mode="page" current={false} className="row">
          Project
        </SectionLink>,
      ),
    ).toThrow(PROVIDER_MISSING);
  });
});

describe('ShowListButton', () => {
  it('shows the list and focuses the current row', () => {
    render(<Frame mode="window" initial="section" current="keys" />);

    fireEvent.click(screen.getByRole('button', { name: 'All settings' }));

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(row('Keys')).toHaveFocus();
  });

  it('shows the list and leaves focus alone when no row is current', () => {
    render(<Frame mode="page" initial="section" current="none" />);
    const back = screen.getByRole('button', { name: 'All settings' });
    back.focus();

    fireEvent.click(back);

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(back).toHaveFocus();
  });

  it('is a plain button with the given class', () => {
    render(<Frame mode="page" initial="section" current="keys" />);

    const back = screen.getByRole('button', { name: 'All settings' });

    expect(back).toHaveAttribute('type', 'button');
    expect(back).toHaveClass('back');
  });

  it('throws the provider error when rendered without a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<ShowListButton className="back">All settings</ShowListButton>)).toThrow(
      PROVIDER_MISSING,
    );
  });
});
