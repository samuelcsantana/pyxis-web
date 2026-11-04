import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/i18n/locales';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { ptBR } from '@/i18n/messages/pt-BR';
import type { SettingsDialogContent } from './settings-section-content';
import type { SettingsSection } from './settings-sections';

interface Deferred {
  readonly promise: Promise<SettingsDialogContent>;
  readonly resolve: (content: SettingsDialogContent) => void;
  readonly reject: (reason: Error) => void;
}

function deferred(): Deferred {
  let resolve: Deferred['resolve'] = () => undefined;
  let reject: Deferred['reject'] = () => undefined;
  const promise = new Promise<SettingsDialogContent>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

const content = vi.hoisted(() => ({
  answers: [] as Deferred[],
  forgotten: 0,
}));

function load(): Promise<SettingsDialogContent> {
  const answer = deferred();
  content.answers.push(answer);
  return answer.promise;
}

vi.mock('./settings-content-cache', () => ({
  settingsContentOf: () => new Promise(() => undefined),
  forgetSettingsContent: () => {
    content.forgotten += 1;
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/p1/overview',
  useSearchParams: () => new URLSearchParams(),
}));

const INSTALL_PAGE = '/p1/install';
const VISITS_PAGE = '/p1/visits';

const EVERY_SECTION_BUT_DATA: readonly SettingsSection[] = [
  'general',
  'billing',
  'security',
  'tokens',
  'apps',
  'install',
  'project',
  'privacy',
  'keys',
  'people',
  'email',
  'help',
];

const READY: SettingsDialogContent = {
  sections: EVERY_SECTION_BUT_DATA,
  content: {
    general: <p>The general settings</p>,
    keys: (
      <div>
        <p>The keys</p>
        <a href={INSTALL_PAGE}>the install guide</a>
        <a
          href={VISITS_PAGE}
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          the visits
        </a>
        <span>plain words</span>
      </div>
    ),
    install: <p>The install guide</p>,
  },
};

type Dialog = typeof import('./settings-dialog');
type Location = typeof import('./settings-location');
type Provider = typeof import('@/i18n/messages-provider');
let dialogModule: Dialog;
let location: Location;
let provider: Provider;

function Messages({ locale, children }: { readonly locale: Locale; readonly children: ReactNode }) {
  const messages = pickNamespaces(locale === 'en' ? en : ptBR, CLIENT_NAMESPACES);
  const { MessagesProvider } = provider;
  return (
    <MessagesProvider locale={locale} messages={messages}>
      {children}
    </MessagesProvider>
  );
}

function renderDialog(locale: Locale = 'en') {
  const { SettingsDialog } = dialogModule;
  const view = render(
    <Messages locale={locale}>
      <SettingsDialog projectId="p1" projectName="Demo Store" loadContent={load} />
    </Messages>,
  );
  const rerenderIn = (next: Locale) => {
    view.rerender(
      <Messages locale={next}>
        <SettingsDialog projectId="p1" projectName="Demo Store" loadContent={load} />
      </Messages>,
    );
  };
  return { ...view, rerenderIn };
}

function dialog(): HTMLDialogElement {
  const element = document.querySelector('dialog');
  if (element === null) {
    throw new Error('no dialog');
  }
  return element;
}

function answerWith(value: SettingsDialogContent) {
  const answer = content.answers.at(-1);
  if (answer === undefined) {
    throw new Error('nothing was asked');
  }
  act(() => {
    answer.resolve(value);
  });
}

async function shownReady() {
  answerWith(READY);
  await screen.findByText(/^The /);
}

beforeEach(async () => {
  window.history.replaceState(null, '', '/p1/overview');
  content.answers = [];
  content.forgotten = 0;
  vi.resetModules();
  provider = await import('@/i18n/messages-provider');
  location = await import('./settings-location');
  dialogModule = await import('./settings-dialog');
});

afterEach(() => {
  window.history.replaceState(null, '', '/p1/overview');
});

describe('SettingsDialog', () => {
  it('stays closed and asks for nothing while the address does not ask for the settings', () => {
    renderDialog();

    expect(dialog().open).toBe(false);
    expect(content.answers).toHaveLength(0);
  });

  it('opens on the section the address asks for, waiting for its content, then showing it', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/keys');
    renderDialog();

    expect(dialog().open).toBe(true);
    expect(dialog()).toHaveAccessibleName('Settings');
    expect(screen.getByRole('status')).toHaveTextContent('Loading settings…');
    const sections = screen.getByRole('navigation', { name: 'Settings sections' });
    expect(within(sections).getByRole('link', { name: 'Export and delete' })).toBeInTheDocument();

    await shownReady();

    expect(screen.getByText('The keys')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Keys' })).toHaveClass('sr-only');
    expect(within(sections).getByRole('link', { name: 'Keys' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(sections).queryByRole('link', { name: 'Export and delete' })).toBeNull();
    expect(within(sections).getByText('Demo Store')).toBeInTheDocument();
  });

  it('moves to another section in place, from its top', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/keys');
    renderDialog();
    await shownReady();
    const scroller = screen.getByText('The keys').closest('.overflow-y-auto');
    if (!(scroller instanceof HTMLElement)) {
      throw new Error('no scroller');
    }
    scroller.scrollTop = 120;
    const steps = window.history.length;

    fireEvent.click(screen.getByRole('link', { name: 'General' }));

    expect(window.location.hash).toBe('#settings/general');
    expect(window.history.length).toBe(steps);
    expect(screen.getByText('The general settings')).toBeInTheDocument();
    expect(scroller.scrollTop).toBe(0);
  });

  it('says when the content could not be loaded, and loads it again on asking', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/general');
    renderDialog();

    act(() => {
      content.answers.at(-1)?.reject(new Error('offline'));
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('The settings could not be loaded.');
    fireEvent.click(within(alert).getByRole('button', { name: 'Try again' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(content.answers).toHaveLength(2);
    await shownReady();
    expect(screen.getByText('The general settings')).toBeInTheDocument();
  });

  it('closes on Escape and gives the focus back to what opened it', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    renderDialog();
    act(() => {
      location.openSettings('general', opener);
    });
    expect(dialog().open).toBe(true);

    const escape = new Event('cancel', { cancelable: true });
    act(() => {
      dialog().dispatchEvent(escape);
    });

    expect(escape.defaultPrevented).toBe(true);
    await waitFor(() => {
      expect(dialog().open).toBe(false);
    });
    expect(document.activeElement).toBe(opener);
    expect(content.forgotten).toBeGreaterThan(0);
    opener.remove();
  });

  it('closes with its button or a click on the backdrop, not a click inside', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/general');
    renderDialog();
    await shownReady();

    fireEvent.click(screen.getByText('The general settings'));
    expect(dialog().open).toBe(true);
    fireEvent.click(dialog());
    expect(dialog().open).toBe(false);

    act(() => {
      location.openSettings('general');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close settings' }));
    await waitFor(() => {
      expect(dialog().open).toBe(false);
    });
  });

  it('lists every section on its own, and goes back to the list from a section', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings');
    renderDialog();
    await shownReady();

    expect(screen.queryByRole('button', { name: 'All settings' })).toBeNull();
    expect(document.querySelector('[aria-current]')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).not.toHaveClass(
      'max-sm:hidden',
    );

    fireEvent.click(screen.getByRole('link', { name: 'Keys' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toHaveClass(
      'max-sm:hidden',
    );
    fireEvent.click(screen.getByRole('button', { name: 'All settings' }));

    expect(window.location.hash).toBe('#settings');
  });

  it('opens the section of a link to an old page instead of leaving, unless asked to leave', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/keys');
    renderDialog();
    await shownReady();
    const install = screen.getByRole('link', { name: 'the install guide' });

    for (const modifier of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }]) {
      fireEvent.click(install, modifier);
      expect(window.location.hash).toBe('#settings/keys');
    }
    window.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
      },
      { once: true, capture: true },
    );
    fireEvent.click(install);
    expect(window.location.hash).toBe('#settings/keys');

    fireEvent.click(screen.getByText('plain words'));
    screen
      .getByText('plain words')
      .firstChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fireEvent.click(screen.getByRole('link', { name: 'the visits' }));
    expect(window.location.hash).toBe('#settings/keys');

    fireEvent.click(install);
    expect(window.location.hash).toBe('#settings/install');
    expect(screen.getByText('The install guide')).toBeInTheDocument();
  });

  it('closes in place after the language changed while it was open', async () => {
    const { rerenderIn } = renderDialog('en');
    act(() => {
      location.openSettings('general');
    });
    await shownReady();

    rerenderIn('pt-BR');
    await screen.findByRole('navigation', { name: 'Seções das configurações' });
    answerWith(READY);
    const steps = window.history.length;
    fireEvent.click(screen.getByRole('button', { name: 'Fechar configurações' }));

    expect(dialog().open).toBe(false);
    expect(window.history.length).toBe(steps);
  });

  it('ignores an answer that arrives after it was closed', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/general');
    const { unmount } = renderDialog();
    const [late] = content.answers;
    unmount();

    late?.resolve(READY);
    await Promise.resolve();

    window.history.replaceState(null, '', '/p1/overview#settings/general');
    const second = renderDialog();
    const [, failing] = content.answers;
    second.unmount();
    failing?.reject(new Error('late'));
    await Promise.resolve();
    expect(content.answers).toHaveLength(2);
  });
});
