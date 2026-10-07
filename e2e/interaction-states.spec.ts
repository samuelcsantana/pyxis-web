import { expect, type Locator, type Page, test } from '@playwright/test';
import { MIN_NON_TEXT_CONTRAST, MIN_STATE_CHANGE } from './contrast';
import { focusRing } from './focus-ring';
import { readPaint } from './paint';
import { pointerStates } from './pointer-states';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

interface Representative {
  readonly control: string;
  readonly screen: string;
  readonly target: (page: Page) => Locator;
  readonly ring?: (page: Page) => Locator;
  readonly prepare?: (page: Page, isMobile: boolean) => Promise<void>;
}

const periods = (page: Page) => page.getByRole('navigation', { name: 'Period' });

const REPRESENTATIVES: readonly Representative[] = [
  {
    control: 'a period preset',
    screen: 'overview',
    target: (page) => periods(page).getByRole('link', { name: '7 days' }),
  },
  {
    control: 'the selected period',
    screen: 'overview',
    target: (page) => periods(page).getByRole('link', { name: '30 days' }),
  },
  {
    control: 'the custom period',
    screen: 'overview',
    target: (page) => page.locator('summary').filter({ hasText: 'Custom' }),
  },
  {
    control: 'the theme toggle',
    screen: 'overview',
    target: (page) => page.getByRole('button', { name: /theme/ }),
  },
  {
    control: 'a feature tab',
    screen: 'features',
    target: (page) =>
      page.getByRole('navigation', { name: 'Feature kind' }).getByRole('link', { name: 'Screens' }),
  },
  {
    control: 'the feature search field',
    screen: 'features',
    target: (page) => page.getByRole('searchbox'),
    ring: (page) => page.locator('label').filter({ has: page.getByRole('searchbox') }),
  },
  {
    control: 'a requests filter',
    screen: 'requests',
    target: (page) =>
      page.getByRole('navigation', { name: 'Show' }).getByRole('link', { name: 'Failing only' }),
  },
  {
    control: 'a visits filter field',
    screen: 'visits',
    target: (page) => page.getByRole('textbox', { name: 'Had event' }),
  },
  {
    control: 'a visits filter select',
    screen: 'visits',
    target: (page) => page.getByRole('combobox', { name: 'Channel' }),
  },
  {
    control: 'the funnel Apply button',
    screen: 'funnel',
    target: (page) => page.getByRole('button', { name: 'Apply' }),
    prepare: async (page) => {
      await page.getByRole('button', { name: 'Edit steps' }).click();
      await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('/pricing');
      await page.getByRole('textbox', { name: 'Step 2 event name' }).fill('cta_clicked');
    },
  },
  {
    control: 'a sidebar link',
    screen: 'overview',
    target: (page) =>
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Funnel' }),
    prepare: async (page, isMobile) => {
      if (isMobile) {
        await page.getByRole('button', { name: 'Open menu' }).click();
      }
    },
  },
];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`focus rings, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const { control, screen, target, ring, prepare } of REPRESENTATIVES) {
      test(`${control} on ${screen} shows a ring at 3:1 or more`, async ({ page, isMobile }) => {
        await page.goto(`/${STORE_ID}/${screen}`);
        await prepare?.(page, isMobile);

        const reading = await focusRing(target(page), ring?.(page));

        expect(reading.focusVisible).toBe(true);
        expect(reading.drawn).toBe(true);
        expect(reading.contrast).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST);
      });
    }
  });
}

interface SidebarControl {
  readonly control: string;
  readonly target: (page: Page) => Locator;
  readonly prepare?: (page: Page) => Promise<void>;
}

const switcher = (page: Page) => page.locator('details', { hasText: 'Switch project' });

const SIDEBAR_CONTROLS: readonly SidebarControl[] = [
  {
    control: 'a sidebar link',
    target: (page) =>
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Funnel' }),
  },
  {
    control: 'the sign-out button',
    target: (page) => page.getByRole('button', { name: 'Sign out' }),
  },
  {
    control: 'the project switcher',
    target: (page) => switcher(page).locator('summary'),
  },
  {
    control: 'a project in the switcher',
    target: (page) => switcher(page).locator('a:not([aria-current])').first(),
    prepare: async (page) => {
      await switcher(page).locator('summary').click();
    },
  },
];

test.describe('sidebar states on a desktop', () => {
  for (const { control, target, prepare } of SIDEBAR_CONTROLS) {
    test(`${control} changes visibly on hover and on press`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'Phones have no hover; the menu button covers pressing on a phone.');
      await page.goto(`/${STORE_ID}/overview`);
      await prepare?.(page);

      const states = await pointerStates(target(page));

      expect(states.hover).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
      expect(states.pressed).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
    });
  }
});

test('the menu button changes visibly when pressed on a phone', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only shows on narrow screens.');
  await page.goto(`/${STORE_ID}/overview`);

  const states = await pointerStates(page.getByRole('button', { name: 'Open menu' }));

  expect(states.pressed).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
});

test('buttons and disclosure summaries show the pointer cursor', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits`);
  const applyFilters = await readPaint(page.getByRole('button', { name: 'Apply filters' }));
  const custom = await readPaint(page.locator('summary').filter({ hasText: 'Custom' }));

  expect(applyFilters.cursor).toBe('pointer');
  expect(custom.cursor).toBe('pointer');
});
