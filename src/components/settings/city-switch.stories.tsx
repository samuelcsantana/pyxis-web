import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { type ProjectOptionOutcome, ProjectOptionSwitch } from './project-option-switch';

const SLOW_SAVE_MS = 60_000;

const saveRightAway = (): Promise<ProjectOptionOutcome> => Promise.resolve({ kind: 'saved' });

const saveSlowly = () =>
  new Promise<ProjectOptionOutcome>((resolve) => {
    setTimeout(() => {
      resolve({ kind: 'saved' });
    }, SLOW_SAVE_MS);
  });

const failToSave = () => Promise.reject(new Error('Pyxis API answered 503'));

const refuseWithoutPlan = (): Promise<ProjectOptionOutcome> =>
  Promise.resolve({ kind: 'subscriptionRequired' });

const meta = {
  title: 'Settings/City switch',
  component: ProjectOptionSwitch,
  tags: ['autodocs'],
  args: { option: 'cityOption', initial: false, save: saveRightAway },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProjectOptionSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { initial: true } };

export const ConfirmingTurnOff: Story = {
  args: { initial: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(canvas.getByRole('group', { name: 'Turn off the city?' })).toBeInTheDocument();
  },
};

export const Saving: Story = {
  args: { save: saveSlowly },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(canvas.getByText('Saving…')).toBeInTheDocument();
  },
};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(await canvas.findByText('Saved', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const Failed: Story = {
  args: { save: failToSave },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toBeInTheDocument();
  },
};

export const RefusedWithoutAPlan: Story = {
  args: { save: refuseWithoutPlan },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(await canvas.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent(
      'active plan',
    );
  },
};

export const DarkTheme: Story = { args: { initial: true }, globals: { theme: 'dark' } };
