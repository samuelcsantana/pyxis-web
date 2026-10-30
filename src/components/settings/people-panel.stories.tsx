import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import type { AddPersonOutcome, RemovePersonOutcome } from '@/domain/project-people';
import { projectPeopleResponseSchema } from '@/domain/project-people.schema';
import {
  demoPeopleWire,
  MockProjectPeopleService,
} from '@/services/project-people/mock-project-people-service';
import { DEMO_OWNER_EMAIL } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { PeoplePanel } from './people-panel';

const STORY_NOW = new Date('2026-10-15T12:00:00.000Z');
const PEOPLE = new MockProjectPeopleService(() => STORY_NOW);
const PROJECT = 'story-project';
const format = english.format.dateTime('eventTime', 'America/Sao_Paulo');

const LOOK = SECTION_LOOKS.people;

const meta = {
  title: 'Settings/People panel',
  component: PeoplePanel,
  tags: ['autodocs'],
  args: {
    people: projectPeopleResponseSchema.parse(demoPeopleWire()),
    myEmail: DEMO_OWNER_EMAIL,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    manage: {
      add: (email: string): Promise<AddPersonOutcome> => PEOPLE.add(PROJECT, email),
      remove: (adminUserId: string): Promise<RemovePersonOutcome> =>
        PEOPLE.remove(PROJECT, adminUserId),
    },
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story, { args }) => (
      <section
        aria-labelledby={LOOK.titleId}
        className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-card p-6 text-ink"
      >
        <h2 id={LOOK.titleId} className="text-2xl font-bold tracking-tight">
          {args.i18n.t(LOOK.label)}
        </h2>
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof PeoplePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {};

export const ForSomeoneTheOwnerAdded: Story = {
  args: { manage: null, myEmail: 'analyst@example.com' },
};

export const Invited: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'E-mail address' }),
      'ana@example.com',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Add person' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('got an e-mail');
  },
};

export const AccountFull: Story = {
  args: {
    manage: {
      add: () => Promise.resolve({ kind: 'limitReached' }),
      remove: () => Promise.resolve({ kind: 'removed' }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'E-mail address' }),
      'ana@example.com',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Add person' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('already has its 3 people');
  },
};

export const MemberRemoved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Removed');
  },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
