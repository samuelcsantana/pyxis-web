import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { ContractNotice } from './contract-notice';

const meta = {
  title: 'Legal/ContractNotice',
  component: ContractNotice,
  args: {
    i18n: english,
    seller: {
      name: 'Ana Exemplo',
      taxId: '000.000.000-00',
      address: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-[480px] max-w-full justify-center bg-bg p-6 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContractNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const agreement = canvas.getByRole('link', { name: 'Data Processing Agreement' });
    await expect(agreement).toHaveAttribute('href', 'https://pyxis-analytics.dev/en/dpa');
    await expect(agreement).toHaveAttribute('hreflang', 'en');
  },
};

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const agreement = canvas.getByRole('link', { name: 'Acordo de Tratamento de Dados' });
    await expect(agreement).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/acordo-de-tratamento',
    );
    await expect(agreement).toHaveAttribute('hreflang', 'pt-BR');
  },
};

export const German: Story = { globals: { locale: 'de' } };

export const Spanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
