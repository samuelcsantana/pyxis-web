import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { SectionNav } from './section-nav';
import { SETTINGS_SECTIONS } from './settings-sections';

const meta = {
  title: 'Settings/SectionNav',
  component: SectionNav,
  tags: ['autodocs'],
  args: { current: 'general', available: SETTINGS_SECTIONS, projectName: 'Demo Store' },
  decorators: [
    (Story) => (
      <div className="w-60 bg-card p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnGeneral: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'General' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const OnGeneralDark: Story = { ...OnGeneral, globals: { theme: 'dark' } };

export const BeforeTheContentArrives: Story = { args: { available: null, current: 'keys' } };

export const ForAMember: Story = {
  args: { available: SETTINGS_SECTIONS.filter((section) => section !== 'data') },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('link', { name: 'Export and delete' }),
    ).toBeNull();
  },
};

export const AsTheListOnAPhone: Story = {
  args: { current: null },
  globals: { viewport: { value: 'mobile1' } },
};

export const LongProjectName: Story = {
  args: { projectName: 'Customer Self-Service Portal (Production)' },
  play: async ({ canvasElement }) => {
    const name = within(canvasElement).getByText('Customer Self-Service Portal (Production)');
    await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth);
  },
};

export const Hovered: Story = { parameters: { pseudo: { hover: ['a[href="#settings/keys"]'] } } };

export const BrazilianPortuguese: Story = { globals: { locale: 'pt-BR' } };
