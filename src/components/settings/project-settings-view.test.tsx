import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmailPreferenceChoice } from '@/domain/email-preferences';
import type { ProjectSettings } from '@/domain/project-settings';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ProjectSettingsView } from './project-settings-view';

const PUBLIC_KEY = `pyxis_pk_${'a'.repeat(32)}`;

const SETTINGS: ProjectSettings = {
  id: 'p1',
  accountId: null,
  role: null,
  name: 'Shop',
  timezone: 'UTC',
  conversionEvent: 'signup_completed',
  currency: 'BRL',
  cityEnabled: false,
  visitorsEnabled: false,
  allowedOrigins: ['https://shop.example.com', 'https://www.shop.example.com'],
  createdAt: '2026-09-01T08:00:00.000Z',
  firstEventAt: '2026-09-02T10:00:00.000Z',
  lastEventAt: '2026-10-05T09:30:00.000Z',
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: PUBLIC_KEY, createdAt: '2026-09-01T08:00:00.000Z' }],
  secretKeys: [{ id: 'k2', createdAt: '2026-09-03T12:00:00.000Z' }],
  deletionHeldAt: null,
};

const ALL_EMAILS_ON = {
  weeklyDigest: true,
  noEventsAlert: true,
  failedWritesAlert: true,
  conversionDropAlert: true,
};

const EMAIL = {
  emailPreferences: ALL_EMAILS_ON,
  chooseEmailPreferences: (choice: EmailPreferenceChoice) =>
    Promise.resolve({ ...ALL_EMAILS_ON, [choice.preference]: choice.on }),
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
  accessTokens: [
    {
      id: '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a',
      name: 'Claude Code',
      createdAt: '2026-10-01T09:00:00.000Z',
      lastUsedAt: null,
      expiresAt: '2026-12-30T09:00:00.000Z',
    },
  ],
  createAccessToken: () => Promise.resolve({ kind: 'tooMany' } as const),
  revokeAccessToken: () => Promise.resolve(),
  connectedApps: { connectorUrl: null, connections: [] },
  revokeConnection: () => Promise.resolve(),
  manage: {
    timezones: ['America/Sao_Paulo', 'UTC'],
    save: () => Promise.resolve({ kind: 'saved' } as const),
    createKey: () => Promise.resolve({ kind: 'tooMany' } as const),
    revokeKey: () => Promise.resolve({ kind: 'revoked' } as const),
    remove: () => Promise.resolve({ kind: 'deleted' } as const),
    addPerson: () => Promise.resolve({ kind: 'limitReached' } as const),
    removePerson: () => Promise.resolve({ kind: 'removed' } as const),
    requestExport: () => Promise.resolve({ kind: 'unavailable' } as const),
    setCity: (cityEnabled: boolean) => Promise.resolve({ kind: 'saved', cityEnabled } as const),
    setVisitors: () => Promise.resolve({ kind: 'saved' } as const),
  },
  people: [
    {
      adminUserId: 'u1',
      email: 'owner@shop.example.com',
      role: 'owner',
      addedAt: '2026-09-01T08:00:00.000Z',
    },
    {
      adminUserId: 'u2',
      email: 'ana@shop.example.com',
      role: 'member',
      addedAt: '2026-09-10T08:00:00.000Z',
    },
  ] as const,
  myEmail: 'owner@shop.example.com',
  goals: [
    {
      id: '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b',
      name: 'Sign-up',
      kind: 'event',
      target: 'signup_completed',
      position: 1,
    },
  ] as const,
  manageGoals: {
    create: () => Promise.resolve({ kind: 'limitReached' } as const),
    update: () => Promise.resolve({ kind: 'notFound' } as const),
    remove: () => Promise.resolve({ kind: 'deleted' } as const),
  },
  shareLinks: {
    links: [
      {
        id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
        name: 'Monthly board report',
        createdAt: '2026-09-25T10:00:00.000Z',
        expiresAt: null,
        passwordProtected: false,
      },
    ],
    onPro: true,
    create: () => Promise.resolve({ kind: 'limitReached' } as const),
    setPassword: () => Promise.resolve({ kind: 'gone' } as const),
    revoke: () => Promise.resolve(),
  },
  slack: {
    webhook: null,
    onPro: true,
    save: () => Promise.resolve({ kind: 'invalid' } as const),
    test: () => Promise.resolve({ kind: 'missing' } as const),
    remove: () => Promise.resolve(),
  },
};

const OWNED: ProjectSettings = {
  ...SETTINGS,
  accountId: 'a1',
  role: 'owner',
  publicKeys: [
    ...SETTINGS.publicKeys,
    { id: 'k3', key: `pyxis_pk_${'b'.repeat(32)}`, createdAt: '2026-10-01T08:00:00.000Z' },
  ],
};

function panel(name: string) {
  return screen.getByRole('region', { name });
}

describe('ProjectSettingsView', () => {
  it('lists the sessions after the e-mail and Slack panels, with this device marked', () => {
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
    expect(headings.indexOf('Slack')).toBe(headings.indexOf('E-mail') + 1);
    expect(headings.indexOf('Sessions')).toBe(headings.indexOf('Slack') + 1);
  });

  it('shows no Slack panel to someone who does not own the project', () => {
    renderWithMessages(
      <ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} slack={null} />,
    );

    expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument();
  });

  it('lists the access tokens right after the sessions, each with its revoke button', () => {
    renderWithMessages(<ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} />);

    const tokens = panel('Access tokens');
    expect(tokens).toHaveTextContent('Claude Code');
    expect(tokens).toHaveTextContent('Last usedNever used');
    expect(
      within(tokens).getByRole('button', { name: 'Revoke', description: 'Claude Code' }),
    ).toBeInTheDocument();
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings.indexOf('Access tokens')).toBe(headings.indexOf('Sessions') + 1);
  });

  it('shows how the project is set up, its activity, origins, keys and retention', () => {
    renderWithMessages(<ProjectSettingsView settings={SETTINGS} i18n={english} {...EMAIL} />);

    const project = panel('Project');
    expect(within(project).getByText('Shop')).toBeInTheDocument();
    expect(within(project).getByText('UTC')).toBeInTheDocument();
    expect(project).toHaveTextContent('CurrencyBRL · Brazilian Real');
    expect(project).not.toHaveTextContent('signup_completed');
    expect(project).toHaveTextContent('Sep 1, 2026');
    const goals = panel('Goals');
    expect(goals).toHaveTextContent('Sign-upFirstEvent signup_completed');
    expect(goals).toHaveTextContent('Only the owner of its account changes the goals.');
    expect(within(goals).queryByRole('button')).not.toBeInTheDocument();
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

    expect(panel('Activity')).toHaveTextContent('Waiting for the first event');
    expect(panel('Allowed origins')).toHaveTextContent('No origin is allowed yet');
    const keys = panel('Keys');
    expect(keys).toHaveTextContent('This project has no live public key, so it is not measuring.');
    expect(keys).toHaveTextContent("Only the account's owner can create one.");
    expect(keys).toHaveTextContent('No live secret key.');
  });

  it('lets the owner edit the project, its origins and its keys, and delete it', () => {
    renderWithMessages(<ProjectSettingsView settings={OWNED} i18n={english} {...EMAIL} />);

    const project = panel('Project');
    expect(project).toHaveTextContent('Created Sep 1, 2026');
    expect(within(project).getByRole('textbox', { name: 'Name' })).toHaveValue('Shop');
    expect(within(project).getByRole('textbox', { name: 'Origin 2' })).toHaveValue(
      'https://www.shop.example.com',
    );
    expect(within(project).queryByRole('textbox', { name: 'Conversion event' })).toBeNull();
    const goals = panel('Goals');
    expect(within(goals).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(within(goals).getByRole('button', { name: 'Add a goal' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Allowed origins' })).not.toBeInTheDocument();
    const keys = panel('Keys');
    expect(within(keys).getAllByRole('button', { name: 'Revoke' })).toHaveLength(3);
    expect(
      within(keys).getByRole('button', { name: 'Revoke', description: /^pyxis_pk_a+Created/ }),
    ).toBeInTheDocument();
    expect(within(keys).getByRole('button', { name: 'New public key' })).toBeInTheDocument();
    expect(within(keys).getByRole('button', { name: 'New secret key' })).toBeInTheDocument();
    expect(
      within(panel('Delete project')).getByRole('textbox', { name: 'Type Shop to confirm' }),
    ).toBeInTheDocument();
    expect(panel('Export events')).toHaveTextContent(
      'the file is kept for 7 days. Up to 3 exports a day.',
    );
    expect(
      within(panel('Export events')).getByRole('button', { name: 'Export events' }),
    ).toBeInTheDocument();
  });

  it('keeps the only public key of an owned project, saying why', () => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{ ...OWNED, publicKeys: SETTINGS.publicKeys, secretKeys: [] }}
        i18n={english}
        {...EMAIL}
      />,
    );

    const keys = panel('Keys');
    expect(within(keys).queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument();
    expect(keys).toHaveTextContent('The only public key stays');
    expect(keys).toHaveTextContent('No live secret key.');
  });

  it('says an owned project has no public key and offers to create one', () => {
    renderWithMessages(
      <ProjectSettingsView settings={{ ...OWNED, publicKeys: [] }} i18n={english} {...EMAIL} />,
    );

    const keys = panel('Keys');
    expect(keys).toHaveTextContent('This project has no live public key, so it is not measuring.');
    expect(keys).toHaveTextContent(
      "When an account's access ends, its keys are revoked, and they stay revoked if the account comes back.",
    );
    expect(keys).toHaveTextContent('Create a public key below');
    expect(within(keys).getByRole('button', { name: 'New public key' })).toBeInTheDocument();
  });

  it('says the deletion of an owned project is on hold instead of offering to delete it', () => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{ ...OWNED, deletionHeldAt: '2026-10-04T00:00:00.000Z' }}
        i18n={english}
        {...EMAIL}
      />,
    );

    const deletion = panel('Delete project');
    expect(deletion).toHaveTextContent(
      'The deletion of this project is on hold: it cannot be deleted until Pyxis lifts the hold.',
    );
    expect(
      within(deletion).getByRole('link', { name: 'hello@pyxis-analytics.dev' }),
    ).toHaveAttribute('href', 'mailto:hello@pyxis-analytics.dev');
    expect(within(deletion).queryByRole('textbox')).not.toBeInTheDocument();
    expect(within(deletion).queryByRole('button')).not.toBeInTheDocument();
  });

  it('gives the owner the city switch, set as the project has it', () => {
    renderWithMessages(
      <ProjectSettingsView settings={{ ...OWNED, cityEnabled: true }} i18n={english} {...EMAIL} />,
    );

    const city = panel('Visitor’s city');
    expect(
      within(city).getByRole('switch', { name: 'Record the visitor’s approximate city' }),
    ).toBeChecked();
  });

  it.each([
    [true, 'This project records the visitor’s approximate city.'],
    [false, 'This project does not record the visitor’s city.'],
  ])('tells a reader whether the city is recorded (%s), without a switch', (cityEnabled, text) => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{ ...OWNED, role: 'member', cityEnabled }}
        i18n={english}
        {...EMAIL}
      />,
    );

    const city = panel('Visitor’s city');
    expect(city).toHaveTextContent(text);
    expect(city).toHaveTextContent('Only the account owner can change it.');
    expect(within(city).queryByRole('switch')).not.toBeInTheDocument();
  });

  it('gives the owner the unique visitors switch next to the city, set as the project has it', () => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{ ...OWNED, visitorsEnabled: true }}
        i18n={english}
        {...EMAIL}
      />,
    );

    const visitors = panel('Unique visitors');
    expect(
      within(visitors).getByRole('switch', {
        name: 'Count unique visitors per day and per month',
      }),
    ).toBeChecked();
    expect(panel('Visitor’s city').parentElement?.nextElementSibling).toContainElement(visitors);
  });

  it.each([
    [true, 'This project counts unique visitors.'],
    [false, 'This project does not count unique visitors.'],
  ])(
    'tells a reader whether unique visitors are counted (%s), without a switch',
    (visitorsEnabled, text) => {
      renderWithMessages(
        <ProjectSettingsView
          settings={{ ...OWNED, role: 'member', visitorsEnabled }}
          i18n={english}
          {...EMAIL}
        />,
      );

      const visitors = panel('Unique visitors');
      expect(visitors).toHaveTextContent(text);
      expect(visitors).toHaveTextContent('Only the account owner can change it.');
      expect(within(visitors).queryByRole('switch')).not.toBeInTheDocument();
    },
  );

  it('shows someone the owner added the project as it is, without changing it', () => {
    renderWithMessages(
      <ProjectSettingsView settings={{ ...OWNED, role: 'member' }} i18n={english} {...EMAIL} />,
    );

    expect(within(panel('Project')).queryByRole('textbox')).not.toBeInTheDocument();
    expect(panel('Allowed origins')).toBeInTheDocument();
    expect(within(panel('Keys')).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Delete project' })).not.toBeInTheDocument();
  });

  it('lists the people of an owned project, marks the admin, and lets the owner add and remove', () => {
    renderWithMessages(<ProjectSettingsView settings={OWNED} i18n={english} {...EMAIL} />);

    const people = panel('People');
    expect(people).toHaveTextContent('The account has room for 3 people, you included.');
    expect(people).toHaveTextContent('owner@shop.example.com (you)');
    expect(people).toHaveTextContent('Owner · Added Sep 1, 2026');
    expect(within(people).getAllByRole('button', { name: 'Remove' })).toHaveLength(1);
    expect(
      within(people).getByRole('button', { name: 'Remove', description: /ana@shop/ }),
    ).toBeInTheDocument();
    expect(within(people).getByRole('textbox', { name: 'E-mail address' })).toBeInTheDocument();
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings.indexOf('People')).toBe(headings.indexOf('Keys') + 1);
  });

  it('shows the people read-only to someone the owner added', () => {
    renderWithMessages(
      <ProjectSettingsView
        settings={{ ...OWNED, role: 'member' }}
        i18n={english}
        {...EMAIL}
        myEmail="ana@shop.example.com"
      />,
    );

    const people = panel('People');
    expect(people).toHaveTextContent('Who can open this project.');
    expect(people).toHaveTextContent('ana@shop.example.com (you)');
    expect(within(people).queryByRole('button')).not.toBeInTheDocument();
    expect(within(people).queryByRole('textbox')).not.toBeInTheDocument();
  });
});
