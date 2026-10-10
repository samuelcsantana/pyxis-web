import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ProjectSettingsView } from './project-settings-view';

const PUBLIC_KEY = `pyxis_pk_${'a'.repeat(32)}`;

const SETTINGS: ProjectSettings = {
  id: 'p1',
  name: 'Shop',
  timezone: 'UTC',
  conversionEvent: 'signup_completed',
  allowedOrigins: ['https://shop.example.com', 'https://www.shop.example.com'],
  createdAt: '2026-09-01T08:00:00.000Z',
  firstEventAt: '2026-09-02T10:00:00.000Z',
  lastEventAt: '2026-10-05T09:30:00.000Z',
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: PUBLIC_KEY, createdAt: '2026-09-01T08:00:00.000Z' }],
  secretKeys: [{ id: 'k2', createdAt: '2026-09-03T12:00:00.000Z' }],
};

const EMAIL = {
  emailPreferences: { weeklyDigest: true },
  chooseEmailPreferences: (chosen: { readonly weeklyDigest: boolean }) => Promise.resolve(chosen),
  sessions: [
    {
      id: '5d2f8c1a-6b3e-4a7f-9c0d-1e2f3a4b5c6d',
      browser: 'chrome',
      os: 'windows',
      deviceType: 'desktop',
      createdAt: '2026-10-05T09:00:00.000Z',
      lastUsedAt: '2026-10-05T09:30:00.000Z',
      current: true,
    },
  ],
  endSession: () => Promise.resolve(),
};

function panel(name: string) {
  return screen.getByRole('region', { name });
}

describe('ProjectSettingsView', () => {
  it('lists the sessions between the e-mail panel and the project, with this device marked', () => {
    renderWithMessages(<ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} />);

    const sessions = panel('Sessions');
    expect(sessions).toHaveTextContent('Chrome on Windows');
    expect(sessions).toHaveTextContent('This device');
    expect(within(sessions).getByRole('button', { name: 'End' })).toBeInTheDocument();
    expect(
      within(sessions).getByRole('button', { name: 'Sign out everywhere' }),
    ).toBeInTheDocument();
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings.indexOf('Sessions')).toBe(headings.indexOf('E-mail') + 1);
  });

  it('shows how the project is set up, its activity, origins, keys and retention', () => {
    renderWithMessages(<ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} />);

    const project = panel('Project');
    expect(within(project).getByText('Shop')).toBeInTheDocument();
    expect(within(project).getByText('UTC')).toBeInTheDocument();
    expect(project).toHaveTextContent('signup_completed');
    expect(project).toHaveTextContent('Sep 1, 2026');
    expect(panel('Activity')).toHaveTextContent('Oldest event keptSep 2, 2026, 10:00');
    expect(panel('Activity')).toHaveTextContent('Latest eventOct 5, 2026, 09:30');
    expect(within(panel('Allowed origins')).getAllByRole('listitem')).toHaveLength(2);
    const keys = panel('Keys');
    expect(keys).toHaveTextContent(PUBLIC_KEY);
    expect(keys).toHaveTextContent('Created Sep 3, 2026, 12:00');
    expect(within(keys).getByRole('heading', { name: 'Secret keys' })).toBeInTheDocument();
    expect(panel('Data retention')).toHaveTextContent('Events are kept for 13 months');
  });

  it('puts the weekly digest switch first, in the e-mail panel, in the project time zone', () => {
    renderWithMessages(<ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} />);

    const email = panel('E-mail');
    expect(within(email).getByRole('switch', { name: 'Weekly digest' })).toBeChecked();
    expect(email).toHaveTextContent('the week that closed on Sunday in UTC');
    expect(screen.getAllByRole('region')[0]).toBe(email);
  });

  it('says when the project waits for its first event and has nothing set yet', () => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{
          ...SETTINGS,
          conversionEvent: null,
          allowedOrigins: [],
          firstEventAt: null,
          lastEventAt: null,
          publicKeys: [],
          secretKeys: [],
        }}
        i18n={english}
        {...EMAIL}
      />,
    );

    expect(panel('Project')).toHaveTextContent('None, so conversions are not shown');
    expect(panel('Activity')).toHaveTextContent('Waiting for the first event');
    expect(panel('Allowed origins')).toHaveTextContent('No origin is allowed yet');
    expect(panel('Keys')).toHaveTextContent('No live public key');
    expect(panel('Keys')).toHaveTextContent('No live secret key.');
  });
});
