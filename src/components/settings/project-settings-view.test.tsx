import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
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

function panel(name: string) {
  return screen.getByRole('region', { name });
}

describe('ProjectSettingsView', () => {
  it('shows how the project is set up, its activity, origins, keys and retention', () => {
    render(<ProjectSettingsView settings={SETTINGS} i18n={english} />);

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

  it('says when the project waits for its first event and has nothing set yet', () => {
    render(
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
      />,
    );

    expect(panel('Project')).toHaveTextContent('None, so conversions are not shown');
    expect(panel('Activity')).toHaveTextContent('Waiting for the first event');
    expect(panel('Allowed origins')).toHaveTextContent('No origin is allowed yet');
    expect(panel('Keys')).toHaveTextContent('No live public key');
    expect(panel('Keys')).toHaveTextContent('No live secret key.');
  });
});
