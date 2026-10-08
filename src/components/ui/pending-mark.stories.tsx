import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  NAV_CONTROL,
  NAV_ITEM_IDLE,
  PENDING_HOST,
  PILL,
  PILL_IDLE,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  TAB,
  TAB_IDLE,
  TAB_SELECTED,
} from './control-classes';
import { PendingBar } from './pending-mark';

function LinkControls({ pending }: { readonly pending: boolean }) {
  return (
    <div className="flex flex-col items-start gap-5">
      <nav aria-label="Period" className={SEGMENTED_GROUP}>
        <a
          href="#today"
          className={`min-h-8.5 px-3 ${PENDING_HOST} ${SEGMENTED_OPTION} ${SEGMENTED_IDLE}`}
        >
          Today
        </a>
        <a
          href="#7d"
          className={`min-h-8.5 px-3 ${PENDING_HOST} ${SEGMENTED_OPTION} ${SEGMENTED_IDLE}`}
        >
          7 days
          <PendingBar pending={pending} />
        </a>
        <a
          href="#30d"
          aria-current="page"
          className={`min-h-8.5 px-3 ${PENDING_HOST} ${SEGMENTED_OPTION} ${SEGMENTED_SELECTED}`}
        >
          30 days
        </a>
      </nav>
      <nav aria-label="Feature kind" className="flex gap-1 border-b border-line">
        <a
          href="#events"
          aria-current="page"
          className={`min-h-11 px-4 ${PENDING_HOST} ${TAB} ${TAB_SELECTED}`}
        >
          Events
        </a>
        <a href="#screens" className={`min-h-11 px-4 ${PENDING_HOST} ${TAB} ${TAB_IDLE}`}>
          Screens
          <PendingBar pending={pending} />
        </a>
      </nav>
      <nav aria-label="Show" className="flex gap-2">
        <a href="#errors" className={`min-h-9 px-3.5 ${PENDING_HOST} ${PILL} ${PILL_IDLE}`}>
          Failing only
          <PendingBar pending={pending} />
        </a>
      </nav>
      <nav aria-label="Main navigation" className="w-62 rounded-input bg-nav p-3.5">
        <a
          href="#devices"
          className={`flex min-h-11 items-center rounded-input px-3 text-sm font-medium ${PENDING_HOST} ${NAV_CONTROL} ${NAV_ITEM_IDLE}`}
        >
          Devices
          <PendingBar pending={pending} />
        </a>
      </nav>
    </div>
  );
}

const meta = {
  title: 'UI/Pending mark',
  component: LinkControls,
  tags: ['autodocs'],
  args: { pending: true },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LinkControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {};

export const Idle: Story = { args: { pending: false } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
