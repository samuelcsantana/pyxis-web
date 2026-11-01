import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_PROJECT } from '@/test-utils/project-choices';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { publishArrivalNews } from './arrival-news';
import { PHONE_ACCOUNT_ID, PhoneBar } from './phone-bar';
import { InPhoneBar, PhoneBarSlotsProvider } from './phone-bar-slots';

const navigation = vi.hoisted(() => ({ pathname: '/p1/overview', search: 'range=7d' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
  useSelectedLayoutSegments: () => [],
}));

const assign = vi.fn();

beforeEach(() => {
  navigation.pathname = '/p1/overview';
  navigation.search = 'range=7d';
  assign.mockClear();
  vi.stubGlobal('location', { assign });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function bar() {
  return (
    <PhoneBarSlotsProvider>
      <PhoneBar project={TEST_PROJECT} />
      <InPhoneBar slot="period">
        <a href="#thirty-days">30 days</a>
      </InPhoneBar>
      <InPhoneBar slot="filters">
        <p>Country: Brazil</p>
      </InPhoneBar>
      {navigation.pathname.endsWith('/overview') ? (
        <InPhoneBar slot="periodLabel">7 days</InPhoneBar>
      ) : null}
    </PhoneBarSlotsProvider>
  );
}

function renderBar() {
  return renderWithMessages(bar());
}

function barButton(name: string | RegExp): HTMLElement {
  return within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', {
    name,
  });
}

function sheet(name: string): HTMLElement {
  return screen.getByRole('dialog', { name });
}

describe('PhoneBar', () => {
  it('is the main navigation, with Screens, Period, Filters and Account, every sheet closed', () => {
    renderBar();

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(navigation).toHaveClass('fixed', 'bottom-0', 'lg:hidden');
    for (const name of ['Screens', /^Period/, 'Filters']) {
      expect(barButton(name)).toHaveAttribute('aria-expanded', 'false');
    }
    expect(within(navigation).getByRole('link', { name: 'Account' })).toHaveAttribute(
      'id',
      PHONE_ACCOUNT_ID,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the screens, Install and Settings in a sheet, and closes it with its button', () => {
    renderBar();

    fireEvent.click(barButton('Screens'));

    const screens = sheet('Screens');
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'true');
    expect(within(screens).getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(screens).getByRole('link', { name: 'Install' })).toBeInTheDocument();
    expect(within(screens).getByRole('link', { name: 'Settings' })).toBeInTheDocument();

    fireEvent.click(barButton('Screens'));

    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('marks Screens with a dot, and says so, when another screen has news', () => {
    renderBar();
    expect(barButton('Screens').querySelector('.rounded-full')).toBeNull();

    act(() => {
      publishArrivalNews({ visits: { shown: '2', label: '2 new visits' } });
    });

    const screens = barButton('Screens, there is news');
    expect(screens.querySelector('.rounded-full')).toHaveAttribute('aria-hidden', 'true');

    act(() => {
      publishArrivalNews({});
    });
  });

  it('names the period in force on its button, or only says Period on a page without one', () => {
    const { rerender } = renderBar();
    expect(barButton('Period 7 days')).toHaveTextContent('7 days');

    navigation.pathname = '/p1/settings';
    rerender(bar());
    expect(barButton('Period')).toBeDisabled();
  });

  it('opens the period of the screen in its sheet, held there only while it is open', () => {
    renderBar();
    expect(screen.queryByRole('link', { name: '30 days' })).not.toBeInTheDocument();

    fireEvent.click(barButton(/^Period/));

    expect(within(sheet('Period')).getByRole('link', { name: '30 days' })).toBeInTheDocument();

    fireEvent.click(barButton(/^Period/));

    expect(screen.queryByRole('link', { name: '30 days' })).not.toBeInTheDocument();
  });

  it('says there is no filter in its sheet, or holds the filters of the screen', () => {
    const { rerender } = renderBar();

    fireEvent.click(barButton('Filters'));

    expect(
      within(sheet('Filters')).getByText(
        'No filters. Tap a row in a table (a country, a source) to filter every screen.',
      ),
    ).toBeInTheDocument();
    expect(within(sheet('Filters')).getByText('Country: Brazil')).toBeInTheDocument();

    navigation.search = 'range=7d&country=BR&device=mobile&source= ';
    rerender(bar());

    const filters = barButton('Filters, 2');
    expect(within(filters).getByText('2')).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(filters);
    expect(within(sheet('Filters')).queryByText(/No filters/)).not.toBeInTheDocument();
  });

  it('turns off the period on the timeline and on pages, and the filters on visits too', () => {
    navigation.pathname = '/p1/timeline';
    const { rerender } = renderBar();
    expect(barButton(/^Period/)).toBeDisabled();
    expect(barButton('Filters')).toBeDisabled();

    navigation.pathname = '/p1/visits';
    rerender(bar());
    expect(barButton(/^Period/)).toBeEnabled();
    expect(barButton('Filters')).toBeDisabled();

    navigation.pathname = '/p1/settings';
    rerender(bar());
    expect(barButton(/^Period/)).toBeDisabled();
    expect(barButton('Filters')).toBeDisabled();
    expect(barButton('Screens')).toBeEnabled();
  });

  it('closes on Escape', () => {
    renderBar();
    fireEvent.click(barButton('Screens'));

    fireEvent(sheet('Screens'), new Event('cancel', { cancelable: true }));

    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays open while the address stays, closes when it changes, and stays closed coming back', () => {
    const { rerender } = renderBar();
    fireEvent.click(barButton('Screens'));

    rerender(bar());
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'true');

    navigation.search = 'range=30d';
    rerender(bar());
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');

    navigation.search = 'range=7d';
    rerender(bar());
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(barButton('Screens'));
    navigation.pathname = '/p1/funnel';
    rerender(bar());
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes its sheet when the window grows to a laptop, where the bar is gone', () => {
    let changed = () => undefined as unknown;
    const laptop = { matches: false };
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          get matches() {
            return laptop.matches;
          },
          media: query,
          onchange: null,
          addEventListener: (_: string, listener: () => void) => {
            changed = listener;
          },
          removeEventListener: vi.fn(),
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    );
    const { unmount } = renderBar();
    fireEvent.click(barButton('Screens'));

    act(() => {
      changed();
    });
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'true');

    laptop.matches = true;
    act(() => {
      changed();
    });
    expect(barButton('Screens')).toHaveAttribute('aria-expanded', 'false');
    unmount();
  });

  it('opens Account as the settings window on its list, keeping the view of the screen', () => {
    navigation.search = 'range=7d&device=mobile&tab=events';
    renderBar();

    const account = screen.getByRole('link', { name: 'Account' });
    expect(account).toHaveAttribute('href', '/p1/settings?range=7d&device=mobile');
    expect(account).not.toHaveAttribute('aria-current');

    fireEvent.click(account);
    expect(assign).not.toHaveBeenCalled();
  });

  it('marks Account where the settings are a page, and reloads it there', () => {
    navigation.pathname = '/p1/settings/keys';
    navigation.search = '';
    renderBar();

    const account = screen.getByRole('link', { name: 'Account' });
    fireEvent.click(account);

    expect(account).toHaveAttribute('aria-current', 'page');
    expect(assign).toHaveBeenCalledWith('/p1/settings');
  });
});
