import { expect, type Locator, type Page, test } from '@playwright/test';
import { contrastRatio, MIN_NON_TEXT_CONTRAST, MIN_STATE_CHANGE } from './contrast';
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

async function editFunnelSteps(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Edit steps' }).click();
  await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('/pricing');
  await page.getByRole('textbox', { name: 'Step 2 event name' }).fill('cta_clicked');
}

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
    prepare: editFunnelSteps,
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

interface ContentControl {
  readonly control: string;
  readonly screen: string;
  readonly target: (page: Page) => Locator;
  readonly prepare?: (page: Page) => Promise<void>;
}

const CONTENT_CONTROLS: readonly ContentControl[] = [
  {
    control: 'a primary button',
    screen: 'visits',
    target: (page) => page.getByRole('button', { name: 'Apply filters' }),
  },
  {
    control: 'the strong funnel Apply button',
    screen: 'funnel',
    target: (page) => page.getByRole('button', { name: 'Apply' }),
    prepare: editFunnelSteps,
  },
  {
    control: 'a secondary button',
    screen: 'features',
    target: (page) => page.getByRole('button', { name: 'Search' }),
  },
  {
    control: 'an icon button',
    screen: 'overview',
    target: (page) => page.getByRole('button', { name: /theme/ }),
  },
  {
    control: 'a segmented option',
    screen: 'overview',
    target: (page) => periods(page).getByRole('link', { name: '7 days' }),
  },
  {
    control: 'a tab',
    screen: 'features',
    target: (page) =>
      page.getByRole('navigation', { name: 'Feature kind' }).getByRole('link', { name: 'Screens' }),
  },
  {
    control: 'a filter pill',
    screen: 'timeline?user=u_7f3a',
    target: (page) => page.getByRole('link', { name: 'Errors only' }),
  },
];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`content control states, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const { control, screen, target, prepare } of CONTENT_CONTROLS) {
      test(`${control} on ${screen} changes visibly on hover`, async ({ page, isMobile }) => {
        test.skip(isMobile, 'Phones have no hover.');
        await page.goto(`/${STORE_ID}/${screen}`);
        await prepare?.(page);

        const states = await pointerStates(target(page));

        expect(states.rest.cursor).toBe('pointer');
        expect(states.hover).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
      });

      test(`${control} on ${screen} changes visibly when pressed`, async ({ page }) => {
        await page.goto(`/${STORE_ID}/${screen}`);
        await prepare?.(page);

        const states = await pointerStates(target(page));

        expect(states.pressed).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
      });
    }
  });
}

test('buttons and disclosure summaries show the pointer cursor', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits`);
  const applyFilters = await readPaint(page.getByRole('button', { name: 'Apply filters' }));
  const custom = await readPaint(page.locator('summary').filter({ hasText: 'Custom' }));

  expect(applyFilters.cursor).toBe('pointer');
  expect(custom.cursor).toBe('pointer');
});

test('a button that cannot be used yet is dimmed and shows the not-allowed cursor', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/funnel`);
  await page.getByRole('button', { name: 'Edit steps' }).click();

  const moveUp = page.getByRole('button', { name: 'Move step 1 up' });
  await expect(moveUp).toBeDisabled();
  const paint = await readPaint(moveUp);

  expect(paint.opacity).toBe(0.5);
  expect(paint.cursor).toBe('not-allowed');
});

interface FormField {
  readonly field: string;
  readonly path: string;
  readonly target: (page: Page) => Locator;
}

const FORM_FIELDS: readonly FormField[] = [
  {
    field: 'a visits filter field',
    path: `/${STORE_ID}/visits`,
    target: (page) => page.getByRole('textbox', { name: 'Had event' }),
  },
  {
    field: 'a visits filter select',
    path: `/${STORE_ID}/visits`,
    target: (page) => page.getByRole('combobox', { name: 'Channel' }),
  },
  {
    field: 'the timeline look-up field',
    path: `/${STORE_ID}/timeline`,
    target: (page) => page.getByRole('textbox', { name: 'User id' }),
  },
  {
    field: 'the feature search field',
    path: `/${STORE_ID}/features`,
    target: (page) => page.locator('label').filter({ has: page.getByRole('searchbox') }),
  },
  {
    field: 'the sign-in email field',
    path: '/sign-in',
    target: (page) => page.getByLabel('Email'),
  },
];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`form field borders, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const { field, path, target } of FORM_FIELDS) {
      test(`${field} has a border at 3:1 or more`, async ({ page }) => {
        await page.goto(path);
        const paint = await readPaint(target(page));

        expect(paint.border).not.toBeNull();
        const border = paint.border ?? paint.fill;
        expect(contrastRatio(border, paint.fill)).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST);
        expect(contrastRatio(border, paint.behind)).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST);
      });
    }
  });
}
