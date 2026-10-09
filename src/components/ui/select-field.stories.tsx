import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FIELD } from './control-classes';
import { SelectField } from './select-field';

const FIELD_CLASS = `min-h-11 rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const CHANNELS = ['Any channel', 'Paid', 'Organic search', 'Referral', 'Direct'];

const meta = {
  title: 'UI/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Channel',
    className: FIELD_CLASS,
    frameClassName: 'w-56',
    children: CHANNELS.map((channel) => <option key={channel}>{channel}</option>),
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongOption: Story = {
  args: {
    frameClassName: 'w-40',
    children: <option>Any device, phone or computer</option>,
  },
};

export const Invalid: Story = { args: { 'aria-invalid': true } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
