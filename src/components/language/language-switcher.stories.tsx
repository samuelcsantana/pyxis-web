import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LanguageSwitcher } from './language-switcher';

const meta = {
  title: 'Shell/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  args: {
    locale: 'en',
    label: 'Language',
    summary: 'Language: English',
    choose: fn(() => Promise.resolve()),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex h-40 w-[248px] justify-end bg-nav p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

type Play = NonNullable<Story['play']>;

const openTheLanguages: Play = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText(args.summary));
  await expect(canvas.getByRole('group', { name: args.label })).toBeVisible();
};

export const Open: Story = { play: openTheLanguages };

export const OpenDark: Story = { globals: { theme: 'dark' }, play: openTheLanguages };

export const OpenInPortuguese: Story = {
  args: { locale: 'pt-BR', label: 'Idioma', summary: 'Idioma: Português (Brasil)' },
  play: openTheLanguages,
};
