import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { IngestionSuspendedBanner } from './ingestion-suspended-banner';

const SINCE = '2026-11-19T10:00:00.000Z';

describe('IngestionSuspendedBanner', () => {
  it('tells the owner since when the project takes no events, why, and where to contest', () => {
    render(
      <IngestionSuspendedBanner
        suspension={{ since: SINCE, reason: 'Events carried e-mail addresses.' }}
        i18n={english}
      />,
    );

    const note = within(screen.getByRole('complementary', { name: 'Project status' })).getByRole(
      'note',
    );
    expect(note).toHaveTextContent(
      "Pyxis suspended this project's event reception on Nov 19, 2026, so it is not measuring. Its screens stay open. Reason: Events carried e-mail addresses. To contest it, the account's owner writes to hello@pyxis-analytics.dev.",
    );
    expect(within(note).getByRole('link', { name: 'hello@pyxis-analytics.dev' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev',
    );
  });

  it('leaves the reason out for someone the API does not tell it to', () => {
    render(<IngestionSuspendedBanner suspension={{ since: SINCE, reason: null }} i18n={english} />);

    expect(screen.getByRole('note')).not.toHaveTextContent('Reason:');
    expect(screen.getByRole('note')).toHaveTextContent("To contest it, the account's owner writes");
  });

  it('speaks Portuguese', () => {
    render(
      <IngestionSuspendedBanner suspension={{ since: SINCE, reason: null }} i18n={portuguese} />,
    );

    expect(screen.getByRole('note')).toHaveTextContent(
      'O Pyxis suspendeu a recepção de eventos deste projeto em 19 de nov. de 2026',
    );
  });
});
