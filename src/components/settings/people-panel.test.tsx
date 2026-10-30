import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectPerson } from '@/domain/project-people';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { PeoplePanel, type PeoplePanelProps, personRowId } from './people-panel';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));

const OWNER: ProjectPerson = {
  adminUserId: 'b14d6f80-1c2e-4d3f-8a5b-9c0d1e2f3a4b',
  email: 'owner@shop.example.com',
  role: 'owner',
  addedAt: '2026-09-01T08:00:00.000Z',
};

const MEMBER: ProjectPerson = {
  adminUserId: 'a03c5e7f-9b1d-4c4e-9f6a-8b0c2d4e6f8a',
  email: 'ana@shop.example.com',
  role: 'member',
  addedAt: '2026-09-10T08:00:00.000Z',
};

const MANAGE: NonNullable<PeoplePanelProps['manage']> = {
  add: () => Promise.resolve({ kind: 'limitReached' }),
  remove: () => Promise.resolve({ kind: 'removed' }),
};

const format = english.format.dateTime('eventTime', 'UTC');
const when = (iso: string) => format(new Date(iso));

function renderPanel(myEmail: string, manage: PeoplePanelProps['manage']) {
  return renderWithMessages(
    <PeoplePanel
      people={[MEMBER, OWNER]}
      myEmail={myEmail}
      i18n={english}
      when={when}
      manage={manage}
    />,
  );
}

describe('personRowId', () => {
  it('names the element that describes a person after the person', () => {
    expect(personRowId(MEMBER.adminUserId)).toBe(`person-${MEMBER.adminUserId}`);
  });
});

describe('PeoplePanel', () => {
  it('lists the owner first, marks the admin, and lets the owner add and remove members', () => {
    renderPanel(OWNER.email, MANAGE);

    expect(
      screen.getByText(
        'Who can open this project. Each person signs in with a code sent to their e-mail. The account has room for 3 people, you included.',
      ),
    ).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('owner@shop.example.com (you)');
    expect(rows[0]).toHaveTextContent('Owner · Added Sep 1, 2026, 08:00');
    expect(rows[1]).toHaveTextContent('ana@shop.example.com');
    expect(rows[1]).not.toHaveTextContent('(you)');
    expect(rows[1]).toHaveTextContent('Member · Added Sep 10, 2026, 08:00');
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Remove', description: /^ana@shop\.example\.com/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'E-mail address' })).toBeInTheDocument();
  });

  it('shows the people read-only to someone the owner added', () => {
    renderPanel(MEMBER.email, null);

    expect(screen.getByText('Who can open this project.')).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('owner@shop.example.com');
    expect(rows[0]).not.toHaveTextContent('(you)');
    expect(rows[1]).toHaveTextContent('ana@shop.example.com (you)');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('leaves the title to the settings window that holds it', () => {
    renderPanel(OWNER.email, MANAGE);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
