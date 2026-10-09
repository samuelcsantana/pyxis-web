import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
