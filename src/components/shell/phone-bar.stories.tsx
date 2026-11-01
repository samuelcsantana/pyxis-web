import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { demoAdminOf } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { withProjectChoices } from '@/test-utils/project-choices';
import { PhoneBar } from './phone-bar';
import { PhoneBarSlotsProvider } from './phone-bar-slots';
import { ScreenTopbar } from './screen-topbar';
import { screenTopbarTexts } from './screen-topbar-texts';

const DEMO_ADMIN = demoAdminOf(english.t, new Date('2026-10-06T02:30:00.000Z'));
const [STORE] = DEMO_ADMIN.projects;
if (STORE === undefined) {
  throw new Error('The demo admin has no project.');
}
const STORE_ID = STORE.id;

const MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO = Date.UTC(2026, 9, 5, 15);
const PHONE = { viewport: { value: 'mobile2', isRotated: false } };
const TOUCH_TARGET_PX = 44;

function at(page: string, query: Readonly<Record<string, string>> = {}) {
  return {
    nextjs: { appDirectory: true, navigation: { pathname: `/${STORE_ID}/${page}`, query } },
  };
}

const meta = {
  title: 'Shell/Phone bar',
  component: PhoneBar,
  tags: ['autodocs'],
  args: { project: STORE },
  parameters: { layout: 'fullscreen', ...at('overview') },
  globals: PHONE,
  decorators: [
    (Story) =>
      withProjectChoices(
        <PhoneBarSlotsProvider>
          <div className="min-h-[640px] bg-bg">
            <ScreenTopbar
              projectId={STORE.id}
              timeZone="America/Sao_Paulo"
              serverNow={MIDDAY_OF_OCTOBER_5_IN_SAO_PAULO}
              texts={screenTopbarTexts(english)}
            >
              <p className="text-sm text-muted">Country: Brazil</p>
            </ScreenTopbar>
            <Story />
          </div>
        </PhoneBarSlotsProvider>,
      ),
  ],
} satisfies Meta<typeof PhoneBar>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

function bar(canvasElement: HTMLElement) {
  return within(within(canvasElement).getByRole('navigation', { name: 'Main navigation' }));
}

const keepsTouchTargets: Play = async ({ canvasElement }) => {
  for (const item of [
    bar(canvasElement).getByRole('button', { name: 'Screens' }),
    bar(canvasElement).getByRole('link', { name: 'Account' }),
  ]) {
    const box = item.getBoundingClientRect();
    await expect(box.height).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
    await expect(box.width).toBeGreaterThanOrEqual(TOUCH_TARGET_PX);
  }
  await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
};

export const Closed: Story = { play: keepsTouchTargets };

export const ClosedDark: Story = { globals: { ...PHONE, theme: 'dark' }, play: keepsTouchTargets };

const opens =
  (button: string | RegExp, sheet: string, inside: string | RegExp): Play =>
  async ({ canvasElement }) => {
    await userEvent.click(bar(canvasElement).getByRole('button', { name: button }));
    const dialog = within(document.body).getByRole('dialog', { name: sheet });
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getByText(inside)).toBeVisible();
    await expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      bar(canvasElement).getByRole('button', { name: button }).getBoundingClientRect().top + 1,
    );
  };

export const ScreensOpen: Story = { play: opens('Screens', 'Screens', 'Funnel') };

export const ScreensOpenDark: Story = {
  globals: { ...PHONE, theme: 'dark' },
  play: opens('Screens', 'Screens', 'Funnel'),
};

export const PeriodOpen: Story = {
  play: async (context) => {
    await expect(
      bar(context.canvasElement).getByRole('button', { name: 'Period 30 days' }),
    ).toHaveTextContent('30 days');
    await opens(/^Period/, 'Period', '30 days')(context);
  },
};

export const PeriodOpenDark: Story = {
  globals: { ...PHONE, theme: 'dark' },
  play: opens(/^Period/, 'Period', '30 days'),
};

export const PeriodOpenWithARejectedRange: Story = {
  parameters: at('overview', { from: '2026-10-05', to: '2026-09-20' }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toBeVisible();
    await userEvent.click(bar(canvasElement).getByRole('button', { name: /^Period/ }));
    const dialog = within(document.body).getByRole('dialog', { name: 'Period' });
    await expect(within(dialog).getByText(/^Custom,/)).toBeVisible();
  },
};

export const FiltersOpenWithoutFilters: Story = {
  play: opens('Filters', 'Filters', /^No filters\./),
};

export const FiltersOpenWithFilters: Story = {
  parameters: at('overview', { country: 'BR' }),
  play: opens('Filters, 1', 'Filters', 'Country: Brazil'),
};

export const FiltersOpenWithFiltersDark: Story = {
  parameters: at('overview', { country: 'BR' }),
  globals: { ...PHONE, theme: 'dark' },
  play: opens('Filters, 1', 'Filters', 'Country: Brazil'),
};

export const OnTheTimeline: Story = {
  parameters: at('timeline', {}),
  play: async ({ canvasElement }) => {
    await expect(bar(canvasElement).getByRole('button', { name: /^Period/ })).toBeDisabled();
    await expect(bar(canvasElement).getByRole('button', { name: 'Filters' })).toBeDisabled();
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const period = bar(canvasElement).getByRole('button', { name: /^Period/ });
    period.focus();
    await expect(period).toHaveFocus();
  },
};

export const Pressed: Story = {
  parameters: { pseudo: { active: ['nav button:first-of-type'] } },
};

export const PressedDark: Story = {
  parameters: { pseudo: { active: ['nav button:first-of-type'] } },
  globals: { ...PHONE, theme: 'dark' },
};

export const BrazilianPortuguese: Story = {
  globals: { ...PHONE, locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const navigation = within(canvasElement).getByRole('navigation', {
      name: 'Navegação principal',
    });
    for (const name of ['Telas', /^Período/, 'Filtros']) {
      await expect(within(navigation).getByRole('button', { name })).toBeVisible();
    }
    await expect(within(navigation).getByRole('link', { name: 'Conta' })).toBeVisible();
  },
};
