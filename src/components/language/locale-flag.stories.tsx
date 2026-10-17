import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LocaleFlag } from './locale-flag';

const meta = {
  title: 'Shell/LocaleFlag',
  component: LocaleFlag,
  args: { locale: 'en' },
} satisfies Meta<typeof LocaleFlag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const BrazilianPortuguese: Story = { args: { locale: 'pt-BR' } };

export const Spanish: Story = { args: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
