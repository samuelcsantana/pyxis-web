import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { english } from '@/test-utils/english';
import { LandingFooter } from './landing-footer';

const meta = {
  title: 'Landing/LandingFooter',
  component: LandingFooter,
  parameters: { layout: 'fullscreen' },
  args: { i18n: english },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'pyxis-sdk' })).toBeVisible();
  },
};

export const Portuguese: Story = { globals: { locale: 'pt-BR' } };

const SELLER = {
  name: 'Ana Exemplo',
  taxId: '000.000.000-00',
  address: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
};

export const WithContract: Story = {
  args: { seller: SELLER },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Terms of Use' })).toBeVisible();
    await expect(canvas.getByText(/^Sold by Ana Exemplo/)).toBeVisible();
  },
};

export const WithContractInPortuguese: Story = {
  args: { seller: SELLER },
  globals: { locale: 'pt-BR' },
};

export const WithContractOnAPhone: Story = {
  args: { seller: SELLER },
  globals: { viewport: { value: 'mobile1' } },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
