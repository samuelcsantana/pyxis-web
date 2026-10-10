import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { EndSessionButton } from './end-session-button';

const SLOW_END_MS = 60_000;
const SESSION_ID = '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e';

const endRightAway = () => Promise.resolve();

const endSlowly = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, SLOW_END_MS);
  });

const failToEnd = () => Promise.reject(new Error('Pyxis API answered 503'));

const meta = {
  title: 'Settings/End session button',
  component: EndSessionButton,
  tags: ['autodocs'],
  args: { sessionId: SESSION_ID, end: endRightAway },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EndSessionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ending: Story = {
  args: { end: endSlowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'End' }));
    await expect(canvas.getByRole('button', { name: 'Ending…' })).toBeDisabled();
  },
};

export const Ended: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'End' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Session ended');
  },
};

export const Failed: Story = {
  args: { end: failToEnd },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'End' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('The session was not ended');
  },
};
