import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ConnectedApps } from '@/domain/connections';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import {
  DEMO_CONNECTION_IDS,
  DEMO_CONNECTOR_URL,
  demoConnectionsWire,
} from '@/services/connections/mock-connections-service';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ConnectedAppsPanel } from './connected-apps-panel';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const NOW = new Date('2026-10-15T23:00:00.000Z');
const DEMO_APPS = connectedAppsResponseSchema.parse(demoConnectionsWire(NOW));
const CLOSED: ConnectedApps = { connectorUrl: null, connections: DEMO_APPS.connections };
const CLAUDE_CODE_COMMAND = `claude mcp add --transport http pyxis ${DEMO_CONNECTOR_URL}`;
const format = english.format.dateTime('eventTime', 'UTC');

function renderPanel(apps: ConnectedApps, revoke = () => Promise.resolve()) {
  return renderWithMessages(
    <ConnectedAppsPanel
      apps={apps}
      i18n={english}
      when={(iso) => format(new Date(iso))}
      revoke={revoke}
    />,
  );
}

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('ConnectedAppsPanel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists each connected app with its host, when it was connected and last used', () => {
    renderPanel(DEMO_APPS);

    const apps = screen.getByRole('list', { name: 'Connected apps' });
    const rows = within(apps).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Claude claude.ai');
    expect(rows[0]).toHaveTextContent(`Connected${format(new Date('2026-10-12T23:00:00.000Z'))}`);
    expect(rows[0]).toHaveTextContent(`Last used${format(new Date('2026-10-15T22:00:00.000Z'))}`);
    expect(rows[1]).toHaveTextContent('Claude Code claude.ai');
  });

  it('gives each app its own Revoke button, named by the app', async () => {
    const revoke = vi.fn(() => Promise.resolve());
    renderPanel(DEMO_APPS, revoke);

    const button = screen.getByRole('button', {
      name: 'Revoke',
      description: 'Claude Code claude.ai',
    });
    await userEvent.click(button);

    expect(revoke).toHaveBeenCalledWith(DEMO_CONNECTION_IDS.claudeCode);
    expect(await screen.findByRole('status')).toHaveTextContent('App disconnected');
  });

  it('says when no app is connected yet', () => {
    renderPanel({ connectorUrl: DEMO_CONNECTOR_URL, connections: [] });

    expect(screen.getByText('No apps connected yet.')).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'Revoke' })).toHaveLength(0);
  });

  it('shows how to connect Claude, with the address and the Claude Code command', () => {
    renderPanel(DEMO_APPS);

    const box = screen.getByRole('group', { name: 'Connect Pyxis to Claude' });
    expect(
      within(box)
        .getAllByRole('listitem')
        .map((step) => step.textContent),
    ).toEqual([
      'In Claude, open Customize, then Connectors, and choose Add custom connector.',
      `Name it Pyxis and paste this address:${DEMO_CONNECTOR_URL}Copy`,
      'Choose Connect, sign in to Pyxis in the window that opens, and choose Allow.',
    ]);
    expect(within(box).getByRole('button', { description: DEMO_CONNECTOR_URL })).toHaveTextContent(
      'Copy',
    );
    expect(within(box).getByRole('button', { description: CLAUDE_CODE_COMMAND })).toHaveTextContent(
      'Copy',
    );
  });

  it('hides how to connect while the connector is closed, and still lists the apps', () => {
    renderPanel(CLOSED);

    expect(
      screen.queryByRole('group', { name: 'Connect Pyxis to Claude' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(DEMO_CONNECTOR_URL)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Revoke' })).toHaveLength(2);
  });

  it('copies the address, and selects it when the browser refuses the clipboard', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    renderPanel(DEMO_APPS);

    await userEvent.click(screen.getByRole('button', { description: DEMO_CONNECTOR_URL }));

    expect(writeText).toHaveBeenCalledWith(DEMO_CONNECTOR_URL);
    expect(screen.getByRole('button', { description: DEMO_CONNECTOR_URL })).toHaveTextContent(
      'Copied',
    );

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubClipboard(() => Promise.reject(new DOMException('Denied', 'NotAllowedError')));
    await userEvent.click(screen.getByRole('button', { description: CLAUDE_CODE_COMMAND }));

    expect(screen.getByRole('button', { description: CLAUDE_CODE_COMMAND })).toHaveTextContent(
      'Selected, press Ctrl+C',
    );
    expect(window.getSelection()?.toString()).toBe(CLAUDE_CODE_COMMAND);
    expect(warn).toHaveBeenCalledWith(
      'Claude Code command: could not copy it, selecting it instead',
      expect.any(DOMException),
    );
  });
});
