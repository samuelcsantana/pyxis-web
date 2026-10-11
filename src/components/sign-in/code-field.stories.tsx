import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { CodeField, type CodeFieldProps } from './code-field';

function LabelledField(props: CodeFieldProps) {
  const [value, setValue] = useState(props.value);
  return (
    <div className="flex w-[min(92vw,356px)] flex-col gap-1.5">
      <label htmlFor={props.id} className="text-caption font-medium text-ink">
        6-digit code
      </label>
      <CodeField
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next.replace(/[^0-9]/g, '').slice(0, props.length));
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Sign in/CodeField',
  component: CodeField,
  tags: ['autodocs'],
  args: { id: 'code', length: 6, value: '', invalid: false, onChange: () => undefined },
  parameters: { layout: 'centered' },
  render: (args) => <LabelledField {...args} />,
} satisfies Meta<typeof CodeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('6-digit code'), '482');
    await expect(canvas.getByTestId('code-caret')).toBeVisible();
  },
};

export const Filled: Story = { args: { value: '482913' } };

export const Refused: Story = { args: { value: '482913', invalid: true } };

export const WholeCodeSelected: Story = {
  args: { value: '482913', invalid: true },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText<HTMLInputElement>('6-digit code');
    field.focus();
    field.select();
    await expect([field.selectionStart, field.selectionEnd]).toEqual([0, 6]);
  },
};

export const DarkTheme: Story = {
  args: { value: '4829' },
  globals: { theme: 'dark' },
};
