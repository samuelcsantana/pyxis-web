import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { PreferencesPanel } from './preferences-panel';

const meta = {
  title: 'Settings/PreferencesPanel',
  component: PreferencesPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { i18n: english, choose: fn(() => Promise.resolve()) },
  decorators: [
    (Story) => (
      <div className="max-w-xl rounded-card bg-card p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PreferencesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('These apply to this browser.')).toBeVisible();
    const themes = canvas.getByRole('group', { name: 'Theme' });
    await expect(within(themes).getAllByRole('button')).toHaveLength(3);
    await expect(within(themes).getAllByRole('button', { pressed: true })).toHaveLength(1);
    await expect(canvas.getByRole('combobox', { name: 'Language' })).toHaveDisplayValue('English');
  },
};

export const DarkChosen: Story = { args: { theme: 'dark' }, globals: { theme: 'dark' } };

export const InPortuguese: Story = {
  args: { i18n: portuguese },
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Valem para este navegador.')).toBeVisible();
  },
};
