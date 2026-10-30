import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ThemeChoiceGroup } from './theme-choice';

const meta = {
  title: 'Theme/ThemeChoiceGroup',
  component: ThemeChoiceGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-fit rounded-input bg-nav-raised p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeChoiceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FollowingTheSystem: Story = {};

export const LightChosen: Story = { args: { initialTheme: 'light' } };

export const DarkChosen: Story = { args: { initialTheme: 'dark' }, globals: { theme: 'dark' } };

const ACCOUNT_MENU_INNER_WIDTH = 'w-[194px]';

const fitsOnOneRow: Story['play'] = async ({ canvasElement }) => {
  const group = within(canvasElement).getByRole('group');
  const tops = within(group)
    .getAllByRole('button')
    .map((button) => button.getBoundingClientRect().top);
  await expect(new Set(tops).size).toBe(1);
  await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
};

const inTheAccountMenu: NonNullable<Story['decorators']> = [
  (Story) => (
    <div className={ACCOUNT_MENU_INNER_WIDTH}>
      <Story />
    </div>
  ),
];

export const OnOneRow: Story = {
  args: { layout: 'row' },
  decorators: inTheAccountMenu,
  play: fitsOnOneRow,
};

export const OnOneRowInPortuguese: Story = {
  args: { layout: 'row' },
  globals: { locale: 'pt-BR' },
  decorators: inTheAccountMenu,
  play: fitsOnOneRow,
};

export const OnOneRowInSpanish: Story = {
  args: { layout: 'row' },
  globals: { locale: 'es' },
  decorators: inTheAccountMenu,
  play: fitsOnOneRow,
};

export const OnOneRowDark: Story = {
  args: { layout: 'row', initialTheme: 'dark' },
  globals: { theme: 'dark' },
  decorators: inTheAccountMenu,
  play: fitsOnOneRow,
};
