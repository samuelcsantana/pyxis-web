import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmailPreferences } from '@/domain/email-preferences';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { ChooseEmailPreference } from './email-preference-switch';
import { EmailPreferenceSwitches } from './email-preference-switches';

const STORED: EmailPreferences = {
  weeklyDigest: true,
  noEventsAlert: false,
  failedWritesAlert: true,
  conversionDropAlert: true,
};

function renderSwitches(choose: ChooseEmailPreference, locale: 'en' | 'pt-BR' = 'en') {
  return renderWithMessages(
    <EmailPreferenceSwitches initial={STORED} timezone="America/Sao_Paulo" choose={choose} />,
    locale,
  );
}

describe('EmailPreferenceSwitches', () => {
  it('shows the weekly digest with its time zone and each stored choice', () => {
    renderSwitches(() => Promise.resolve(STORED));

    const digest = screen.getByRole('switch', { name: 'Weekly digest' });
    expect(digest).toBeChecked();
    expect(digest).toHaveAccessibleDescription(
      'Every Monday, the week that closed on Sunday in America/Sao_Paulo: visits, conversions, failed writes, top pages and events. Each admin chooses for themselves.',
    );
    expect(screen.getByRole('switch', { name: 'No events' })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Failed writes' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Conversion drop' })).toBeChecked();
  });

  it('groups the three alerts under a heading that says when they are judged', () => {
    renderSwitches(() => Promise.resolve(STORED));

    const alerts = screen.getByRole('region', { name: 'Alerts' });
    expect(within(alerts).getAllByRole('switch')).toHaveLength(3);
    expect(alerts).toHaveTextContent(
      'Judged each morning on the day before. Each alert comes at most once a day, and each person chooses their own.',
    );
  });

  it.each([
    [
      'No events',
      'When no event has arrived for 24 hours, on a site that had at least 20 visits in the week before.',
    ],
    [
      'Failed writes',
      'When at least 10 writes failed in a day, 10% or more of them, and at least twice the rate of the week before.',
    ],
    [
      'Conversion drop',
      'When your first goal was reached at most half as often as on the same weekday a week earlier, which had at least 10.',
    ],
  ])('says when the %s alert fires, in plain words', (name, rule) => {
    renderSwitches(() => Promise.resolve(STORED));

    expect(screen.getByRole('switch', { name })).toHaveAccessibleDescription(rule);
  });

  it.each([
    ['Weekly digest', { preference: 'weeklyDigest', on: false }],
    ['No events', { preference: 'noEventsAlert', on: true }],
    ['Failed writes', { preference: 'failedWritesAlert', on: false }],
    ['Conversion drop', { preference: 'conversionDropAlert', on: false }],
  ])('saves only %s when it is switched', (name, choice) => {
    const choose = vi.fn<ChooseEmailPreference>(() => new Promise(() => undefined));
    renderSwitches(choose);

    fireEvent.click(screen.getByRole('switch', { name }));

    expect(choose).toHaveBeenCalledExactlyOnceWith(choice);
  });

  it('speaks Portuguese, with the alert names the e-mails use', () => {
    renderSwitches(() => Promise.resolve(STORED), 'pt-BR');

    expect(screen.getByRole('region', { name: 'Alertas' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Nenhum evento' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Escritas com falha' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Queda de conversões' })).toBeInTheDocument();
  });
});
