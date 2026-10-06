import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { presetPeriod } from '@/domain/period';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { MobileMenu } from './mobile-menu';
import { PeriodSelector } from './period-selector';
import { ProjectSwitcher } from './project-switcher';
import { periodParameters, screenHref, screenOf } from './screens';
import { Sidebar } from './sidebar';
import { SidebarNav } from './sidebar-nav';
import { SIGN_OUT_MIN_BUSY_MS, SignOutButton } from './sign-out-button';
import { Topbar } from './topbar';

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

  it('read the screen of a path', () => {
    expect(screenOf('/p1/overview')).toBe('overview');
    expect(screenOf('/')).toBeUndefined();
  });
});

describe('SidebarNav', () => {
  it('links the available screen with the period and marks it current', () => {
    render(<SidebarNav projectId="p-store" />);

    const overview = screen.getByRole('link', { name: 'Overview' });

    expect(overview).toHaveAttribute('href', '/p-store/overview?range=7d');
    expect(overview).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Devices' })).toHaveAttribute(
      'href',
      '/p-store/devices?range=7d',
    );
    expect(screen.getByRole('link', { name: 'Devices' })).not.toHaveAttribute('aria-current');
  });

  it('shows the screens still to come without linking them', () => {
    render(<SidebarNav projectId="p-store" />);

    expect(screen.getAllByRole('link')).toHaveLength(6);
    expect(screen.getByText('Timeline').closest('[aria-disabled="true"]')).not.toBeNull();
    expect(screen.getAllByText('Soon')).toHaveLength(1);
  });

  it('marks nothing current on another screen', () => {
    navigation.pathname = '/p-store/settings';
    render(<SidebarNav projectId="p-store" />);
    navigation.pathname = '/p-store/overview';

    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });
});

describe('ProjectSwitcher', () => {
  it('names the current project and links every project on the same screen and period', () => {
    render(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);

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

  it('closes after a project is chosen', () => {
    const { container } = render(
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

  it('falls back to the first screen from a path without one', () => {
    navigation.pathname = '/p-store';
    render(<ProjectSwitcher projects={ADMIN.projects} currentProject={store()} />);
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
    render(<SignOutButton authService={new MockAuthService()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(screen.getByRole('button', { name: 'Signing out…' })).toBeDisabled();
    await settle(SIGN_OUT_MIN_BUSY_MS);
    expect(navigation.router.replace).toHaveBeenCalledWith('/sign-in');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('stays and says so when signing out fails', async () => {
    const failing: IAuthService = {
      requestCode: () => Promise.resolve(),
      verifyCode: () => Promise.resolve(),
      signOut: () => Promise.reject(new TypeError('Failed to fetch')),
    };
    render(<SignOutButton authService={failing} variant="page" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not sign out');
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it('builds its own service when none is given', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(navigation.router.replace).toHaveBeenCalledWith('/sign-in');
  });

  it('does not navigate once it is gone', async () => {
    const { unmount } = render(<SignOutButton authService={new MockAuthService()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    unmount();
    await settle(SIGN_OUT_MIN_BUSY_MS);

    expect(navigation.router.replace).not.toHaveBeenCalled();
  });
});

describe('Sidebar', () => {
  it('holds the project switcher, the screens, the privacy note and the account', () => {
    render(<Sidebar admin={ADMIN} project={store()} />);

    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(within(sidebar).getByText('Privacy-first')).toBeInTheDocument();
    expect(within(sidebar).getByText('owner@demo-store.example')).toBeInTheDocument();
    expect(within(sidebar).getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(within(sidebar).getByRole('link', { name: 'Overview' })).toBeInTheDocument();
  });
});

describe('MobileMenu', () => {
  it('opens and closes the navigation, and closes after a link is followed', () => {
    render(
      <MobileMenu>
        <a href="/p-store/overview">Overview</a>
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
    render(
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
});

describe('PeriodSelector', () => {
  const today = '2026-10-05';

  it('links each preset and marks the current one', () => {
    render(
      <PeriodSelector basePath="/p1/overview" period={presetPeriod('7d', today)} today={today} />,
    );

    const presets = within(screen.getByRole('navigation', { name: 'Period' }));

    expect(presets.getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p1/overview?range=today',
    );
    expect(presets.getByRole('link', { name: '7 days' })).toHaveAttribute('aria-current', 'true');
    expect(presets.getByRole('link', { name: '30 days' })).not.toHaveAttribute('aria-current');
  });

  it('offers a plain form for a custom period, closed until asked for', () => {
    const { container } = render(
      <PeriodSelector
        basePath="/p1/overview"
        period={{ preset: 'custom', from: '2026-08-01', to: '2026-08-31' }}
        today={today}
      />,
    );

    const form = container.querySelector('form');

    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(form).toHaveAttribute('action', '/p1/overview');
    expect(form).toHaveAttribute('method', 'get');
    expect(screen.getByLabelText('From')).toHaveValue('2026-08-01');
    expect(screen.getByLabelText('To')).toHaveAttribute('max', today);
  });
});

describe('PeriodSelector with parameters of the screen', () => {
  it('carries them into every preset and into the custom form', () => {
    const { container } = render(
      <PeriodSelector
        basePath="/p1/features"
        period={presetPeriod('7d', '2026-10-05')}
        today="2026-10-05"
        keep={{ kind: 'screens', q: 'order' }}
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

describe('Topbar', () => {
  it('shows the title, the subtitle and the period in words', () => {
    render(
      <Topbar
        title="Overview"
        subtitle="How Demo Store was used in the period"
        basePath="/p1/overview"
        period={presetPeriod('30d', '2026-10-05')}
        today="2026-10-05"
        theme="dark"
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Sep 6 – Oct 5, 2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });
});
