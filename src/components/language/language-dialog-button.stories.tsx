import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { LanguageDialogButton } from './language-dialog-button';

const meta = {
  title: 'Language/LanguageDialogButton',
  component: LanguageDialogButton,
  tags: ['autodocs'],
  args: {
    choose: fn(() => Promise.resolve()),
    className: `min-h-11 rounded-input px-3 text-sm ${BUTTON_SECONDARY}`,
    children: 'Language',
  },
} satisfies Meta<typeof LanguageDialogButton>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

const opens: Play = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Language' }));
  const dialog = await within(document.body).findByRole('dialog', { name: 'Language' });
  await expect(within(dialog).getByRole('searchbox')).toHaveFocus();
  await expect(within(dialog).getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
};

export const Closed: Story = {};

export const Open: Story = { play: opens };

export const OpenDark: Story = { globals: { theme: 'dark' }, play: opens };

const searchesForNothing: Play = async (context) => {
  await opens(context);
  const dialog = await within(document.body).findByRole('dialog', { name: 'Language' });
  await userEvent.type(within(dialog).getByRole('searchbox'), 'klingon');
  await expect(within(dialog).getByRole('status')).toHaveTextContent('klingon');
};

export const NoMatch: Story = { play: searchesForNothing };

export const NoMatchDark: Story = { globals: { theme: 'dark' }, play: searchesForNothing };

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  args: { children: 'Idioma' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Idioma' }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Idioma' });
    await expect(within(dialog).getByText('Alemão')).toBeVisible();
  },
};
