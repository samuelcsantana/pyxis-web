import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BrandedPage } from '@/components/brand/branded-page';
import { NotFoundPanel } from './not-found-panel';

const meta = {
  title: 'States/Not found',
  component: NotFoundPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    explanation: 'This page does not exist, or the project is not one you may read.',
    href: '/',
    linkLabel: 'Go to your projects',
  },
  render: (args) => (
    <BrandedPage>
      <NotFoundPanel {...args} />
    </BrandedPage>
  ),
} satisfies Meta<typeof NotFoundPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OutsideAProject: Story = {};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
