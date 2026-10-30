import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { DeletePart, EmailPart, ExportPart } from './project-actions-parts';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));

const SETTINGS: ProjectSettings = {
  id: 'p1',
  accountId: 'a1',
  role: 'owner',
  name: 'Shop',
  timezone: 'America/Sao_Paulo',
  conversionEvent: null,
  cityEnabled: false,
  allowedOrigins: ['https://shop.example.com'],
  createdAt: '2026-09-01T08:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [],
  secretKeys: [],
  deletionHeldAt: null,
};

const chooseNothing = (chosen: { readonly weeklyDigest: boolean }) => Promise.resolve(chosen);

describe('EmailPart', () => {
  it.each([true, false])(
    'shows the weekly digest switch as the admin chose it (%s), in the project time zone',
    (weeklyDigest) => {
      renderWithMessages(
        <EmailPart settings={SETTINGS} preferences={{ weeklyDigest }} choose={chooseNothing} />,
      );

      expect(screen.getByRole('switch', { name: 'Weekly digest' })).toHaveAttribute(
        'aria-checked',
        String(weeklyDigest),
      );
      expect(
        screen.getByText(/the week that closed on Sunday in America\/Sao_Paulo/),
      ).toBeInTheDocument();
    },
  );
});

describe('ExportPart', () => {
  it('says how long the file is kept and how many exports a day, and offers to export', () => {
    renderWithMessages(
      <ExportPart
        settings={SETTINGS}
        i18n={english}
        request={() => Promise.resolve({ kind: 'unavailable' })}
      />,
    );

    expect(
      screen.getByText(
        'Every event this project keeps, in a compressed CSV file. It takes a few minutes: you get an e-mail with the link, and the file is kept for 7 days. Up to 3 exports a day.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export events' })).toBeInTheDocument();
  });
});

describe('DeletePart', () => {
  const remove = () => Promise.resolve({ kind: 'deleted' } as const);

  it('asks the owner to type the project name to delete it', () => {
    renderWithMessages(<DeletePart settings={SETTINGS} i18n={english} remove={remove} />);

    expect(screen.getByRole('textbox', { name: 'Type Shop to confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete project for good' })).toBeInTheDocument();
    expect(screen.queryByText(/is on hold/)).not.toBeInTheDocument();
  });

  it('says the deletion is on hold and how to reach support, instead of the form', () => {
    renderWithMessages(
      <DeletePart
        settings={{ ...SETTINGS, deletionHeldAt: '2026-10-04T00:00:00.000Z' }}
        i18n={english}
        remove={remove}
      />,
    );

    expect(
      screen.getByText(
        /The deletion of this project is on hold: it cannot be deleted until Pyxis lifts the hold\./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hello@pyxis-analytics.dev' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev',
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
