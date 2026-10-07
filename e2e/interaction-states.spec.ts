import { expect, type Locator, type Page, test } from '@playwright/test';
import { MIN_NON_TEXT_CONTRAST } from './contrast';
import { focusRing } from './focus-ring';

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
