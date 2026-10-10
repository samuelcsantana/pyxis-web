import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { presetPeriod } from '@/domain/period';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { MobileMenu } from './mobile-menu';
import { PeriodSelector } from './period-selector';
import { ProjectSwitcher } from './project-switcher';
import { MainContent } from './main-content';
import { linkWith, periodParameters, returnPathOf, screenHref, screenOf } from './screens';
import { Sidebar } from './sidebar';
import { SidebarNav } from './sidebar-nav';
import { SIGN_OUT_MIN_BUSY_MS, SignOutButton } from './sign-out-button';
import { CONTENT_ID, SkipLink } from './skip-link';
import { Topbar } from './topbar';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const navigation = vi.hoisted(() => ({
  pathname: '/p-store/overview',
  search: 'range=7d&tab=events',
  router: { replace: vi.fn(), refresh: vi.fn() },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
  useRouter: () => navigation.router,
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    { id: 'p-store', name: 'Demo Store', timezone: 'America/Sao_Paulo', conversionEvent: null },
    { id: 'p-docs', name: 'Demo Docs', timezone: 'Europe/Lisbon', conversionEvent: 'signup' },
  ],
};
function chooseNothing(): Promise<void> {
  return Promise.resolve();
}

function store() {
  const [first] = ADMIN.projects;
  if (first === undefined) {
    throw new Error('fixture without projects');
  }
  return first;
}

describe('screens helpers', () => {
  it('keep only the period parameters', () => {
    expect(periodParameters(new URLSearchParams('range=7d&tab=x&from=a&to=b'))).toBe(
      'range=7d&from=a&to=b',
    );
    expect(periodParameters(new URLSearchParams('tab=x'))).toBe('');
  });

  it('build screen links with or without a query', () => {
    expect(screenHref('p 1', 'overview')).toBe('/p%201/overview');
    expect(screenHref('p1', 'funnel', 'range=7d')).toBe('/p1/funnel?range=7d');
  });

  it('add parameters to a link that may already have a query', () => {
    expect(linkWith('/p1/timeline', { visit: 'v 1' })).toBe('/p1/timeline?visit=v+1');
    expect(linkWith('/p1/timeline?range=7d', { user: 'u_7f3a' })).toBe(
      '/p1/timeline?range=7d&user=u_7f3a',
    );
  });

  it('accept as a return path only a screen of this site, with its query', () => {
    expect(returnPathOf('/p1/requests?show=failing')).toBe('/p1/requests?show=failing');
    expect(returnPathOf('/p1/overview')).toBe('/p1/overview');
  });

  it('refuse any other return path', () => {
    for (const value of [
      null,
      undefined,
      '',
      'https://evil.example/p1/overview',
      'javascript:alert(1)',
      '//evil.example/p1/overview',
      '/\\evil.example/overview',
      '/.//overview',
      '/',
      '/sign-in',
      '/p1/unknown',
      '/p1/overview/extra',
    ]) {
      expect(returnPathOf(value)).toBeUndefined();
    }
  });

  it('read the screen of a path', () => {
    expect(screenOf('/p1/overview')).toBe('overview');
    expect(screenOf('/')).toBeUndefined();
  });
});

describe('SidebarNav', () => {
  it('links each screen with the period and marks the current one', () => {
    renderWithMessages(<SidebarNav projectId="p-store" />);

    const overview = screen.getByRole('link', { name: 'Overview' });

    expect(overview).toHaveAttribute('href', '/p-store/overview?range=7d');
    expect(overview).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Devices' })).toHaveAttribute(
      'href',
      '/p-store/devices?range=7d',
    );
    expect(screen.getByRole('link', { name: 'Devices' })).not.toHaveAttribute('aria-current');
  });

  it('links every screen, then the project settings', () => {
    renderWithMessages(<SidebarNav projectId="p-store" />);

    expect(screen.getAllByRole('link')).toHaveLength(9);
    expect(screen.getAllByRole('link').at(-1)).toHaveAccessibleName('Settings');
    expect(screen.queryByText('Soon')).not.toBeInTheDocument();
  });

  it('marks nothing current on another screen', () => {
    navigation.pathname = '/p-store/settings';
    renderWithMessages(<SidebarNav projectId="p-store" />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });
});

describe('the project settings in the navigation', () => {
  it('links the settings of the project in a list of its own, without the period', () => {
    renderWithMessages(<SidebarNav projectId="p-store" />);

    const link = within(screen.getByRole('list', { name: 'Project' })).getByRole('link', {
      name: 'Settings',
    });
    expect(link).toHaveAttribute('href', '/p-store/settings');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('marks the settings current on the settings page, and no screen', () => {
    navigation.pathname = '/p-store/settings';
    renderWithMessages(<SidebarNav projectId="p-store" />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });
});

describe('ProjectSwitcher', () => {
  it('names the current project and links every project on the same screen and period', () => {
    renderWithMessages(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);

    expect(document.querySelector('summary')).toHaveTextContent(
      /^Switch project\. Current project: .*Demo Store/,
    );
    expect(screen.getByRole('link', { name: /Demo Docs/ })).toHaveAttribute(
      'href',
      '/p-docs/overview?range=7d',
    );
    expect(screen.getByRole('link', { name: /Demo Store/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('marks the current project with a check and the current-item background, not by weight alone', () => {
    renderWithMessages(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);

    const current = screen.getByRole('link', { name: /Demo Store/ });
    const other = screen.getByRole('link', { name: /Demo Docs/ });
    expect(current.querySelector('svg')).toBeInTheDocument();
    expect(other.querySelector('svg')).not.toBeInTheDocument();
    expect(current).toHaveClass('bg-nav-active');
    expect(other).not.toHaveClass('bg-nav-active');
  });

  it('closes after a project is chosen', () => {
    const { container } = renderWithMessages(
      <ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />,
    );
    const details = container.querySelector('details');
    if (details === null) {
      throw new Error('no details element');
    }
    details.open = true;

    fireEvent.click(details.querySelector('ul') ?? details);
    expect(details.open).toBe(true);

    fireEvent.click(screen.getByRole('link', { name: /Demo Docs/ }));
    expect(details.open).toBe(false);
  });

  it('closes on Escape inside the mobile menu, which stays open until a second Escape', () => {
    const { container } = renderWithMessages(
      <MobileMenu>
        <ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />
      </MobileMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const details = container.querySelector('details');
    const summary = container.querySelector('summary');
    if (details === null || summary === null) {
      throw new Error('no project switcher');
    }
    details.open = true;
    const link = screen.getByRole('link', { name: /Demo Docs/ });
    link.focus();

    fireEvent.keyDown(link, { key: 'Escape' });

    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.keyDown(summary, { key: 'Escape' });

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes when the focus moves past its last project', () => {
    const { container } = renderWithMessages(
      <>
        <ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />
        <a href="#overview">Overview</a>
      </>,
    );
    const details = container.querySelector('details');
    if (details === null) {
      throw new Error('no details element');
    }
    details.open = true;

    fireEvent.blur(screen.getByRole('link', { name: /Demo Docs/ }), {
      relatedTarget: screen.getByRole('link', { name: 'Overview' }),
    });

    expect(details.open).toBe(false);
  });

  it('falls back to the first screen from a path without one', () => {
    navigation.pathname = '/p-store';
    renderWithMessages(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: /Demo Docs/ })).toHaveAttribute(
      'href',
      '/p-docs/overview?range=7d',
    );
  });
});

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.replace.mockClear();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function settle(milliseconds: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(milliseconds);
    });
  }

  it('signs out and goes to the sign-in page', async () => {
    renderWithMessages(<SignOutButton authService={new MockAuthService()} />);

    expect(screen.getByRole('button', { name: 'Sign out' }).querySelector('svg')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(screen.getByRole('button', { name: 'Signing out…' })).toBeDisabled();
    await settle(SIGN_OUT_MIN_BUSY_MS);
    expect(navigation.router.replace).toHaveBeenCalledWith('/sign-in');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('signs out everywhere when asked to, and goes to the sign-in page', async () => {
    const calls: string[] = [];
    const recording: IAuthService = {
      requestCode: () => Promise.resolve(),
      verifyCode: () => Promise.resolve(),
      signOut: () => {
        calls.push('signOut');
        return Promise.resolve();
      },
      signOutEverywhere: () => {
        calls.push('signOutEverywhere');
        return Promise.resolve();
      },
    };
    renderWithMessages(<SignOutButton authService={recording} scope="everywhere" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out everywhere' }));

    expect(screen.getByRole('button', { name: 'Signing out…' })).toBeDisabled();
    await settle(SIGN_OUT_MIN_BUSY_MS);
    expect(calls).toEqual(['signOutEverywhere']);
    expect(navigation.router.replace).toHaveBeenCalledWith('/sign-in');
  });

  it('stays and says so when signing out fails', async () => {
    const failing: IAuthService = {
      requestCode: () => Promise.resolve(),
      verifyCode: () => Promise.resolve(),
      signOut: () => Promise.reject(new TypeError('Failed to fetch')),
      signOutEverywhere: () => Promise.reject(new TypeError('Failed to fetch')),
    };
    renderWithMessages(<SignOutButton authService={failing} variant="page" />);

    expect(screen.getByRole('button', { name: 'Sign out' }).querySelector('svg')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not sign out');
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it('builds its own service when none is given', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    renderWithMessages(<SignOutButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(navigation.router.replace).toHaveBeenCalledWith('/sign-in');
  });

  it('does not navigate once it is gone', async () => {
    const { unmount } = renderWithMessages(<SignOutButton authService={new MockAuthService()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    unmount();
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(navigation.router.replace).not.toHaveBeenCalled();
  });
});

describe('Sidebar', () => {
  it('holds the project switcher, the screens, the settings, the privacy note and the account menu', () => {
    renderWithMessages(
      <Sidebar admin={ADMIN} project={store()} i18n={english} chooseLocale={chooseNothing} />,
    );

    expect(screen.getByText('No cookies, no personal data')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Account and preferences')).toBeInTheDocument();
    expect(screen.getByText('owner@demo-store.example')).toBeInTheDocument();
    expect(screen.getAllByRole('group', { name: 'Language', hidden: true })).toHaveLength(1);
    expect(screen.getByRole('group', { name: 'Theme', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out', hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Project settings' })).not.toBeInTheDocument();
  });

  it('becomes the main navigation inside the menu, with the menu bar', () => {
    renderWithMessages(
      <MobileMenu>
        <Sidebar admin={ADMIN} project={store()} i18n={english} chooseLocale={chooseNothing} />
      </MobileMenu>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(within(navigation).getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(
      within(navigation).getByRole('button', { name: 'Sign out', hidden: true }),
    ).toBeInTheDocument();
  });
});

describe('MobileMenu', () => {
  it('opens and closes the navigation, and closes after a link is followed', () => {
    renderWithMessages(
      <MobileMenu>
        <a href="#overview">Overview</a>
        <span>Not a link</span>
      </MobileMenu>,
    );
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    const menu = document.getElementById('main-navigation');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveClass('block');

    fireEvent.click(screen.getByText('Not a link'));
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('link', { name: 'Overview', hidden: true }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(menu).toHaveClass('hidden');
  });

  it('closes with its own button', () => {
    renderWithMessages(
      <MobileMenu>
        <span>menu</span>
      </MobileMenu>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  function renderOpenMenu() {
    const view = renderWithMessages(
      <MobileMenu>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    return view;
  }

  it('closes on Escape and gives the focus back to its button', () => {
    renderOpenMenu();
    const link = screen.getByRole('link', { name: 'Overview' });
    link.focus();

    fireEvent.keyDown(link, { key: 'Escape' });

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('stays open on any other key', () => {
    renderOpenMenu();

    fireEvent.keyDown(screen.getByRole('link', { name: 'Overview' }), { key: 'Enter' });

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('leaves the focus alone on Escape while closed', () => {
    renderWithMessages(
      <MobileMenu>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );
    const link = screen.getByRole('link', { name: 'Overview', hidden: true });
    link.focus();

    fireEvent.keyDown(link, { key: 'Escape' });

    expect(link).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('stays open while the address stays the same', () => {
    const { rerender } = renderOpenMenu();

    rerender(
      <MobileMenu>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('closes when the query changes, as with a period link or Back', () => {
    const { rerender } = renderOpenMenu();

    navigation.search = 'range=30d';
    rerender(
      <MobileMenu>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );
    navigation.search = 'range=7d&tab=events';

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes when the path changes', () => {
    const { rerender } = renderOpenMenu();

    navigation.pathname = '/p-store/funnel';
    rerender(
      <MobileMenu>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});

describe('SkipLink and MainContent', () => {
  it('link to the content, which takes the focus and keeps its own classes', () => {
    renderWithMessages(
      <>
        <SkipLink i18n={english} />
        <MainContent className="flex gap-4" aria-busy="true">
          <p>content</p>
        </MainContent>
      </>,
    );

    const main = screen.getByRole('main');

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      `#${CONTENT_ID}`,
    );
    expect(main).toHaveAttribute('id', CONTENT_ID);
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main).toHaveAttribute('aria-busy', 'true');
    expect(main).toHaveClass('flex', 'gap-4');
    expect(main).toHaveTextContent('content');
  });
});

function openDetails(container: HTMLElement) {
  const details = container.querySelector('details');
  if (details === null) {
    throw new Error('The period selector has no custom form.');
  }
  details.open = true;
}

describe('PeriodSelector', () => {
  const today = '2026-10-05';

  it('links each preset and marks the current one', () => {
    renderWithMessages(
      <PeriodSelector
        basePath="/p1/overview"
        period={presetPeriod('7d', today)}
        today={today}
        i18n={english}
      />,
    );

    const presets = within(screen.getByRole('navigation', { name: 'Period' }));

    expect(presets.getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p1/overview?range=today',
    );
    expect(presets.getByRole('link', { name: '7 days' })).toHaveAttribute('aria-current', 'page');
    expect(presets.getByRole('link', { name: '30 days' })).not.toHaveAttribute('aria-current');
  });

  it('offers a calendar for a custom period in a plain form, closed until asked for', async () => {
    const { container } = renderWithMessages(
      <PeriodSelector
        basePath="/p1/overview"
        period={{ preset: 'custom', from: '2026-08-01', to: '2026-08-31' }}
        today={today}
        i18n={english}
      />,
    );

    const form = container.querySelector('form');

    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(form).toHaveAttribute('action', '/p1/overview');
    expect(form).toHaveProperty('method', 'get');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();

    openDetails(container);

    expect(await screen.findByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
    expect(container.querySelector('input[name="from"]')).toHaveValue('2026-08-01');
    expect(container.querySelector('input[name="to"]')).toHaveValue('2026-08-31');
    expect(screen.getByText('Aug 1 – Aug 31, 2026 · 31 days')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('opens on the period in force when a range was not used, pointing at the notice', async () => {
    const { container } = renderWithMessages(
      <PeriodSelector
        basePath="/p1/overview"
        period={{
          ...presetPeriod('30d', today),
          rejected: { from: '2026-10-05', to: '2026-09-20', problem: 'inverted' },
        }}
        today={today}
        i18n={english}
      />,
    );

    expect(container.querySelector('details')).toHaveAttribute('open');
    expect(await screen.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(container.querySelector('input[name="from"]')).toHaveValue('2026-09-06');
    expect(container.querySelector('input[name="to"]')).toHaveValue('2026-10-05');
    expect(screen.getByText('Sep 6 – Oct 5, 2026 · 30 days')).toHaveAttribute(
      'aria-describedby',
      'period-range-notice',
    );
  });

  it('closes the custom form on Escape, with the focus back on "Custom"', async () => {
    const { container } = renderWithMessages(
      <PeriodSelector
        basePath="/p1/overview"
        period={{
          ...presetPeriod('30d', today),
          rejected: { from: '2026-10-05', to: '2026-09-20', problem: 'inverted' },
        }}
        today={today}
        i18n={english}
      />,
    );
    const day = await screen.findByRole('button', { name: 'Monday, October 5, 2026' });
    day.focus();

    fireEvent.blur(day, { relatedTarget: null });
    expect(container.querySelector('details')).toHaveAttribute('open');

    fireEvent.keyDown(day, { key: 'Escape' });
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(screen.getByText('Custom')).toHaveFocus();
  });

  it('closes the custom form when the focus moves to a preset', async () => {
    const { container } = renderWithMessages(
      <PeriodSelector
        basePath="/p1/overview"
        period={{
          ...presetPeriod('30d', today),
          rejected: { from: '2026-10-05', to: '2026-09-20', problem: 'inverted' },
        }}
        today={today}
        i18n={english}
      />,
    );

    const apply = await screen.findByRole('button', { name: 'Apply' });
    fireEvent.blur(apply, {
      relatedTarget: screen.getByRole('link', { name: '7 days' }),
    });

    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });
});

describe('PeriodSelector with parameters of the screen', () => {
  it('carries them into every preset and into the custom form', () => {
    const { container } = renderWithMessages(
      <PeriodSelector
        basePath="/p1/features"
        period={presetPeriod('7d', '2026-10-05')}
        today="2026-10-05"
        keep={{ kind: 'screens', q: 'order' }}
        i18n={english}
      />,
    );

    expect(screen.getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p1/features?range=today&kind=screens&q=order',
    );
    expect(container.querySelector('input[type="hidden"][name="kind"]')).toHaveValue('screens');
    expect(container.querySelector('input[type="hidden"][name="q"]')).toHaveValue('order');
  });
});

describe('Topbar without a period', () => {
  it('shows the title, with no period controls and no theme toggle', () => {
    renderWithMessages(<Topbar title="Timeline" subtitle="Everything one person did, in order" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Timeline' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Period' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /theme/ })).not.toBeInTheDocument();
  });
});

describe('Topbar', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('shows the title, the subtitle and the period in words', () => {
    document.documentElement.dataset.theme = 'dark';
    renderWithMessages(
      <Topbar
        title="Overview"
        subtitle="How Demo Store was used in the period"
        basePath="/p1/overview"
        period={presetPeriod('30d', '2026-10-05')}
        today="2026-10-05"
        i18n={english}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('How Demo Store was used in the period')).toHaveClass(
      'hidden',
      'sm:inline',
      'truncate',
    );
    const range = screen.getByText('Sep 6 – Oct 5, 2026');
    expect(range.closest('p')).toContainElement(
      screen.getByText('How Demo Store was used in the period'),
    );
    expect(range.closest('p')).toHaveClass('flex');
    expect(range.parentElement).toHaveClass('shrink-0');
    expect(screen.getByRole('navigation', { name: 'Period' })).not.toContainElement(range);
    expect(screen.queryByRole('button', { name: /theme/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('says which custom range it did not use, and what it shows instead', () => {
    renderWithMessages(
      <Topbar
        title="Overview"
        subtitle="How Demo Store was used in the period"
        basePath="/p1/overview"
        period={{
          ...presetPeriod('30d', '2026-10-05'),
          rejected: { from: '2025-01-01', to: '2026-10-01', problem: 'too-long' },
        }}
        today="2026-10-05"
        i18n={english}
      />,
    );

    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent(
      'That range was not used: it is longer than 400 days. Showing the last 30 days instead.',
    );
    expect(notice).toHaveAttribute('id', 'period-range-notice');
    expect(screen.getByText('Sep 6 – Oct 5, 2026')).toBeInTheDocument();
  });
});
