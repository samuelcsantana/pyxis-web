import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { PYXIS_INGESTION_URL } from '@/lib/landing-measurement-config';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { InstallWindow } from './install-window';

const STORY_NOW = new Date('2026-11-20T12:00:00.000Z');
const RECEIVING = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);
const WAITING = { ...RECEIVING, firstEventAt: null, lastEventAt: null };

const meta = {
  title: 'Install/Install window',
  component: InstallWindow,
  tags: ['autodocs'],
  args: { settings: WAITING, endpoint: PYXIS_INGESTION_URL, i18n: english },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="flex h-[44rem] max-w-[60rem] overflow-hidden rounded-2xl border border-line bg-card text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InstallWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

const waits: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { level: 2, name: 'Install' })).toBeVisible();
  await expect(
    canvas.getByText('Waiting for the first event…', { selector: 'header *' }),
  ).toBeVisible();
  await expect(canvas.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(3);
};

export const WaitingForTheFirstEvent: Story = { play: waits };

export const WaitingForTheFirstEventDark: Story = { globals: { theme: 'dark' }, play: waits };

export const FirstEventArrived: Story = {
  args: { settings: RECEIVING },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('The first event arrived.', { selector: 'header *' }),
    ).toBeVisible();
  },
};

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: waits,
};

export const InPortuguese: Story = {
  args: { i18n: portuguese },
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { level: 2, name: 'Instalação' }),
    ).toBeVisible();
  },
};
