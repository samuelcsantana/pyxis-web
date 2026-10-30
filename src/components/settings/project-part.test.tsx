import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { type ProjectManagement, ProjectPart } from './project-part';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));

const SETTINGS: ProjectSettings = {
  id: 'p1',
  accountId: 'a1',
  role: 'member',
  name: 'Shop',
  timezone: 'UTC',
  conversionEvent: 'signup_completed',
  cityEnabled: false,
  allowedOrigins: ['https://shop.example.com', 'https://www.shop.example.com'],
  createdAt: '2026-09-01T08:00:00.000Z',
  firstEventAt: '2026-09-02T10:00:00.000Z',
  lastEventAt: '2026-10-05T09:30:00.000Z',
  eventRetentionMonths: 13,
  publicKeys: [],
  secretKeys: [],
  deletionHeldAt: null,
};

const MANAGE: ProjectManagement = {
  timezones: ['America/Sao_Paulo', 'UTC'],
  save: () => Promise.resolve({ kind: 'saved' }),
  setCity: (cityEnabled) => Promise.resolve({ kind: 'saved', cityEnabled }),
};

const format = english.format.dateTime('eventTime', 'UTC');
const when = (iso: string) => format(new Date(iso));

function renderPart(settings: ProjectSettings, manage: ProjectManagement | null) {
  return renderWithMessages(
    <ProjectPart settings={settings} i18n={english} when={when} manage={manage} />,
  );
}

function part(name: string) {
  return screen.getByRole('region', { name });
}

describe('ProjectPart', () => {
  it('shows a reader how the project is set up, its origins, activity and retention', () => {
    renderPart(SETTINGS, null);

    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('signup_completed').closest('code')).toBeInTheDocument();
    expect(screen.getByText('Sep 1, 2026, 08:00')).toBeInTheDocument();
    const origins = within(part('Allowed origins')).getAllByRole('listitem');
    expect(origins.map((origin) => origin.textContent)).toEqual([
      'https://shop.example.com',
      'https://www.shop.example.com',
    ]);
    expect(part('Allowed origins')).toHaveTextContent(
      'Only pages on these origins can send events with a public key.',
    );
    expect(part('Activity')).toHaveTextContent('Oldest event keptSep 2, 2026, 10:00');
    expect(part('Activity')).toHaveTextContent('Latest eventOct 5, 2026, 09:30');
    expect(part('Activity')).not.toHaveTextContent('Waiting for the first event');
    expect(part('Data retention')).toHaveTextContent(
      'Events are kept for 13 months, then a daily job deletes them.',
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('says when the project waits for its first event and has nothing set yet', () => {
    renderPart(
      {
        ...SETTINGS,
        conversionEvent: null,
        allowedOrigins: [],
        firstEventAt: null,
        lastEventAt: null,
      },
      null,
    );

    expect(screen.getByText('None, so conversions are not shown')).toBeInTheDocument();
    expect(screen.queryByText('signup_completed')).not.toBeInTheDocument();
    expect(part('Allowed origins')).toHaveTextContent(
      'No origin is allowed yet, so no page can send events.',
    );
    expect(within(part('Allowed origins')).queryByRole('list')).not.toBeInTheDocument();
    expect(part('Activity')).toHaveTextContent('Waiting for the first event');
    expect(part('Activity')).toHaveTextContent('Install the SDK with a public key below');
    expect(part('Activity')).not.toHaveTextContent('Oldest event kept');
  });

  it.each([
    [true, 'This project records the visitor’s approximate city.'],
    [false, 'This project does not record the visitor’s city.'],
  ])('tells a reader whether the city is recorded (%s), without a switch', (cityEnabled, text) => {
    renderPart({ ...SETTINGS, cityEnabled }, null);

    const city = part('Visitor’s city');
    expect(city).toHaveTextContent(text);
    expect(city).toHaveTextContent('Only the account owner can change it.');
    expect(within(city).queryByRole('switch')).not.toBeInTheDocument();
  });

  it('titles each part of a reader’s view with a third-level heading the window can point to', () => {
    renderPart(SETTINGS, null);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => [heading.id, heading.textContent]),
    ).toEqual([
      ['settings-origins-heading', 'Allowed origins'],
      ['settings-activity-heading', 'Activity'],
      ['settings-retention-heading', 'Data retention'],
      ['settings-city-heading', 'Visitor’s city'],
    ]);
  });

  it('lets the owner edit the project and its origins in a form, without the read-only facts', () => {
    renderPart(SETTINGS, MANAGE);

    expect(screen.getByText('Created Sep 1, 2026, 08:00')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Shop');
    expect(screen.getByRole('textbox', { name: 'Origin 1' })).toHaveValue(
      'https://shop.example.com',
    );
    expect(screen.getByRole('textbox', { name: 'Origin 2' })).toHaveValue(
      'https://www.shop.example.com',
    );
    expect(screen.getByRole('textbox', { name: 'Conversion event' })).toHaveValue(
      'signup_completed',
    );
    expect(screen.queryByRole('region', { name: 'Allowed origins' })).not.toBeInTheDocument();
    expect(screen.queryByText('Time zone', { selector: 'dt' })).not.toBeInTheDocument();
    expect(part('Activity')).toHaveTextContent('Latest eventOct 5, 2026, 09:30');
    expect(part('Data retention')).toHaveTextContent('Events are kept for 13 months');
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.id)).toEqual([
      'settings-activity-heading',
      'settings-retention-heading',
      'settings-city-heading',
    ]);
  });

  it('tells the owner the project waits for its first event', () => {
    renderPart({ ...SETTINGS, firstEventAt: null, lastEventAt: null }, MANAGE);

    expect(part('Activity')).toHaveTextContent('Waiting for the first event');
  });

  it.each([true, false])(
    'gives the owner the city switch, set as the project has it (%s)',
    (cityEnabled) => {
      renderPart({ ...SETTINGS, cityEnabled }, MANAGE);

      const city = part('Visitor’s city');
      const toggle = within(city).getByRole('switch', {
        name: 'Record the visitor’s approximate city',
      });
      expect(toggle).toHaveAttribute('aria-checked', String(cityEnabled));
      expect(city).not.toHaveTextContent('Only the account owner can change it.');
    },
  );
});
