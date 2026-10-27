import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { NoCodeHelp } from './no-code-help';

const meta = {
  title: 'SignIn/NoCodeHelp',
  component: NoCodeHelp,
  args: {
    message:
      '<strong>Nothing after a few minutes?</strong> This e-mail may not have a Pyxis account yet.',
    plans: { label: 'See the plans', href: 'https://pyxis-analytics.dev/#pricing' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm rounded-card border border-line bg-card p-6 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoCodeHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignUpClosed: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('link')).toHaveLength(1);
  },
};

export const SignUpOpen: Story = {
  args: { signUp: { label: 'Try it free for 14 days', href: '/sign-up' } },
};

export const FreePlanOpen: Story = {
  args: { signUp: { label: 'Start free', href: '/sign-up' } },
};

export const Portuguese: Story = {
  args: {
    message:
      '<strong>Não chegou nada em alguns minutos?</strong> Talvez este e-mail ainda não tenha conta no Pyxis.',
    plans: { label: 'Ver planos', href: 'https://pyxis-analytics.dev/pt-br#pricing' },
    signUp: { label: 'Testar 14 dias grátis', href: '/sign-up' },
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
