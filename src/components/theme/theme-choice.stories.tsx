import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ThemeChoiceGroup } from './theme-choice';

const LABEL_ID = 'theme-story-label';

const meta = {
  title: 'Theme/ThemeChoiceGroup',
  component: ThemeChoiceGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { labelledBy: LABEL_ID },
  decorators: [
    (Story) => (
      <div className="flex w-fit flex-col gap-1.5 rounded-card bg-card p-4">
        <span id={LABEL_ID} className="text-caption font-medium">
          Theme
        </span>
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

const PHONE_PANE_WIDTH = 'w-[288px]';

const fitsOnOneRow: Story['play'] = async ({ canvasElement }) => {
  const group = within(canvasElement).getByRole('group', { name: 'Theme' });
  const tops = within(group)
    .getAllByRole('button')
    .map((button) => button.getBoundingClientRect().top);
  await expect(new Set(tops).size).toBe(1);
  await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
};

const inAPhonePane: NonNullable<Story['decorators']> = [
  (Story) => (
    <div className={PHONE_PANE_WIDTH}>
      <Story />
    </div>
  ),
];

export const OnAPhoneInPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  decorators: inAPhonePane,
  play: fitsOnOneRow,
};

export const OnAPhoneInGerman: Story = {
  globals: { locale: 'de' },
  decorators: inAPhonePane,
  play: fitsOnOneRow,
};

export const OnAPhoneInSpanishDark: Story = {
  args: { initialTheme: 'dark' },
  globals: { locale: 'es', theme: 'dark' },
  decorators: inAPhonePane,
  play: fitsOnOneRow,
};
