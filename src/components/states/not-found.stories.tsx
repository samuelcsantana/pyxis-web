import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BrandedPage } from '@/components/brand/branded-page';
import { MainContent } from '@/components/shell/main-content';
import { NotFoundPanel } from './not-found-panel';

const meta = {
  title: 'States/Not found',
  component: NotFoundPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Page not found',
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

export const InsideAProject: Story = {
  args: {
    explanation: 'There is nothing at this address in this project.',
    href: '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview',
    linkLabel: 'Open the Overview',
  },
  render: (args) => (
    <MainContent className="flex w-full max-w-310 flex-col gap-6 p-4 sm:p-8">
      <NotFoundPanel {...args} />
    </MainContent>
  ),
};
