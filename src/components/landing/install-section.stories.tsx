import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { InstallSection } from './install-section';
import '@/app/landing/[locale]/landing.css';

const RISEN_INTO_VIEW = '.landing-reveal { animation: none; }';

const meta = {
  title: 'Landing/InstallSection',
  component: InstallSection,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english, signUpOpen: false },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <style>{RISEN_INTO_VIEW}</style>
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
    await expect(
      canvas.getByText(/the dashboard’s Install screen has a request like this one ready/),
    ).toBeVisible();
    await expect(canvas.getByText('Install without writing code')).toBeVisible();
    await expect(
      within(canvas.getByRole('list', { name: 'Works with coding agents such as' })).getAllByRole(
        'listitem',
      ),
    ).toHaveLength(7);
    await expect(
      canvas.getByRole('button', { name: 'Copy the request for your agent' }),
    ).toBeVisible();
  },
};

export const SignUpOpenRequestCopied: Story = {
  args: { signUpOpen: true },
  play: async ({ canvasElement }) => {
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy the request for your agent' }));
    await expect(
      await canvas.findByRole('button', { name: 'Request copied. Paste it into your agent' }),
    ).toBeVisible();
    await expect(canvasElement.querySelector('.landing-agent-robot > span')).toHaveClass(
      'landing-robot-cheer',
    );
    writeText.mockRestore();
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

export const SignUpOpenInTheDarkTheme: Story = {
  args: { signUpOpen: true },
  globals: { theme: 'dark' },
};

export const SignUpOpenOnAPhoneInTheDarkTheme: Story = {
  args: { signUpOpen: true },
  globals: { theme: 'dark', viewport: { value: 'mobile1' } },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
