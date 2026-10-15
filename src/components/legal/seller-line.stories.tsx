import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { SellerLine } from './seller-line';

const meta = {
  title: 'Legal/SellerLine',
  component: SellerLine,
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
      <div className="w-[640px] max-w-full bg-bg p-6 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SellerLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/CPF 000\.000\.000-00/)).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

export const Spanish: Story = { globals: { locale: 'es' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
