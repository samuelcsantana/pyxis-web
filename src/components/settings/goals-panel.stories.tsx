import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ErrorPanel } from '@/components/states/error-panel';
import { errorTexts } from '@/components/states/error-texts';
import { SkeletonForm } from '@/components/states/screen-skeleton';
import type { Goal } from '@/domain/goals';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockGoalsService } from '@/services/goals/mock-goals-service';
import { english } from '@/test-utils/english';
import { GoalsPanel } from './goals-panel';

const STORY_NOW = new Date('2026-10-15T12:00:00.000Z');
const GOALS = new MockGoalsService(() => STORY_NOW);
const MANAGE = {
  create: fn((changes: Parameters<MockGoalsService['create']>[1]) =>
    GOALS.create(DEMO_STORE.id, changes),
  ),
  update: fn((goalId: string, changes: Parameters<MockGoalsService['update']>[2]) =>
    GOALS.update(DEMO_STORE.id, goalId, changes),
  ),
  remove: fn(() => GOALS.remove()),
};
const TEN_GOALS: readonly Goal[] = Array.from({ length: 10 }, (_, index) => ({
  id: `0000000${String(index)}-1b3d-4e5f-8a6b-9c0d1e2f3a4b`,
  name: `Step ${String(index + 1)} of the checkout`,
  kind: 'page',
  target: `/checkout/step-${String(index + 1)}`,
  position: index + 1,
}));

const meta = {
  title: 'Settings/Goals panel',
  component: GoalsPanel,
  tags: ['autodocs'],
  args: { goals: DEMO_STORE.goals, manage: MANAGE },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,44rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GoalsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ForTheOwner: Story = {};

export const ForSomeoneTheOwnerAdded: Story = { args: { manage: null } };

export const NoGoalsYet: Story = { args: { goals: [] } };

export const NoGoalsYetReadOnly: Story = { args: { goals: [], manage: null } };

export const AddingAPageGoal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add a goal' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Thank-you page');
    await userEvent.click(canvas.getByRole('radio', { name: 'A page the visit opens' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Page path' }), '/thank-you/*');
    await userEvent.click(canvas.getByRole('button', { name: 'Add goal' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Goal added.');
  },
};

export const ProblemsInTheForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add a goal' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Event name' }), 'Sign Up');
    await userEvent.click(canvas.getByRole('button', { name: 'Add goal' }));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

export const RefusedByTheApi: Story = {
  args: {
    manage: { ...MANAGE, create: () => Promise.resolve({ kind: 'subscriptionRequired' }) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add a goal' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Sign-up');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Event name' }), 'signup_completed');
    await userEvent.click(canvas.getByRole('button', { name: 'Add goal' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('no running subscription');
  },
};

export const ConfirmingADeletion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Delete', description: /^Saw the pricing/ }),
    );
    await expect(canvas.getByRole('button', { name: 'Delete goal' })).toHaveFocus();
  },
};

export const AtTheLimit: Story = { args: { goals: TEN_GOALS } };

export const Loading: Story = { render: () => <SkeletonForm fields={3} /> };

export const Failed: Story = {
  render: () => (
    <ErrorPanel
      texts={errorTexts(
        Object.assign(new Error('GET /v1/projects/demo/goals failed'), { digest: '2861547093' }),
        english.t,
      )}
      onRetry={fn()}
    />
  ),
};

export const InPortuguese: Story = { globals: { locale: 'pt-BR' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const EditingInTheDarkTheme: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit', description: /^Sign-up/ }));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('Sign-up');
  },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};
