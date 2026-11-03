import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { visitKindBadge } from '@/domain/visit-kind';
import { english } from '@/test-utils/english';
import { VisitKindChip } from './visit-kind-chip';

const meta = {
  title: 'UI/Visit kind chip',
  component: VisitKindChip,
  tags: ['autodocs'],
  args: { kind: visitKindBadge('first_visit', english) },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VisitKindChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewVisitor: Story = {};

export const FirstThisMonth: Story = {
  args: { kind: visitKindBadge('first_this_month', english) },
};

export const FirstToday: Story = { args: { kind: visitKindBadge('first_today', english) } };

export const AgainToday: Story = { args: { kind: visitKindBadge('again_today', english) } };

export const NoKind: Story = { args: { kind: null } };

export const DarkTheme: Story = {
  args: { kind: visitKindBadge('again_today', english) },
  globals: { theme: 'dark' },
};
