import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LanguageMenu } from './language-menu';

const meta = {
  title: 'Shell/LanguageMenu',
  component: LanguageMenu,
  tags: ['autodocs'],
  args: {
    locale: 'en',
    label: 'Language',
    choose: fn(() => Promise.resolve()),
  },
} satisfies Meta<typeof LanguageMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Português (Brasil)' }),
    );
    await expect(args.choose).toHaveBeenCalledOnce();
  },
};

export const Portuguese: Story = { args: { locale: 'pt-BR', label: 'Idioma' } };

export const Dark: Story = { globals: { theme: 'dark' } };

export const InTheSidebar: Story = {
  args: { surface: 'nav' },
  decorators: [
    (Story) => (
      <div className="w-[248px] bg-nav p-3.5">
        <Story />
      </div>
    ),
  ],
};

export const InTheSidebarPortuguese: Story = {
  args: { surface: 'nav', locale: 'pt-BR', label: 'Idioma' },
  decorators: InTheSidebar.decorators,
};
