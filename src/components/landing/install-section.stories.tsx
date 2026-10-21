import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { InstallSection } from './install-section';

const meta = {
  title: 'Landing/InstallSection',
  component: InstallSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, signUpOpen: false },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InstallSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('region')).toBeVisible();
  },
};

export const SignUpOpen: Story = {
  args: { signUpOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'How to start, in 3 steps' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Or ask your AI agent' })).toBeVisible();
  },
};

export const SignUpOpenInPortuguese: Story = {
  args: { signUpOpen: true },
  globals: { locale: 'pt-BR' },
};

export const SignUpOpenOnAPhone: Story = {
  args: { signUpOpen: true },
  globals: { viewport: { value: 'mobile1' } },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
