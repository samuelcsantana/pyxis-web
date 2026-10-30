import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { type ReactNode, StrictMode } from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { FrameRoot, WINDOW_TITLE_ID } from './frame-view';
import {
  ACCOUNT_WINDOW_SEGMENT,
  initialViewOf,
  isWindowAddress,
  PROJECT_WINDOW_SEGMENT,
  SettingsWindowHost,
} from './settings-window-host';

const navigation = vi.hoisted(() => ({
  pathname: '/p-store/settings/keys',
  segments: ['(.)settings', 'keys'] as readonly string[],
  router: { back: vi.fn() },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => navigation.router,
  useSelectedLayoutSegments: () => navigation.segments,
}));

const PHONE_WIDTH = '(width < 64rem)';
const OVERVIEW_HREF = '/p-store/overview?range=7d&tab=events';

const added: Element[] = [];

function onThePage<T extends Element>(element: T): T {
  document.body.append(element);
  added.push(element);
  return element;
}

function linkOnThePage(href: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = 'Overview';
  return onThePage(link);
}

function buttonOnThePage(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Settings';
  return onThePage(button);
}

function drawingOnThePage(): SVGSVGElement {
  const drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  drawing.setAttribute('tabindex', '0');
  return onThePage(drawing);
}

beforeAll(async () => {
  render(<SettingsWindowHost closeLabel="Close">{null}</SettingsWindowHost>);
  await screen.findByRole('button', { name: 'Close' });
  cleanup();
});

const NOT_RENDERED = [] as unknown as DOMRectList;
const RENDERED = [new DOMRect(0, 0, 10, 10)] as unknown as DOMRectList;

function menuToggleOnThePage(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Open menu';
  button.setAttribute('aria-controls', 'main-navigation');
  return onThePage(button);
}

function hiddenMenuWith<T extends Element>(element: T): T {
  const menu = document.createElement('div');
  menu.id = 'main-navigation';
  menu.hidden = true;
  menu.append(element);
  onThePage(menu);
  return element;
}

beforeEach(() => {
  vi.spyOn(Element.prototype, 'getClientRects').mockImplementation(function rects(this: Element) {
    return this.closest('[hidden]') === null ? RENDERED : NOT_RENDERED;
  });
  navigation.pathname = '/p-store/settings/keys';
  navigation.segments = ['(.)settings', 'keys'];
  navigation.router.back.mockReset();
});

afterEach(() => {
  for (const element of added.splice(0)) {
    element.remove();
  }
});

interface WindowContentProps {
  readonly section?: string;
}

function WindowContent({ section = 'Keys' }: WindowContentProps) {
  return (
    <>
      <h2 id={WINDOW_TITLE_ID} tabIndex={-1}>
        Settings
      </h2>
      <p>Public keys of Demo Store</p>
      <h2 tabIndex={-1} data-section-title="">
        {section}
      </h2>
    </>
  );
}

interface WindowProps {
  readonly children?: ReactNode;
}

function Window({ children = <WindowContent /> }: WindowProps) {
  return <SettingsWindowHost closeLabel="Close">{children}</SettingsWindowHost>;
}

function settingsWindow(): HTMLDialogElement {
  const dialog = document.querySelector('dialog');
  if (dialog === null) {
    throw new Error('no settings window rendered');
  }
  return dialog;
}

function frameRoot(): HTMLElement {
  const root = settingsWindow().querySelector<HTMLElement>('[data-view]');
  if (root === null) {
    throw new Error('no frame root rendered');
  }
  return root;
}

function windowTitle(): HTMLElement {
  return screen.getByRole('heading', { name: 'Settings' });
}

function sectionTitle(name = 'Keys'): HTMLElement {
  return screen.getByRole('heading', { name });
}

function closeButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Close' });
}

function pressEscape(): boolean {
  return fireEvent(settingsWindow(), new Event('cancel', { cancelable: true }));
}

function onAPhone() {
  return vi
    .spyOn(window, 'matchMedia')
    .mockImplementation((query) => ({ matches: query === PHONE_WIDTH }) as MediaQueryList);
}

function onALaptop() {
  return vi
    .spyOn(window, 'matchMedia')
    .mockImplementation(() => ({ matches: false }) as MediaQueryList);
}

describe('initialViewOf', () => {
  it('opens on the list only for the bare project settings window', () => {
    expect(initialViewOf([PROJECT_WINDOW_SEGMENT])).toBe('list');
  });

  it('opens on the section for any other address', () => {
    expect(initialViewOf([PROJECT_WINDOW_SEGMENT, 'keys'])).toBe('section');
    expect(initialViewOf([ACCOUNT_WINDOW_SEGMENT])).toBe('section');
    expect(initialViewOf([ACCOUNT_WINDOW_SEGMENT, 'sessions'])).toBe('section');
    expect(initialViewOf(['overview'])).toBe('section');
    expect(initialViewOf([])).toBe('section');
  });
});

describe('isWindowAddress', () => {
  it('knows the addresses of the settings window', () => {
    expect(isWindowAddress('/p-store/settings')).toBe(true);
    expect(isWindowAddress('/p-store/settings/keys')).toBe(true);
    expect(isWindowAddress('/account/sessions')).toBe(true);
  });

  it('knows that a screen, an export or the home are not the window', () => {
    expect(isWindowAddress('/p-store/overview')).toBe(false);
    expect(isWindowAddress('/p-store/exports/e1')).toBe(false);
    expect(isWindowAddress('/')).toBe(false);
  });
});

describe('SettingsWindowHost', () => {
  it('draws nothing when the slot still holds a window but a link inside it left for another page', () => {
    navigation.pathname = '/p-store/exports/e1';

    render(<Window />);

    expect(document.querySelector('dialog')).toBeNull();
    expect(screen.queryByText('Public keys of Demo Store')).toBeNull();
  });

  it('renders its children alone when no window segment is selected', () => {
    navigation.segments = [];

    render(<Window />);

    expect(document.querySelector('dialog')).toBeNull();
    expect(screen.getByText('Public keys of Demo Store')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('renders its children alone when the selected segment is not a window', () => {
    navigation.segments = ['__DEFAULT__'];

    render(<Window>{null}</Window>);

    expect(document.querySelector('dialog')).toBeNull();
  });

  it('opens the project settings as a modal window named by the window title', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    render(<Window />);

    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toBe(settingsWindow());
    expect(dialog).toHaveAttribute('data-settings-window');
    expect(dialog).toHaveAttribute('aria-labelledby', 'settings-window-title');
    expect(settingsWindow().open).toBe(true);
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog).toContainElement(screen.getByText('Public keys of Demo Store'));
  });

  it('opens the account sections as the same window', () => {
    navigation.pathname = '/account/tokens';
    navigation.segments = [ACCOUNT_WINDOW_SEGMENT, 'tokens'];

    render(<Window />);

    expect(settingsWindow()).toHaveAttribute('data-settings-window');
    expect(settingsWindow().open).toBe(true);
  });

  it('gives its frame a view that starts on the list for the bare project settings', () => {
    navigation.pathname = '/p-store/settings';
    navigation.segments = [PROJECT_WINDOW_SEGMENT];

    render(
      <Window>
        <FrameRoot className="flex">
          <WindowContent section="Project" />
        </FrameRoot>
      </Window>,
    );

    expect(frameRoot()).toHaveAttribute('data-view', 'list');
  });

  it('gives its frame a view that starts on the section for a section address', () => {
    render(
      <Window>
        <FrameRoot className="flex">
          <WindowContent />
        </FrameRoot>
      </Window>,
    );

    expect(frameRoot()).toHaveAttribute('data-view', 'section');
  });

  it('goes back once when Escape cancels the window, even if Escape comes twice', () => {
    render(<Window />);

    expect(pressEscape()).toBe(false);
    pressEscape();

    expect(navigation.router.back).toHaveBeenCalledTimes(1);
  });

  it('stays open when the click lands inside the window', () => {
    render(<Window />);

    fireEvent.click(screen.getByText('Public keys of Demo Store'));
    fireEvent.click(sectionTitle());

    expect(navigation.router.back).not.toHaveBeenCalled();
  });

  it('goes back when the click lands on the window itself, outside its content', () => {
    render(<Window />);

    fireEvent.pointerDown(settingsWindow());
    fireEvent.click(settingsWindow());

    expect(navigation.router.back).toHaveBeenCalledTimes(1);
  });

  it('stays open when a drag that started inside the window ends outside it', () => {
    render(<Window />);

    fireEvent.pointerDown(screen.getByText('Public keys of Demo Store'));
    fireEvent.click(settingsWindow());

    expect(navigation.router.back).not.toHaveBeenCalled();
  });

  it('goes back once from the close button, named by the close label', () => {
    render(<Window />);

    expect(closeButton()).toHaveAttribute('type', 'button');
    expect(settingsWindow()).toContainElement(closeButton());
    fireEvent.click(closeButton());
    fireEvent.click(closeButton());
    fireEvent.click(settingsWindow());

    expect(navigation.router.back).toHaveBeenCalledTimes(1);
  });

  it('focuses the section title when it opens on a section, without asking the width', () => {
    const matchMedia = onAPhone();

    render(<Window />);

    expect(sectionTitle()).toHaveFocus();
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('focuses the window title when it opens on the list of a phone', () => {
    navigation.pathname = '/p-store/settings';
    navigation.segments = [PROJECT_WINDOW_SEGMENT];
    const matchMedia = onAPhone();

    render(<Window />);

    expect(windowTitle()).toHaveFocus();
    expect(matchMedia).toHaveBeenCalledWith(PHONE_WIDTH);
  });

  it('focuses the section title when it opens on the list of a laptop, where both show', () => {
    navigation.pathname = '/p-store/settings';
    navigation.segments = [PROJECT_WINDOW_SEGMENT];
    onALaptop();

    render(<Window />);

    expect(sectionTitle()).toHaveFocus();
  });

  it('opens without moving focus when its content has no title', () => {
    render(
      <Window>
        <p>Loading</p>
      </Window>,
    );

    expect(settingsWindow().open).toBe(true);
    expect(document.body).toHaveFocus();
  });

  it('focuses the title of the new section when the address changes inside the window', () => {
    navigation.pathname = '/p-store/settings';
    navigation.segments = [PROJECT_WINDOW_SEGMENT];
    onAPhone();
    const { rerender } = render(<Window />);
    expect(windowTitle()).toHaveFocus();

    navigation.pathname = '/p-store/settings/people';
    navigation.segments = [PROJECT_WINDOW_SEGMENT, 'people'];
    rerender(
      <Window>
        <WindowContent section="People" />
      </Window>,
    );
    expect(sectionTitle('People')).toHaveFocus();

    closeButton().focus();
    navigation.pathname = '/p-store/settings';
    navigation.segments = [PROJECT_WINDOW_SEGMENT];
    rerender(
      <Window>
        <WindowContent section="Project" />
      </Window>,
    );
    expect(sectionTitle('Project')).toHaveFocus();
  });

  it('leaves focus alone when it renders again for the same address', () => {
    const { rerender } = render(<Window />);
    closeButton().focus();

    rerender(
      <Window>
        <WindowContent section="Keys" />
      </Window>,
    );

    expect(closeButton()).toHaveFocus();
  });

  it('returns focus to the element that opened it when it closes', () => {
    const opener = linkOnThePage(OVERVIEW_HREF);
    opener.focus();
    const { unmount } = render(<Window />);
    expect(sectionTitle()).toHaveFocus();

    unmount();

    expect(opener).toHaveFocus();
  });

  it('returns focus to the opener when the address leaves the window', () => {
    navigation.segments = [];
    const { rerender } = render(<Window>{null}</Window>);
    const opener = linkOnThePage(OVERVIEW_HREF);
    opener.focus();

    navigation.segments = [PROJECT_WINDOW_SEGMENT, 'keys'];
    rerender(<Window />);
    expect(settingsWindow().open).toBe(true);
    expect(sectionTitle()).toHaveFocus();

    navigation.segments = [];
    rerender(<Window>{null}</Window>);

    expect(document.querySelector('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  it('returns focus to a link with the same address when the opener is gone', () => {
    const opener = linkOnThePage(OVERVIEW_HREF);
    opener.focus();
    const { unmount } = render(<Window />);
    opener.remove();
    linkOnThePage('/p-store/settings');
    const sameAddress = linkOnThePage(OVERVIEW_HREF);

    unmount();

    expect(sameAddress).toHaveFocus();
  });

  it('leaves focus on the page when the opener is gone and no link has its address', () => {
    const opener = linkOnThePage(OVERVIEW_HREF);
    opener.focus();
    const { unmount } = render(<Window />);
    opener.remove();
    const other = linkOnThePage('/p-store/settings');

    unmount();

    expect(document.body).toHaveFocus();
    expect(other).not.toHaveFocus();
  });

  it('returns focus to the menu button when the opener sat in the phone menu, now hidden', () => {
    const toggle = menuToggleOnThePage();
    const opener = hiddenMenuWith(linkOnThePage(OVERVIEW_HREF));
    opener.focus();
    const { unmount } = render(<Window />);

    unmount();

    expect(toggle).toHaveFocus();
  });

  it('returns focus to the menu button when nothing had focus before it opened', () => {
    const toggle = menuToggleOnThePage();
    const { unmount } = render(<Window />);

    unmount();

    expect(toggle).toHaveFocus();
  });

  it('returns focus to an opener without an address while it is still on the page', () => {
    const opener = buttonOnThePage();
    opener.focus();
    const { unmount } = render(<Window />);

    unmount();

    expect(opener).toHaveFocus();
  });

  it('leaves focus on the page when the opener had no address and is gone', () => {
    const opener = buttonOnThePage();
    opener.focus();
    const { unmount } = render(<Window />);
    opener.remove();
    const link = linkOnThePage(OVERVIEW_HREF);

    unmount();

    expect(document.body).toHaveFocus();
    expect(link).not.toHaveFocus();
  });

  it('does not return focus when what had focus before was not an HTML element', () => {
    const drawing = drawingOnThePage();
    drawing.focus();
    expect(document.activeElement).toBe(drawing);
    const { unmount } = render(<Window />);

    unmount();

    expect(document.activeElement).not.toBe(drawing);
    expect(document.body).toHaveFocus();
  });

  it('keeps the opener of the first run when strict mode runs its effects twice', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const opener = linkOnThePage(OVERVIEW_HREF);
    opener.focus();
    const { unmount } = render(
      <StrictMode>
        <Window />
      </StrictMode>,
    );
    expect(showModal).toHaveBeenCalledTimes(2);
    expect(settingsWindow().open).toBe(true);
    sectionTitle().focus();

    unmount();

    expect(opener).toHaveFocus();
    expect(navigation.router.back).not.toHaveBeenCalled();
  });
});
