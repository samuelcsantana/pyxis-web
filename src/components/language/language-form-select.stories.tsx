import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LanguageFormSelect } from './language-form-select';

const meta = {
  title: 'Shell/LanguageFormSelect',
  component: LanguageFormSelect,
  tags: ['autodocs'],
  args: {
    locale: 'en',
    label: 'Language',
    choose: fn(() => Promise.resolve()),
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-64 justify-end bg-bg p-4 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageFormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = { args: { locale: 'pt-BR', label: 'Idioma' } };

export const Open: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('English', { selector: 'summary span' }));
    await expect(canvas.getByRole('button', { name: 'Español' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Español' }));
    await expect(args.choose).toHaveBeenCalledOnce();
  },
};

export const OpenInDarkTheme: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('English', { selector: 'summary span' }));
    await expect(canvas.getByRole('list', { name: 'Language' })).toBeVisible();
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };
