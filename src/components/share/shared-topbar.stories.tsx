import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { SharedTopbar } from './shared-topbar';

const TOKEN = `pyxis_sh_${'S'.repeat(32)}`;
const MIDDAY_OF_NOVEMBER_5_IN_SAO_PAULO = Date.UTC(2026, 10, 5, 15);

function at(screen: string, query: Readonly<Record<string, string>> = { range: '30d' }) {
  const path = screen === 'overview' ? `/share/${TOKEN}` : `/share/${TOKEN}/${screen}`;
  return { nextjs: { appDirectory: true, navigation: { pathname: path, query } } };
}

const meta = {
  title: 'Share/Shared top bar',
  component: SharedTopbar,
  tags: ['autodocs'],
  args: {
    token: TOKEN,
    screen: 'overview',
    projectName: 'Demo Store',
    timeZone: 'America/Sao_Paulo',
    serverNow: MIDDAY_OF_NOVEMBER_5_IN_SAO_PAULO,
  },
  parameters: { layout: 'fullscreen', ...at('overview') },
} satisfies Meta<typeof SharedTopbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.queryByRole('link', { name: 'Visits' })).toBeNull();
  },
};

export const Funnel: Story = { args: { screen: 'funnel' }, parameters: at('funnel') };

export const Today: Story = { parameters: at('overview', { range: 'today' }) };

export const Portuguese: Story = { parameters: { ...at('overview'), locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
