import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DEMO_EXPORT_ID } from '@/services/exports/mock-exports-service';
import { demoAdminOf } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { MobileMenu } from './mobile-menu';
import { Sidebar } from './sidebar';

const DEMO_ADMIN = demoAdminOf(english.t, new Date('2026-10-06T02:30:00.000Z'));
const [STORE] = DEMO_ADMIN.projects;
if (STORE === undefined) {
  throw new Error('The demo admin has no project.');
}

const LONG_PROJECT = {
  ...STORE,
  name: 'Customer Self-Service Portal (Production)',
  timezone: 'America/Argentina/Buenos_Aires',
};

const meta = {
  title: 'Shell/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { project: STORE },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${STORE.id}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[900px] w-[248px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverviewSelected: Story = {};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Sem cookies, sem dados pessoais')).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Visão geral' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Configurações' })).toBeVisible();
    await expect(canvas.queryByText('Conta e preferências')).toBeNull();
  },
};

const FILTERED_DEVICES_VIEW = { range: '7d', device: 'mobile' };

export const LogoKeepsTheView: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${STORE.id}/devices`, query: FILTERED_DEVICES_VIEW },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      `/${STORE.id}/overview?${new URLSearchParams(FILTERED_DEVICES_VIEW).toString()}`,
    );
  },
};

const onPageOf = (segment: string) => ({
  nextjs: { appDirectory: true, navigation: { pathname: `/${STORE.id}/${segment}` } },
});

const currentLinksOutsideTheMenus = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .queryAllByRole('link', { current: 'page' })
    .filter((link) => link.closest('details') === null);

const standsForThePage =
  (name: string): Play =>
  async ({ canvasElement }) => {
    const current = currentLinksOutsideTheMenus(canvasElement);
    await expect(current).toHaveLength(1);
    await expect(current[0]).toHaveAccessibleName(name);
    await expect(canvasElement.querySelector('summary[data-current]')).toBeNull();
  };

export const OnInstall: Story = {
  parameters: onPageOf('install'),
  play: standsForThePage('Install'),
};

export const OnAnExport: Story = {
  parameters: onPageOf(`exports/${DEMO_EXPORT_ID}`),
  play: standsForThePage('Settings'),
};

const NO_EVENTS_YET = { ...STORE, firstEventAt: null };

function spokenWithItsTag(label: string, tag: string): RegExp {
  return new RegExp(`^${label}\\s*, ${tag}$`);
}

const theInstallGuideIsPending: Play = async ({ canvasElement }) => {
  const install = within(canvasElement).getByRole('link', {
    name: spokenWithItsTag('Install', 'Pending'),
  });
  const tag = within(install).getByText('Pending');
  await expect(tag).toBeVisible();
  await expect(tag.parentElement?.getBoundingClientRect().right).toBeLessThanOrEqual(
    install.getBoundingClientRect().right,
  );
};

export const NoEventsYet: Story = {
  args: { project: NO_EVENTS_YET },
  play: theInstallGuideIsPending,
};

export const NoEventsYetDark: Story = {
  args: { project: NO_EVENTS_YET },
  globals: { theme: 'dark' },
  play: theInstallGuideIsPending,
};

const pendingTagFitsIn =
  (install: string, pending: string): Play =>
  async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: spokenWithItsTag(install, pending),
    });
    const tag = within(link).getByText(pending);
    const pill = boxOf(tag.parentElement);
    const box = link.getBoundingClientRect();
    await expect(pill.height).toBeLessThanOrEqual(TAG_LINE_HEIGHT_PX);
    await expect(pill.left).toBeGreaterThanOrEqual(box.left);
    await expect(pill.right).toBeLessThanOrEqual(box.right);
    await expect(pill.bottom).toBeLessThanOrEqual(box.bottom);
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
  };

const TAG_LINE_HEIGHT_PX = 20;
const NO_EVENTS_YET_ARGS = { project: NO_EVENTS_YET };
const NARROWED_BY_A_SCROLLBAR: NonNullable<Story['decorators']> = [
  (Story) => (
    <div className="w-[233px]">
      <Story />
    </div>
  ),
];

export const NoEventsYetInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  globals: { locale: 'nl' },
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetInGerman: Story = {
  args: NO_EVENTS_YET_ARGS,
  globals: { locale: 'de' },
  play: pendingTagFitsIn('Installieren', 'Ausstehend'),
};

export const NoEventsYetOnInstallInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'nl' },
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetNarrowedInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'nl' },
  decorators: NARROWED_BY_A_SCROLLBAR,
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetNarrowedInGerman: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'de' },
  decorators: NARROWED_BY_A_SCROLLBAR,
  play: pendingTagFitsIn('Installieren', 'Ausstehend'),
};

const marksNothingOnHelp: Play = async ({ canvasElement }) => {
  await expect(currentLinksOutsideTheMenus(canvasElement)).toHaveLength(0);
  await expect(within(canvasElement).queryByRole('link', { name: 'Help and support' })).toBeNull();
};

export const OnHelp: Story = {
  parameters: onPageOf('help'),
  play: marksNothingOnHelp,
};

export const OnHelpDark: Story = {
  parameters: onPageOf('help'),
  globals: { theme: 'dark' },
  play: marksNothingOnHelp,
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const funnel = within(canvasElement).getByRole('link', { name: 'Funnel' });
    funnel.focus();
    await expect(funnel).toHaveFocus();
  },
};

export const Hovered: Story = {
  parameters: {
    pseudo: { hover: ['a[href*="/funnel"]'] },
  },
};

export const Pressed: Story = {
  parameters: { pseudo: { active: ['a[href*="/devices"]'] } },
};

type Play = NonNullable<Story['play']>;

const insideTheMobileMenu: NonNullable<Story['decorators']> = [
  (Story, { args }) => (
    <div className="w-[390px]">
      <MobileMenu project={args.project} homeLabel={`Overview · ${args.project.name}`}>
        <Story />
      </MobileMenu>
    </div>
  ),
];

export const OnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
};

const PHONE_TOUCH_TARGET_PX = 44;

export const OnAPhoneWithALongProjectName: Story = {
  args: { project: LONG_PROJECT },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const home = canvas.getByRole('link', { name: `Overview · ${LONG_PROJECT.name}` });
    const name = within(home).getByText(LONG_PROJECT.name);
    await expect(getComputedStyle(name).textOverflow).toBe('ellipsis');
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    const button = boxOf(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(button.width).toBe(PHONE_TOUCH_TARGET_PX);
    await expect(button.height).toBe(PHONE_TOUCH_TARGET_PX);
    await expect(home.getBoundingClientRect().right).toBeLessThanOrEqual(button.left);
  },
};

const SHORT_LAPTOP_WINDOW = { width: 1366, height: 650 } as const;
const SHORT_LAPTOP = 'shortLaptop';

function boxOf(element: Element | null): DOMRect {
  if (element === null) {
    throw new Error('The sidebar part is missing.');
  }
  return element.getBoundingClientRect();
}

export const ShortWindow: Story = {
  parameters: {
    viewport: {
      options: {
        [SHORT_LAPTOP]: {
          name: 'Laptop window, 1366×650',
          styles: {
            width: `${String(SHORT_LAPTOP_WINDOW.width)}px`,
            height: `${String(SHORT_LAPTOP_WINDOW.height)}px`,
          },
        },
      },
    },
  },
  globals: { viewport: { value: SHORT_LAPTOP, isRotated: false } },
  decorators: [
    (Story, { args }) => (
      <MobileMenu project={args.project} homeLabel={`Overview · ${args.project.name}`}>
        <Story />
      </MobileMenu>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(window.innerHeight).toBe(SHORT_LAPTOP_WINDOW.height);
    const screens = canvas.getByRole('link', { name: 'Overview' }).closest('ul')?.parentElement;
    await expect(screens?.scrollHeight).toBe(screens?.clientHeight);
    const settings = boxOf(canvas.getByRole('link', { name: 'Settings' }));
    await expect(settings.top).toBeGreaterThanOrEqual(0);
    await expect(settings.bottom).toBeLessThanOrEqual(SHORT_LAPTOP_WINDOW.height);
  },
};

const openTheMenu: Play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  await expect(canvas.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(canvas.getByRole('link', { name: 'Funnel' })).toBeVisible();
};

export const MenuOpenOnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: openTheMenu,
};

export const MenuOpenOnAPhoneDark: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  globals: { theme: 'dark' },
  decorators: insideTheMobileMenu,
  play: openTheMenu,
};

export const MenuClosedWithEscape: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  },
};

export const MenuButtonPressed: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    pseudo: { active: ['button[aria-controls="main-navigation"]'] },
  },
  decorators: insideTheMobileMenu,
};
