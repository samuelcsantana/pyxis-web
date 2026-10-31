import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { InstallWindow } from './install-window';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const WAITING: ProjectSettings = {
  id: 'p-store',
  accountId: 'a1',
  role: 'owner',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
  cityEnabled: false,
  allowedOrigins: ['https://store.example.com'],
  createdAt: '2026-11-20T12:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: 'pyxis_pk_store', createdAt: '2026-11-20T12:00:00.000Z' }],
  secretKeys: [],
  deletionHeldAt: null,
};

const RECEIVING: ProjectSettings = {
  ...WAITING,
  firstEventAt: '2026-11-20T12:01:00.000Z',
  lastEventAt: '2026-11-20T12:01:00.000Z',
};

function showWindow(settings: ProjectSettings) {
  return render(
    <InstallWindow settings={settings} endpoint="https://api.example.com" i18n={english} />,
  );
}

function header(): HTMLElement {
  const title = screen.getByRole('heading', { level: 2, name: 'Install' });
  const top = title.closest('header');
  if (top === null) {
    throw new Error('The title sits in the header of the window.');
  }
  return top;
}

describe('InstallWindow', () => {
  it('titles the window, which takes the focus first, and names the project waiting for its first event', () => {
    showWindow(WAITING);

    const title = screen.getByRole('heading', { level: 2, name: 'Install' });
    expect(title).toHaveAttribute('id', 'settings-window-title');
    expect(title).toHaveAttribute('data-section-title');
    expect(title).toHaveAttribute('tabindex', '-1');
    expect(within(header()).getByText('Demo Store')).toBeInTheDocument();
    expect(within(header()).getByText('Waiting for the first event…')).toBeInTheDocument();
    expect(within(header()).queryByText('The first event arrived.')).not.toBeInTheDocument();
  });

  it('says in the header once the first event arrived', () => {
    showWindow(RECEIVING);

    expect(within(header()).getByText('The first event arrived.')).toBeInTheDocument();
    expect(within(header()).queryByText('Waiting for the first event…')).not.toBeInTheDocument();
  });

  it('lists the three steps under the title of the window, with ids of their own', () => {
    showWindow(WAITING);

    const steps = screen.getAllByRole('heading', { level: 3 }).map((step) => step.textContent);
    expect(steps).toEqual([
      'Installing happens on a computer',
      '1. Install Pyxis on your site',
      '2. Open a page of your site',
      '3. Check with Claude (optional)',
    ]);
    expect(screen.getByRole('region', { name: '1. Install Pyxis on your site' })).toHaveAttribute(
      'aria-labelledby',
      'install-window-step-1',
    );
    expect(document.getElementById('install-step-1')).toBeNull();
  });

  it('titles what the agent changes one level below the steps', () => {
    showWindow(WAITING);

    fireEvent.click(screen.getByRole('tab', { name: 'With an AI agent' }));

    expect(
      screen.getByRole('heading', { level: 4, name: 'What the agent will change' }),
    ).toHaveAttribute('id', 'install-window-agent-changes');
  });
});
