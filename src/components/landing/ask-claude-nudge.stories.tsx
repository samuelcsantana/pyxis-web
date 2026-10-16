import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { NUDGE_DISMISSED_KEY } from '@/lib/nudge-dismissal';
import { AskClaudeNudge, NUDGE_LEAVE_MS } from './ask-claude-nudge';

const meta = {
  title: 'Landing/AskClaudeNudge',
  component: AskClaudeNudge,
  parameters: { layout: 'fullscreen' },
  args: {
    labels: {
      label: 'News: Pyxis in Claude',
      badge: 'New',
      title: 'MCP access is here!',
      tips: [
        'Connect Claude and other AI agents to your Pyxis numbers, through the Model Context Protocol.',
        'Ask “how did last week go?” and Claude reads your numbers.',
        'One minute to connect. It only reads, and you revoke it any time.',
        'Claude sees the same numbers as your dashboard, and nothing personal.',
      ],
      another: 'Another tip',
      cta: 'See how to connect',
      dismiss: 'Dismiss',
    },
    arriveAfterMs: 0,
  },
  beforeEach: () => {
    window.sessionStorage.removeItem(NUDGE_DISMISSED_KEY);
  },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AskClaudeNudge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('complementary', { name: 'News: Pyxis in Claude' }),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'See how to connect' })).toBeVisible();
  },
};

export const Dismissed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(canvas.queryByRole('complementary')).not.toBeInTheDocument(), {
      timeout: NUDGE_LEAVE_MS + 2_000,
    });
  },
};

export const Portuguese: Story = {
  args: {
    labels: {
      label: 'Novidade: o Pyxis no Claude',
      badge: 'Novo recurso',
      title: 'Acesso via MCP disponível!',
      tips: [
        'Agora você pode conectar o Claude e outros agentes de IA aos números do Pyxis, via Model Context Protocol.',
        'Pergunte “como foi a semana passada?” e o Claude lê seus números.',
        'Conecta em um minuto, só lê e você revoga quando quiser.',
        'O Claude vê os mesmos números do seu painel, e nada pessoal.',
      ],
      another: 'Outra dica',
      cta: 'Ver como conectar',
      dismiss: 'Fechar',
    },
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
