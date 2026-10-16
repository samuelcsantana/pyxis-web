import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { demoEndsAt } from './conversation-demo';
import { ConversationDemo } from './conversation-demo-card';

const TOOLS = ['overview', 'funnel', 'funnel_segments'];
const ANSWER =
  'Visits rose 12% against the week before, and conversions 8%. The sign-up loses the most people between the form and the e-mail code: 41% stop there, and on phones it is 52%. On a computer that step loses 23%.';

const meta = {
  title: 'Landing/ConversationDemo',
  component: ConversationDemo,
  args: {
    tools: TOOLS,
    labels: {
      label: 'An example conversation',
      connected: 'MCP connected',
      replay: 'Replay',
      you: 'You',
      claude: 'Claude',
      question: 'How did last week go, and where does the sign-up lose people?',
      used: 'Claude read:',
      answer: ANSWER,
      invented: 'Invented conversation and numbers, like the live demo.',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-bg p-4 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaysToTheEnd: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(
        '52%',
        {},
        { timeout: demoEndsAt(TOOLS.length, ANSWER.split(' ').length) + 2_000 },
      ),
    ).toBeVisible();
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const Portuguese: Story = {
  args: {
    labels: {
      label: 'Um exemplo de conversa',
      connected: 'MCP conectado',
      replay: 'Repetir',
      you: 'Você',
      claude: 'Claude',
      question: 'Como foi a semana passada, e onde o cadastro perde gente?',
      used: 'O Claude leu:',
      answer:
        'As visitas subiram 12% em relação à semana anterior, e as conversões, 8%. O cadastro perde mais gente entre o formulário e o código por e-mail: 41% param ali, e no celular são 52%. No computador, essa etapa perde 23%.',
      invented: 'Conversa e números inventados, como na demonstração.',
    },
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
