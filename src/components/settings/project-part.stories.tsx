import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SECTION_LOOKS } from '@/components/settings-window/sections';
import { timeZoneChoices } from '@/domain/project-management';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { MockProjectManagementService } from '@/services/project-management/mock-project-management-service';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { english } from '@/test-utils/english';
import { ProjectPart } from './project-part';

const STORY_NOW = new Date('2026-10-30T12:00:00.000Z');
const STORE: ProjectSettings = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);
const MEMBER_VIEW: ProjectSettings = { ...STORE, role: 'member' };
const NOTHING_RECEIVED = {
  conversionEvent: null,
  firstEventAt: null,
  lastEventAt: null,
} as const;
const MANAGEMENT = new MockProjectManagementService(() => Promise.resolve(english.t));
const format = english.format.dateTime('eventTime', STORE.timezone);
const LOOK = SECTION_LOOKS.project;

const meta = {
  title: 'Settings/Project part',
  component: ProjectPart,
  tags: ['autodocs'],
  args: {
    settings: STORE,
    i18n: english,
    when: (iso: string) => format(new Date(iso)),
    manage: {
      timezones: timeZoneChoices(STORE.timezone),
      save: () => MANAGEMENT.update(),
      setCity: (cityEnabled: boolean) => MANAGEMENT.setCity(STORE.id, cityEnabled),
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
} satisfies Meta<typeof ProjectPart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(canvas.getByRole('switch')).toBeVisible();
  },
};

export const ForTheOwnerWaitingForTheFirstEvent: Story = {
  args: { settings: { ...STORE, ...NOTHING_RECEIVED, allowedOrigins: [] } },
};

export const ForTheOwnerWithoutASubscription: Story = {
  args: {
    manage: {
      timezones: timeZoneChoices(STORE.timezone),
      save: () => Promise.resolve({ kind: 'subscriptionRequired' }),
      setCity: () => Promise.resolve({ kind: 'subscriptionRequired' }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByRole('alert')).toBeVisible();
  },
};

export const ForSomeoneTheOwnerAdded: Story = {
  args: { settings: MEMBER_VIEW, manage: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const origin of STORE.allowedOrigins) {
      await expect(canvas.getByText(origin)).toBeVisible();
    }
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
  },
};

export const ForSomeoneTheOwnerAddedWithoutOrigins: Story = {
  args: { settings: { ...MEMBER_VIEW, allowedOrigins: [] }, manage: null },
};

export const ForSomeoneTheOwnerAddedWaitingForTheFirstEvent: Story = {
  args: { settings: { ...MEMBER_VIEW, ...NOTHING_RECEIVED }, manage: null },
};

export const ForSomeoneTheOwnerAddedWithTheCityOff: Story = {
  args: { settings: { ...MEMBER_VIEW, cityEnabled: false }, manage: null },
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const ForSomeoneTheOwnerAddedDarkTheme: Story = {
  args: { settings: MEMBER_VIEW, manage: null },
  globals: { theme: 'dark' },
};
