import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { demoAdminOf } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { type ProjectChoices, ProjectChoicesProvider } from './project-choices';
import { ProjectSwitcher } from './project-switcher';

const DEMO_ADMIN = demoAdminOf(english.t, new Date('2026-10-06T02:30:00.000Z'));
const [STORE, DOCS] = DEMO_ADMIN.projects;
if (STORE === undefined || DOCS === undefined) {
  throw new Error('The demo admin has fewer than two projects.');
}

const LONG_PROJECT = {
  ...STORE,
  name: 'Customer Self-Service Portal (Production)',
  timezone: 'America/Argentina/Buenos_Aires',
};

function linesOf(node: Node): DOMRectList {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getClientRects();
}

function SwitcherIn(choices: ProjectChoices) {
  return (
    <ProjectChoicesProvider {...choices}>
      <div className="min-h-96 bg-card p-4 text-ink">
        <ProjectSwitcher />
      </div>
    </ProjectChoicesProvider>
  );
}

const meta = {
  title: 'Shell/Project switcher',
  component: SwitcherIn,
  tags: ['autodocs'],
  args: { projects: DEMO_ADMIN.projects, currentProject: STORE, canCreateProject: false },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${STORE.id}/overview`, query: { range: '7d' } },
    },
  },
} satisfies Meta<typeof SwitcherIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

const open: NonNullable<Story['play']> = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByText('Switch project. Current project:'));
};

const opensWithEveryProjectAndItsTimeZone: NonNullable<Story['play']> = async (context) => {
  await open(context);
  const canvas = within(context.canvasElement);
  for (const project of DEMO_ADMIN.projects) {
    await expect(canvas.getByRole('link', { name: new RegExp(project.name) })).toBeVisible();
    await expect(canvas.getByText(project.timezone)).toBeVisible();
  }
  await expect(canvas.getByRole('link', { name: new RegExp(STORE.name) })).toHaveAttribute(
    'aria-current',
    'page',
  );
};

export const Open: Story = { play: opensWithEveryProjectAndItsTimeZone };

export const OpenDark: Story = {
  globals: { theme: 'dark' },
  play: opensWithEveryProjectAndItsTimeZone,
};

export const OpenWithANewProject: Story = {
  args: { canCreateProject: true },
  play: async (context) => {
    await open(context);
    await expect(
      within(context.canvasElement).getByRole('link', { name: 'New project' }),
    ).toHaveAttribute('href', '/new-project');
  },
};

export const RowHovered: Story = {
  parameters: { pseudo: { hover: [`a[href*="/${DOCS.id}/"]`] } },
  play: open,
};

export const RowPressed: Story = {
  parameters: { pseudo: { active: [`a[href*="/${DOCS.id}/"]`] } },
  play: open,
};

export const RowHoveredDark: Story = {
  globals: { theme: 'dark' },
  parameters: { pseudo: { hover: [`a[href*="/${DOCS.id}/"]`] } },
  play: open,
};

const NARROWEST_PHONE_WIDTH_PX = 320;

export const OpenOnAPhone: Story = {
  args: { projects: [LONG_PROJECT, ...DEMO_ADMIN.projects.slice(1)], currentProject: LONG_PROJECT },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async (context) => {
    await open(context);
    const list = within(context.canvasElement).getByRole('list');
    await expect(window.innerWidth).toBe(NARROWEST_PHONE_WIDTH_PX);
    await expect(list.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const OneProject: Story = { args: { projects: [STORE] }, play: open };

export const LongValues: Story = {
  args: { projects: [LONG_PROJECT, ...DEMO_ADMIN.projects.slice(1)], currentProject: LONG_PROJECT },
  play: async (context) => {
    await open(context);
    const canvas = within(context.canvasElement);
    for (const text of [LONG_PROJECT.name, LONG_PROJECT.timezone]) {
      for (const element of canvas.getAllByText(text)) {
        await expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
        await expect(getComputedStyle(element).textOverflow).not.toBe('ellipsis');
      }
    }
    const zoneParts = [...canvas.getByText(LONG_PROJECT.timezone).childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map(linesOf);
    await expect(zoneParts.map((lines) => lines.length)).toEqual([1, 1, 1]);
  },
};

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByText(STORE.name, { selector: 'summary span' });
    await expect(window.innerWidth).toBe(NARROWEST_PHONE_WIDTH_PX);
    await expect(name.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvas.getByText('Switch project. Current project:')).toBeInTheDocument();
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const summary = within(canvasElement)
      .getByText('Switch project. Current project:')
      .closest('summary');
    summary?.focus();
    await expect(summary).toHaveFocus();
  },
};
