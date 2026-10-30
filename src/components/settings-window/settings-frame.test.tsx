import { fireEvent, screen, within } from '@testing-library/react';
import type { MouseEvent, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { type FrameMode, FrameViewProvider, WINDOW_TITLE_ID } from './frame-view';
import { SECTION_LOOKS } from './sections';
import {
  type FrameGroup,
  type FrameSection,
  type FrameTexts,
  type FrameTitleLevel,
  SettingsFrame,
} from './settings-frame';

const navigation = vi.hoisted(() => ({
  router: { replace: vi.fn(), refresh: vi.fn(), back: vi.fn() },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
  usePathname: () => '/p-store/settings/keys',
  useSearchParams: () => new URLSearchParams('range=7d'),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    onClick,
    className,
    children,
  }: {
    readonly href: string;
    readonly onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    readonly className?: string;
    readonly children: ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-next-link=""
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

const TEXTS: FrameTexts = {
  title: 'Settings',
  sections: 'Sections',
  backToList: 'All settings',
};

const GROUPS: readonly FrameGroup[] = [
  {
    label: 'Demo Store',
    rows: [
      {
        section: 'project',
        href: '/p-store/settings?range=7d',
        label: 'Project',
        icon: SECTION_LOOKS.project.icon,
      },
      {
        section: 'keys',
        href: '/p-store/settings/keys?range=7d',
        label: 'Keys',
        icon: SECTION_LOOKS.keys.icon,
      },
    ],
  },
  {
    label: 'You',
    rows: [
      {
        section: 'sessions',
        href: '/account/sessions?range=7d',
        label: 'Sessions',
        icon: SECTION_LOOKS.sessions.icon,
      },
    ],
  },
];

const KEYS: FrameSection = {
  key: 'keys',
  title: 'Keys',
  titleId: SECTION_LOOKS.keys.titleId,
};

const PROVIDER_MISSING = 'A settings frame needs a FrameViewProvider above it.';

interface FrameOptions {
  readonly mode?: FrameMode;
  readonly titleLevel?: FrameTitleLevel;
  readonly section?: FrameSection;
}

function frame({ mode = 'page', titleLevel = null, section = KEYS }: FrameOptions = {}) {
  return (
    <SettingsFrame
      mode={mode}
      titleLevel={titleLevel}
      texts={TEXTS}
      email="owner@example.com"
      groups={GROUPS}
      section={section}
    >
      <p>Public keys of Demo Store</p>
    </SettingsFrame>
  );
}

function renderFrame(options: FrameOptions = {}) {
  return renderWithMessages(frame(options));
}

function renderInWindow(options: FrameOptions = {}) {
  return renderWithMessages(
    <FrameViewProvider initial="list">{frame({ ...options, mode: 'window' })}</FrameViewProvider>,
  );
}

function sections(): HTMLElement {
  return screen.getByRole('navigation', { name: 'Sections' });
}

function frameRoot(): HTMLElement {
  const root = document.querySelector<HTMLElement>('[data-view]');
  if (root === null) {
    throw new Error('no frame root rendered');
  }
  return root;
}

describe('SettingsFrame', () => {
  it('lists the sections in a navigation named by the sections text', () => {
    renderFrame();

    expect(sections()).toHaveAttribute('data-frame-nav');
    expect(within(sections()).getByText('Demo Store')).toBeInTheDocument();
    expect(within(sections()).getByText('You')).toBeInTheDocument();
  });

  it('renders every row with its label and its address, in the order of the groups', () => {
    renderFrame();

    const rows = within(sections()).getAllByRole('link');

    expect(rows.map((row) => row.textContent)).toEqual(['Project', 'Keys', 'Sessions']);
    expect(rows.map((row) => row.getAttribute('href'))).toEqual([
      '/p-store/settings?range=7d',
      '/p-store/settings/keys?range=7d',
      '/account/sessions?range=7d',
    ]);
  });

  it('marks only the row of the open section as the current page', () => {
    renderFrame();

    expect(screen.getByRole('link', { name: 'Keys' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Project' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Sessions' })).not.toHaveAttribute('aria-current');
  });

  it('marks an account row as current when an account section is open', () => {
    renderFrame({
      section: {
        key: 'sessions',
        title: 'Sessions',
        titleId: SECTION_LOOKS.sessions.titleId,
      },
    });

    expect(screen.getByRole('link', { name: 'Sessions' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Keys' })).not.toHaveAttribute('aria-current');
  });

  it('titles the section with a focusable h2 that carries the id of the old panel heading', () => {
    renderFrame();

    const title = screen.getByRole('heading', { level: 2, name: 'Keys' });

    expect(title).toHaveAttribute('id', 'settings-keys-heading');
    expect(title).toHaveAttribute('tabindex', '-1');
    expect(title).toHaveAttribute('data-section-title');
    expect(screen.getByRole('region', { name: 'Keys' })).toContainElement(
      screen.getByText('Public keys of Demo Store'),
    );
  });

  it('renders the frame title as the focusable h2 that names the window', () => {
    renderInWindow({ titleLevel: 2 });

    const title = screen.getByRole('heading', { level: 2, name: 'Settings' });

    expect(title).toHaveAttribute('id', 'settings-window-title');
    expect(title).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('renders no frame title when the page already has one', () => {
    renderFrame({ titleLevel: null });

    expect(screen.queryByRole('heading', { name: 'Settings' })).toBeNull();
    expect(WINDOW_TITLE_ID).toBe('settings-window-title');
    expect(document.getElementById('settings-window-title')).toBeNull();
  });

  it('shows the e-mail of the signed-in person and its initial', () => {
    renderFrame();

    expect(within(sections()).getByText('owner@example.com')).toBeInTheDocument();
    expect(within(sections()).getByText('O')).toHaveAttribute('aria-hidden', 'true');
  });

  it('offers the sign-out button inside the list of sections', () => {
    renderFrame();

    expect(within(sections()).getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('brings its own view on a full page, starting on the section', () => {
    renderFrame();

    expect(frameRoot()).toHaveAttribute('data-view', 'section');
    expect(screen.getByRole('link', { name: 'Project' })).not.toHaveAttribute('data-next-link');
  });

  it('goes back to the list on a full page and focuses the current row', () => {
    renderFrame();

    fireEvent.click(screen.getByRole('button', { name: 'All settings' }));

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(screen.getByRole('link', { name: 'Keys' })).toHaveFocus();
  });

  it('uses the view of the window that hosts it', () => {
    renderInWindow();

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute('data-next-link');
  });

  it('keeps the list in a window while the row clicked is on its way', () => {
    renderInWindow();

    fireEvent.click(screen.getByRole('link', { name: 'Project' }));

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
  });

  it('needs the provider of the window that hosts it', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderWithMessages(frame({ mode: 'window', titleLevel: 2 }))).toThrow(
      PROVIDER_MISSING,
    );
  });
});
