import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  AllowConnectionOutcome,
  ConnectionRequest,
  DenyConnectionOutcome,
} from '@/domain/connection-requests';
import { connectionRequestResponseSchema } from '@/domain/connection-requests.schema';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { demoConnectionRequestWire } from '@/services/connection-requests/mock-connection-requests-service';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CONSENT_MIN_BUSY_MS, ConsentButtons, type ConsentButtonsProps } from './consent-buttons';
import {
  ConnectionRequestGone,
  ConnectionRequestView,
  DASHBOARD_HOME,
} from './connection-request-view';

const NOW = new Date('2026-10-15T23:00:00.000Z');
const REQUEST = connectionRequestResponseSchema.parse(demoConnectionRequestWire(NOW));
const CLAUDE_REQUEST: ConnectionRequest = {
  ...REQUEST,
  client: { name: 'Claude', host: 'claude.ai' },
  redirect: { host: 'claude.ai', loopback: false },
};
const CALLBACK = 'http://localhost:53682/callback?code=c&state=s';
const SETTINGS = `/${DEMO_STORE.id}/settings`;

const allowNever = () => new Promise<AllowConnectionOutcome>(() => undefined);
const denyNever = () => new Promise<DenyConnectionOutcome>(() => undefined);

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(CONSENT_MIN_BUSY_MS);
  });
}

function renderButtons(props: Partial<ConsentButtonsProps> = {}) {
  return renderWithMessages(
    <ConsentButtons
      app="Claude Code"
      allow={allowNever}
      deny={denyNever}
      limitReached={false}
      settingsHref={SETTINGS}
      {...props}
    />,
  );
}

describe('ConnectionRequestView', () => {
  it('names the app by our name and the host of its document, and lists what it will read', () => {
    renderWithMessages(
      <ConnectionRequestView
        request={REQUEST}
        email="owner@demo-store.example"
        i18n={english}
        allow={allowNever}
        deny={denyNever}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Connect Claude Code to Pyxis?' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Signed in as owner@demo-store.example')).toBeInTheDocument();
    expect(
      screen.getByText('Claude Code (claude.ai) asks to read the numbers of your projects.'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Demo Store',
      'Demo Docs',
    ]);
    expect(screen.getByText('Back to localhost.')).toBeInTheDocument();
    expect(screen.getByText(/The answer goes to a program on this computer/)).toBeInTheDocument();
    expect(
      screen.getByText('If you did not start this just now in Claude Code, choose Cancel.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Allow' })).toBeEnabled();
  });

  it('gives no program warning when the answer goes back to a website', () => {
    renderWithMessages(
      <ConnectionRequestView
        request={CLAUDE_REQUEST}
        email="owner@demo-store.example"
        i18n={english}
        allow={allowNever}
        deny={denyNever}
      />,
    );

    expect(screen.getByText('Back to claude.ai.')).toBeInTheDocument();
    expect(screen.queryByText(/a program on this computer/)).not.toBeInTheDocument();
  });

  it('says the app will read later projects when the admin has none yet', () => {
    renderWithMessages(
      <ConnectionRequestView
        request={{ ...REQUEST, projects: [] }}
        email="new@example.com"
        i18n={english}
        allow={allowNever}
        deny={denyNever}
      />,
    );

    expect(
      screen.getByText('You have no projects yet. It will read the ones you can open later.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('keeps Allow off and points to Settings when ten apps are already connected', () => {
    renderWithMessages(
      <ConnectionRequestView
        request={{ ...REQUEST, connectionLimitReached: true }}
        email="owner@demo-store.example"
        i18n={english}
        allow={allowNever}
        deny={denyNever}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'You already have 10 connected apps, the most you can keep.',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      `/${DEMO_STORE.id}/settings`,
    );
    expect(screen.getByRole('button', { name: 'Allow' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });
});

describe('ConnectionRequestGone', () => {
  it('explains that the request ended and leads back to the dashboard', () => {
    renderWithMessages(<ConnectionRequestGone i18n={english} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'This connection request has ended' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/more than 10 minutes went by/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
      'href',
      DASHBOARD_HOME,
    );
  });
});

describe('ConsentButtons', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('allows, then sends the browser where the API says, and stays off while it leaves', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    const allow = vi.fn(() =>
      Promise.resolve<AllowConnectionOutcome>({ kind: 'redirect', url: CALLBACK }),
    );
    renderButtons({ allow });

    fireEvent.click(screen.getByRole('button', { name: 'Allow' }));
    expect(screen.getByRole('button', { name: 'Allowing…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await settle();

    expect(assign).toHaveBeenCalledWith(CALLBACK);
    expect(screen.getByRole('status')).toHaveTextContent('Going back to Claude Code…');
    expect(screen.getByRole('button', { name: 'Allow' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('cancels, and sends the browser back with the refusal', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    const deny = vi.fn(() =>
      Promise.resolve<DenyConnectionOutcome>({ kind: 'redirect', url: `${CALLBACK}&x=1` }),
    );
    renderButtons({ deny });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Cancelling…' })).toBeDisabled();
    await settle();

    expect(deny).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledWith(`${CALLBACK}&x=1`);
  });

  it('says the request ended when it is gone by the time of the answer, and stops there', async () => {
    renderButtons({ deny: () => Promise.resolve<DenyConnectionOutcome>({ kind: 'gone' }) });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'It was already answered, or more than 10 minutes went by.',
    );
    expect(screen.getByRole('button', { name: 'Allow' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('turns Allow off when the tenth connection appeared meanwhile, and keeps Cancel', async () => {
    renderButtons({ allow: () => Promise.resolve<AllowConnectionOutcome>({ kind: 'tooMany' }) });

    fireEvent.click(screen.getByRole('button', { name: 'Allow' }));
    await settle();

    expect(screen.getByRole('status')).toHaveTextContent('You already have 10 connected apps');
    expect(screen.getByRole('button', { name: 'Allow' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('names Settings without a link when there is no project to open it from', () => {
    renderButtons({ limitReached: true, settingsHref: null });

    expect(screen.getByRole('status')).toHaveTextContent(
      'Revoke one in Settings to connect another.',
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('asks to try again when the answer fails, and lets it be tried again', async () => {
    renderButtons({ allow: () => Promise.reject(new Error('Pyxis API answered 503')) });

    fireEvent.click(screen.getByRole('button', { name: 'Allow' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('Nothing was sent. Try again.');
    expect(screen.getByRole('button', { name: 'Allow' })).toBeEnabled();
  });

  it('drops an answer still on its way when the page goes away', () => {
    const { unmount } = renderButtons();

    fireEvent.click(screen.getByRole('button', { name: 'Allow' }));

    expect(() => {
      unmount();
    }).not.toThrow();
  });
});
