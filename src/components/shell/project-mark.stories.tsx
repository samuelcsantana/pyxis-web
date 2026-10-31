import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { demoAdminOf } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { ProjectMark } from './project-mark';

const DEMO_ADMIN = demoAdminOf(english.t, new Date('2026-10-06T02:30:00.000Z'));
const [STORE] = DEMO_ADMIN.projects;
if (STORE === undefined) {
  throw new Error('The demo admin has no project.');
}

const SITE_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABFklEQVR42u2bwRUCMQhEgSK0J21Bq9MWtCdtQitQkzUJhHzOuy/MZzaXHUQoilq5dORhu8vhVfrs83zX6QHUCPYCotGF9wahswjvBUJnE94ahM0svsX5NrP4Fn3ozMJbfBKWSfyW/iyT+C19mixelm36tf3qKPGP0636nf312P1StGyTr+2fOyDz9Et04IDs0/+lBwesMP1vunAAAACwxvf/SR8OAAAAAAAAAAAAAAAAgIxNZkiQX2c4AAAA8EtoRfh1jgO8c3rewQkcECGt6RmbwQFRMrteoSnNmhApHZ5FS2+PjstxB0SIrHuGJS1Kbt8rKaoZssL/DMYibnGM7MOirrKMOp+NEWFnSNgak4X3Bilq8XoD+nSHZsHPs80AAAAASUVORK5CYII=';

const meta = {
  title: 'Shell/ProjectMark',
  component: ProjectMark,
  tags: ['autodocs'],
  args: { project: STORE, iconHref: SITE_ICON },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-3 rounded-card bg-nav p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SiteIcon: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('project-icon')).toBeInTheDocument();
  },
};

export const Initials: Story = {
  args: { iconHref: null },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('MS')).toBeInTheDocument();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
