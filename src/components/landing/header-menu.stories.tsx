import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { LINK_MENU } from './landing-classes';
import { HeaderMenu } from './header-menu';

const SECTIONS = [
  ['#never-stored', 'Privacy'],
  ['#ask-claude', 'Ask Claude'],
  ['#install', 'Install'],
  ['#pricing', 'Pricing'],
] as const;

const meta = {
  title: 'Landing/HeaderMenu',
  component: HeaderMenu,
  args: {
    label: 'Menu',
    className: '',
    children: (
      <nav aria-label="Main">
        <ul className="flex flex-col gap-0.5">
          {SECTIONS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className={LINK_MENU}
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ),
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-80 justify-end bg-bg p-4 text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Folded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Pricing', hidden: true })).not.toBeVisible();
  },
};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Menu'));
    await expect(
      within(canvas.getByRole('navigation', { name: 'Main' })).getAllByRole('link'),
    ).toHaveLength(SECTIONS.length);
    const pricing = canvas.getByRole('link', { name: 'Pricing' });
    await userEvent.click(pricing);
    await expect(pricing).not.toBeVisible();
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
