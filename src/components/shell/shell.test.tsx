import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { presetPeriod } from '@/domain/period';
import { seenMarksKey } from '@/lib/seen-marks';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { publishArrivalNews } from './arrival-news';
import { MobileMenu } from './mobile-menu';
import { PeriodSelector } from './period-selector';
import { ProjectSwitcher } from './project-switcher';
import { MainContent } from './main-content';
import {
  CONNECTED_APPS_HREF,
  hrefKeepingView,
  linkWith,
  NAVIGATION_ORDER,
  navigationItemOf,
  periodParameters,
  screenParameters,
  returnPathOf,
  SCREENS,
  SCREENS_IN_NAVIGATION_ORDER,
  screenHref,
  screenOf,
  screenSlugOf,
  settingsKeysHref,
  viewParameters,
} from './screens';
import { Sidebar } from './sidebar';
import { SidebarNav } from './sidebar-nav';
import { SIGN_OUT_MIN_BUSY_MS, SignOutButton } from './sign-out-button';
import { CONTENT_ID } from './content-id';
import { SkipLink } from './skip-link';
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
  email: 'owner@example.com',
  projects: [
    { id: 'p-store', name: 'Demo Store', timezone: 'America/Sao_Paulo', conversionEvent: null },
    { id: 'p-docs', name: 'Demo Docs', timezone: 'Europe/Lisbon', conversionEvent: 'signup' },
  ],
};

function store() {
  const [first] = ADMIN.projects;
  if (first === undefined) {
    throw new Error('fixture without projects');
  }
  return first;
}

const STORE_HOME = 'Overview · Demo Store';

function docs() {
  const [, second] = ADMIN.projects;
  if (second === undefined) {
    throw new Error('fixture without a second project');
  }
  return second;
}

describe('screens helpers', () => {
  it('keep only the period parameters', () => {
    expect(periodParameters(new URLSearchParams('range=7d&tab=x&from=a&to=b'))).toBe(
      'range=7d&from=a&to=b',
    );
    expect(periodParameters(new URLSearchParams('tab=x'))).toBe('');
  });

  it('keep the period and the dashboard filters for a screen, but no filter for the timeline', () => {
    const search = new URLSearchParams('range=7d&device=mobile&path=%2Fa&metric=x&os=');

    expect(screenParameters(search, 'devices')).toBe('range=7d&path=%2Fa&device=mobile');
    expect(screenParameters(search, 'timeline')).toBe('range=7d');
  });

  it('keep the view of the screens, the period and the filters, without what one screen reads', () => {
    expect(
      viewParameters(new URLSearchParams('from=2026-10-01&to=2026-10-10&metric=x&country=BR&os=')),
    ).toBe('from=2026-10-01&to=2026-10-10&country=BR');
    expect(viewParameters(new URLSearchParams('tab=events'))).toBe('');
  });

  it('add the view to a link to another page of the project, before its anchor', () => {
    const search = new URLSearchParams('range=today&device=mobile&tab=events');

    expect(hrefKeepingView('/p1/settings', search)).toBe('/p1/settings?range=today&device=mobile');
    expect(hrefKeepingView('/p1/settings#settings-keys-heading', search)).toBe(
      '/p1/settings?range=today&device=mobile#settings-keys-heading',
    );
    expect(hrefKeepingView('/p1/help?topic=a', new URLSearchParams('range=7d'))).toBe(
      '/p1/help?topic=a&range=7d',
    );
    expect(hrefKeepingView('/p1/install', new URLSearchParams('tab=events'))).toBe('/p1/install');
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

  it('link the keys of the settings and the connected apps of the account by their own address', () => {
    expect(settingsKeysHref('p 1')).toBe('/p%201/settings/keys');
    expect(CONNECTED_APPS_HREF).toBe('/account/apps');
  });

  it('name the screen of a path only when the path is exactly a project and a screen', () => {
    expect(screenSlugOf('/p1/overview')).toBe('overview');
    expect(screenSlugOf('/p1/acquisition')).toBe('acquisition');
    for (const path of ['/p1/settings', '/p1/overview/extra', '//overview', '/p1', '/']) {
      expect(screenSlugOf(path)).toBeUndefined();
    }
  });

  it('accept as a return path only a screen of this site, with its query', () => {
    expect(returnPathOf('/p1/requests?show=failing')).toBe('/p1/requests?show=failing');
    expect(returnPathOf('/p1/overview')).toBe('/p1/overview');
    expect(returnPathOf('/account')).toBe('/account');
    expect(returnPathOf('/connect?request=4d0f6b8c')).toBe('/connect?request=4d0f6b8c');
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
      '/\\evil.example/account',
      '/account/extra',
    ]) {
      expect(returnPathOf(value)).toBeUndefined();
    }
  });

  it('read the screen of a path', () => {
    expect(screenOf('/p1/overview')).toBe('overview');
    expect(screenOf('/')).toBeUndefined();
  });

  it('order the navigation with every screen exactly once', () => {
    const registry = SCREENS.map((screen) => screen.slug);

    expect(NAVIGATION_ORDER).toHaveLength(registry.length);
    expect([...NAVIGATION_ORDER].sort()).toEqual([...registry].sort());
    expect(SCREENS_IN_NAVIGATION_ORDER.map((screen) => screen.slug)).toEqual(NAVIGATION_ORDER);
  });

  it('name the item of the navigation that stands for each page of a project', () => {
    expect(navigationItemOf('/p1/overview')).toBe('overview');
    expect(navigationItemOf('/p1/timeline')).toBe('timeline');
    expect(navigationItemOf('/p1/settings')).toBe('settings');
    expect(navigationItemOf('/p1/install')).toBe('install');
    expect(navigationItemOf('/p1/exports/e1')).toBe('settings');
    expect(navigationItemOf('/p1/help')).toBe('help');
  });

  it('name no item of the navigation for any other path', () => {
    for (const pathname of [
      '/',
      '/account',
      '/connect',
      '/p1',
      '/p1/unknown',
      '/p1/constructor',
      '/p1/__proto__',
      '/p1/settings/',
      '/p1/settings/keys',
      '/p1/settings//keys',
      '/p1/install/extra',
      '/p1/help/extra',
      '/p1/help/',
      '/p1/exports',
      '/p1/exports/',
      '/p1/exports/e1/download',
      '/p1/overview/export',
      '//settings',
    ]) {
      expect(navigationItemOf(pathname)).toBeUndefined();
    }
  });
});

describe('SidebarNav', () => {
  it('links each screen with the period and marks the current one', () => {
    renderWithMessages(<SidebarNav project={store()} />);

    const overview = screen.getByRole('link', { name: 'Overview' });

    expect(overview).toHaveAttribute('href', '/p-store/overview?range=7d');
    expect(overview).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Devices' })).toHaveAttribute(
      'href',
      '/p-store/devices?range=7d',
    );
    expect(screen.getByRole('link', { name: 'Devices' })).not.toHaveAttribute('aria-current');
  });

  it('counts the news of each other screen inside its link', () => {
    renderWithMessages(<SidebarNav project={store()} />);

    act(() => {
      publishArrivalNews({
        overview: { shown: '4', label: '4 new visits' },
        funnel: { shown: '1', label: '1 new conversion' },
      });
    });

    expect(screen.getByRole('link', { name: 'Funnel, 1 new conversion' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');

    act(() => {
      publishArrivalNews({});
    });
  });

  it('links the screens in the order of the questions, then the install guide and the settings', () => {
    renderWithMessages(<SidebarNav project={store()} />);

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Overview',
      'Acquisition',
      'Devices',
      'Features',
      'Funnel',
      'Visits',
      'Timeline',
      'Requests',
      'Install',
      'Settings',
    ]);
    expect(screen.queryByText('Soon')).not.toBeInTheDocument();
  });

  it('marks nothing current on another screen', () => {
    navigation.pathname = '/p-store/settings';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });
});

describe('the project settings in the navigation', () => {
  it('links the settings of the project in a list of its own, keeping the period', () => {
    renderWithMessages(<SidebarNav project={store()} />);

    const link = within(screen.getByRole('list', { name: 'Project' })).getByRole('link', {
      name: 'Settings',
    });
    expect(link).toHaveAttribute('href', '/p-store/settings?range=7d');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('keeps a custom period and the filters on the way to the settings', () => {
    navigation.search = 'from=2026-10-01&to=2026-10-10&device=mobile&metric=visitors';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.search = 'range=7d&tab=events';

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings?from=2026-10-01&to=2026-10-10&device=mobile',
    );
  });

  it('links the settings without a query when the screen is on the default period', () => {
    navigation.search = '';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.search = 'range=7d&tab=events';

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings',
    );
  });

  it('gives the screens back the period the settings were opened with', () => {
    navigation.pathname = '/p-store/settings';
    navigation.search = 'range=today';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';
    navigation.search = 'range=7d&tab=events';

    expect(screen.getByRole('link', { name: 'Funnel' })).toHaveAttribute(
      'href',
      '/p-store/funnel?range=today',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks the settings current on the settings page, and no screen', () => {
    navigation.pathname = '/p-store/settings';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });

  it('marks the settings current on a section of the settings, and no screen', () => {
    navigation.pathname = '/p-store/settings/keys';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName('Settings');
  });

  function clickWithoutLeaving(link: HTMLElement): boolean {
    let preventedBeforeTheDocument = false;
    const record = (event: Event) => {
      preventedBeforeTheDocument = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', record);
    fireEvent.click(link);
    document.removeEventListener('click', record);
    return preventedBeforeTheDocument;
  }

  it('loads the settings as a full page when they are already open, so they never open over themselves', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    navigation.pathname = '/p-store/settings/keys';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    const prevented = clickWithoutLeaving(screen.getByRole('link', { name: 'Settings' }));

    expect(prevented).toBe(true);
    expect(assign).toHaveBeenCalledExactlyOnceWith('/p-store/settings?range=7d');
  });

  it('leaves a click on the settings from a screen to the link, which opens them over the screen', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    renderWithMessages(<SidebarNav project={store()} />);

    const prevented = clickWithoutLeaving(screen.getByRole('link', { name: 'Settings' }));

    expect(prevented).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });

  it('marks the settings current on an export, which has no item of its own', () => {
    navigation.pathname = '/p-store/exports/e1';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName('Settings');
  });

  it('marks no link of its own current on the help page, whose link is in the foot', () => {
    navigation.pathname = '/p-store/help';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    expect(document.querySelector('[aria-current]')).toBeNull();
  });
});

describe('the install guide in the navigation', () => {
  it('links the install guide first in the Project list, under a visible label, keeping the view', () => {
    navigation.search = 'range=7d&device=mobile';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.search = 'range=7d&tab=events';

    const project = screen.getByRole('list', { name: 'Project' });
    const [install, settings] = within(project).getAllByRole('link');
    expect(screen.getByText('Project')).toBeVisible();
    expect(install).toHaveAccessibleName('Install');
    expect(install).toHaveAttribute('href', '/p-store/install?range=7d&device=mobile');
    expect(install).not.toHaveAttribute('aria-current');
    expect(settings).toHaveAccessibleName('Settings');
  });

  it('marks the install guide current on its page, and nothing else', () => {
    navigation.pathname = '/p-store/install';
    renderWithMessages(<SidebarNav project={store()} />);
    navigation.pathname = '/p-store/overview';

    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName('Install');
  });

  it('tags the install guide as pending while the project has received no event', () => {
    renderWithMessages(<SidebarNav project={{ ...store(), firstEventAt: null }} />);

    expect(screen.getByRole('link', { name: 'Install, Pending' })).toBeInTheDocument();
  });

  it('tags nothing once an event arrived, or when the first event is not known', () => {
    const { unmount } = renderWithMessages(
      <SidebarNav project={{ ...store(), firstEventAt: '2026-10-01T10:00:00.000Z' }} />,
    );
    expect(screen.getByRole('link', { name: 'Install' })).toBeInTheDocument();
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
    unmount();

    renderWithMessages(<SidebarNav project={store()} />);
    expect(store().firstEventAt).toBeUndefined();
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
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

  it('lets the time zone of the current project break only after its slash, whole', () => {
    renderWithMessages(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);

    const zone = screen.getByText('America/Sao_Paulo');

    expect(zone.querySelectorAll('wbr')).toHaveLength(1);
    expect(zone.firstChild).toHaveTextContent('America/');
    expect(zone).not.toHaveClass('truncate');
  });

  it('offers a new project only to the owner of an account that can create one', () => {
    const { unmount } = renderWithMessages(
      <ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />,
    );
    expect(screen.queryByRole('link', { name: 'New project' })).not.toBeInTheDocument();
    unmount();

    renderWithMessages(
      <ProjectSwitcher projects={ADMIN.projects} currentProject={store()} canCreateProject />,
    );
    expect(screen.getByRole('link', { name: 'New project' })).toHaveAttribute(
      'href',
      '/new-project',
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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

  it('takes the look its caller gives, with its icon, and says there when it fails', async () => {
    const failing: IAuthService = {
      requestCode: () => Promise.resolve(),
      verifyCode: () => Promise.resolve(),
      signOut: () => Promise.reject(new TypeError('Failed to fetch')),
      signOutEverywhere: () => Promise.reject(new TypeError('Failed to fetch')),
    };
    renderWithMessages(
      <SignOutButton
        authService={failing}
        variant={{ frame: 'flex', button: 'w-full', error: 'px-2 text-bad', withIcon: true }}
      />,
    );

    const button = screen.getByRole('button', { name: 'Sign out' });
    expect(button).toHaveClass('w-full');
    expect(button.querySelector('svg')).not.toBeNull();
    fireEvent.click(button);
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not sign out');
    expect(screen.getByRole('alert')).toHaveClass('px-2', 'text-bad');
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it('forgets on this device which screens were seen, only once signed out', async () => {
    window.localStorage.setItem(seenMarksKey('p-store'), '{"overview":1}');
    const failing: IAuthService = {
      requestCode: () => Promise.resolve(),
      verifyCode: () => Promise.resolve(),
      signOut: () => Promise.reject(new TypeError('Failed to fetch')),
      signOutEverywhere: () => Promise.reject(new TypeError('Failed to fetch')),
    };
    const { unmount } = renderWithMessages(<SignOutButton authService={failing} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(window.localStorage.getItem(seenMarksKey('p-store'))).toBe('{"overview":1}');

    unmount();
    renderWithMessages(<SignOutButton authService={new MockAuthService()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(window.localStorage.getItem(seenMarksKey('p-store'))).toBeNull();
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
    renderWithMessages(<Sidebar admin={ADMIN} project={store()} i18n={english} />);

    const privacy = screen.getByText('No cookies, no personal data');
    expect(privacy).toHaveClass('text-nav-muted');
    expect(privacy).not.toHaveClass('bg-nav-raised');
    expect(screen.getByRole('link', { name: 'Help and support' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Account and preferences')).toBeInTheDocument();
    expect(screen.getByText('owner@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Theme and language', hidden: true })).toHaveAttribute(
      'href',
      '/account/preferences',
    );
    expect(screen.queryByRole('group', { name: 'Language', hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Theme', hidden: true })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out', hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Project settings' })).not.toBeInTheDocument();
  });

  it('links the logo to the overview of the current project, keeping the period and the filters', () => {
    navigation.pathname = '/p-docs/devices';
    navigation.search = 'range=7d&device=mobile&tab=events';
    renderWithMessages(<Sidebar admin={ADMIN} project={docs()} i18n={english} />);
    navigation.pathname = '/p-store/overview';
    navigation.search = 'range=7d&tab=events';

    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      '/p-docs/overview?range=7d&device=mobile',
    );
  });

  it('becomes the main navigation inside the menu, with the menu bar', () => {
    renderWithMessages(
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
        <Sidebar admin={ADMIN} project={store()} i18n={english} />
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
  it('names the project in its bar, linking its overview with the period and the filters', () => {
    navigation.search = 'from=2026-10-01&to=2026-10-10&device=mobile&tab=events';
    renderWithMessages(
      <MobileMenu project={docs()} homeLabel="Overview · Demo Docs">
        <span>menu</span>
      </MobileMenu>,
    );
    navigation.search = 'range=7d&tab=events';

    const home = screen.getByRole('link', { name: 'Overview · Demo Docs' });
    expect(home).toHaveTextContent('DDDemo Docs');
    expect(within(home).getByText('Demo Docs')).toHaveClass('truncate');
    expect(home).toHaveAttribute(
      'href',
      '/p-docs/overview?from=2026-10-01&to=2026-10-10&device=mobile',
    );
  });

  it('closes when its logo is followed, even to the address it is already on', () => {
    renderWithMessages(
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
        <span>menu</span>
      </MobileMenu>,
    );
    const logo = screen.getByRole('link', { name: STORE_HOME });

    fireEvent.click(logo);
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(logo);

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(document.getElementById('main-navigation')).toHaveClass('hidden');
  });

  it('marks its button with a dot, and says so, when another screen has news', () => {
    renderWithMessages(
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
        <span>menu</span>
      </MobileMenu>,
    );
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle.querySelector('.rounded-full')).toBeNull();

    act(() => {
      publishArrivalNews({ visits: { shown: '2', label: '2 new visits' } });
    });

    expect(screen.getByRole('button', { name: 'Open menu, there is news' })).toBe(toggle);
    expect(toggle.querySelector('.rounded-full')).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(toggle);

    expect(screen.getByRole('button', { name: 'Close menu' })).toBe(toggle);
    expect(toggle.querySelector('.rounded-full')).toBeNull();

    act(() => {
      publishArrivalNews({});
    });
  });

  it('opens and closes the navigation, and closes after a link is followed', () => {
    renderWithMessages(
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
        <a href="#overview">Overview</a>
      </MobileMenu>,
    );

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('closes when the query changes, as with a period link or Back', () => {
    const { rerender } = renderOpenMenu();

    navigation.search = 'range=30d';
    rerender(
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
      <MobileMenu project={store()} homeLabel={STORE_HOME}>
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
        t={english.t}
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
        t={english.t}
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
        t={english.t}
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
        t={english.t}
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
        t={english.t}
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
        t={english.t}
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
