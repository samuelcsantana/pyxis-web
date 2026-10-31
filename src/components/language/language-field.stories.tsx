import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { LanguageField } from './language-field';

const meta = {
  title: 'Language/LanguageField',
  component: LanguageField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { locale: 'en', label: 'Language', choose: fn(() => Promise.resolve()) },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-card bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageField>;

export default meta;
type Story = StoryObj<typeof meta>;

const showsTheLanguage =
  (label: string, name: string): Story['play'] =>
  async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('combobox', { name: label });
    await expect(field).toHaveDisplayValue(name);
  };

export const English: Story = { play: showsTheLanguage('Language', 'English') };

export const Portuguese: Story = {
  args: { locale: 'pt-BR', label: 'Idioma' },
  globals: { locale: 'pt-BR' },
  play: showsTheLanguage('Idioma', 'Português (Brasil)'),
};

export const GermanDark: Story = {
  args: { locale: 'de', label: 'Sprache' },
  globals: { locale: 'de', theme: 'dark' },
  play: showsTheLanguage('Sprache', 'Deutsch'),
};

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: showsTheLanguage('Language', 'English'),
};
