import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { type ProjectSection, SECTION_LOOKS } from '@/components/settings-window/sections';
import { SUPPORT_EMAIL } from '@/domain/accounts';
import type { EmailPreferences } from '@/domain/email-preferences';
import type { DeleteProjectOutcome } from '@/domain/project-management';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import type { I18n } from '@/i18n/i18n';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { MockExportsService } from '@/services/exports/mock-exports-service';
import { MockProjectManagementService } from '@/services/project-management/mock-project-management-service';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { english } from '@/test-utils/english';
import { DeletePart, EmailPart, ExportPart, type ExportPartProps } from './project-actions-parts';

const STORY_NOW = new Date('2026-10-30T12:00:00.000Z');
const STORE: ProjectSettings = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);
const MEMBER_VIEW: ProjectSettings = { ...STORE, role: 'member' };
const HELD: ProjectSettings = { ...STORE, deletionHeldAt: '2026-10-28T12:00:00.000Z' };
const MANAGEMENT = new MockProjectManagementService(() => Promise.resolve(english.t));
const EXPORTS = new MockExportsService(() => STORY_NOW);

const saveRightAway = (chosen: EmailPreferences) => Promise.resolve(chosen);
const removeForGood = (confirmName: string): Promise<DeleteProjectOutcome> =>
  MANAGEMENT.delete(STORE.id, confirmName);

interface InItsSectionProps {
  readonly section: ProjectSection;
  readonly i18n: I18n;
  readonly children: ReactNode;
}

function InItsSection({ section, i18n, children }: InItsSectionProps) {
  const look = SECTION_LOOKS[section];
  return (
    <section
      aria-labelledby={look.titleId}
      className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-card p-6 text-ink"
    >
      <h2 id={look.titleId} className="text-2xl font-bold tracking-tight">
        {i18n.t(look.label)}
      </h2>
      {children}
    </section>
  );
}

function inItsSection(section: ProjectSection): Decorator<ExportPartProps> {
  return function UnderItsTitle(Story, { args }) {
    return (
      <InItsSection section={section} i18n={args.i18n}>
        <Story />
      </InItsSection>
    );
  };
}

const meta = {
  title: 'Settings/Project action parts',
  component: ExportPart,
  subcomponents: { EmailPart, DeletePart },
  tags: ['autodocs'],
  args: {
    settings: STORE,
    i18n: english,
    request: () => EXPORTS.request(),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof ExportPart>;

export default meta;
type Story = StoryObj<typeof meta>;

const EMAIL = [inItsSection('email')];
const EXPORT = [inItsSection('export')];
const DELETE = [inItsSection('delete')];

export const EmailDigestOn: Story = {
  decorators: EMAIL,
  render: ({ settings }) => (
    <EmailPart settings={settings} preferences={{ weeklyDigest: true }} choose={saveRightAway} />
  ),
};

export const EmailDigestOffForSomeoneTheOwnerAdded: Story = {
  args: { settings: MEMBER_VIEW },
  decorators: EMAIL,
  render: ({ settings }) => (
    <EmailPart settings={settings} preferences={{ weeklyDigest: false }} choose={saveRightAway} />
  ),
};

export const ExportEvents: Story = { decorators: EXPORT };

export const ExportRequested: Story = {
  decorators: EXPORT,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Export events' }));
    await expect(await canvas.findByRole('link', { name: 'Open the export' })).toBeVisible();
  },
};

export const ExportLimitReached: Story = {
  args: { request: () => Promise.resolve({ kind: 'limitReached' }) },
  decorators: EXPORT,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Export events' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('3 exports');
  },
};

function renderDeletePart({ settings, i18n }: ExportPartProps) {
  return <DeletePart settings={settings} i18n={i18n} remove={removeForGood} />;
}

export const DeleteProject: Story = {
  decorators: DELETE,
  render: renderDeletePart,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Delete project for good' }),
    ).toBeVisible();
  },
};

export const DeletionOnHold: Story = {
  args: { settings: HELD },
  decorators: DELETE,
  render: renderDeletePart,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `mailto:${SUPPORT_EMAIL}`);
  },
};

export const InPortuguese: Story = { decorators: EXPORT, globals: { locale: 'pt-BR' } };

export const DeletionOnHoldInSpanish: Story = {
  args: { settings: HELD },
  decorators: DELETE,
  render: renderDeletePart,
  globals: { locale: 'es' },
};

export const DarkTheme: Story = { decorators: EXPORT, globals: { theme: 'dark' } };

export const DeleteProjectDarkTheme: Story = {
  ...DeleteProject,
  globals: { theme: 'dark' },
};

export const EmailDigestOnDarkTheme: Story = {
  ...EmailDigestOn,
  globals: { theme: 'dark' },
};
