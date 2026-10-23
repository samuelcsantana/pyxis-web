import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';
import { holdScreenRequests } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const HEADER_MARKER = 'pyxisE2eHeader';
const PREFETCH_REQUESTS_PER_SCREEN = 2;
const LOCALES = ['en-US', 'pt-BR', 'es', 'de', 'fr', 'it', 'nl'] as const;
const SCREENS_WITH_A_PERIOD = [
  'overview',
  'funnel',
  'features',
  'requests',
  'visits',
  'devices',
  'acquisition',
] as const;
const CUSTOM_PERIOD = 'from=2026-08-01&to=2026-08-31';
const REFUSED_PERIOD = 'from=2026-08-31&to=2026-08-01';

async function markTheHeader(page: Page): Promise<void> {
  await page.getByRole('banner').evaluate((header, name) => {
    Reflect.set(window, name, header);
  }, HEADER_MARKER);
}

function theMarkedHeaderIsShown(page: Page): Promise<boolean> {
  return page.evaluate((name) => {
    const marked: unknown = Reflect.get(window, name);
    return marked instanceof HTMLElement && marked.isConnected;
  }, HEADER_MARKER);
}

async function openTheMenu(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
}

function screenLink(page: Page, name: string) {
  return page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name, exact: true });
}

function periodLink(page: Page, name: string) {
  return page.getByRole('navigation', { name: 'Period' }).getByRole('link', { name });
}

async function waitForPrefetchOf(page: Page, screen: string): Promise<void> {
  await page.waitForFunction(
    ({ path, count }) =>
      performance
        .getEntriesByType('resource')
        .filter((entry) => entry.name.includes(`${path}?_rsc=`)).length >= count,
    { path: `/${STORE_ID}/${screen}`, count: PREFETCH_REQUESTS_PER_SCREEN },
  );
}

function watchConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}

test('keeps the same header while the screen and then the period change', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await markTheHeader(page);

  await openTheMenu(page, isMobile);
  await screenLink(page, 'Funnel').click();

  await expect(page.getByRole('heading', { level: 1, name: 'Funnel' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/funnel\\?range=7d$`));
  expect(await theMarkedHeaderIsShown(page)).toBe(true);

  await periodLink(page, '30 days').click();

  await expect(periodLink(page, '30 days')).toHaveAttribute('aria-current', 'page');
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/funnel\\?range=30d`));
  expect(await theMarkedHeaderIsShown(page)).toBe(true);
});

test('shows the real subtitle and period of the destination while it loads', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A phone hides the subtitle of the header.');
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await waitForPrefetchOf(page, 'devices');
  const release = await holdScreenRequests(page);

  await screenLink(page, 'Devices').click();

  const header = page.getByRole('banner');
  await expect(header.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
  await expect(header.getByText('What people use to reach My site')).toBeVisible();
  await expect(periodLink(page, '30 days')).toHaveAttribute('aria-current', 'page');
  await expect(header.locator('.motion-safe\\:animate-pulse:visible')).toHaveCount(0);
  await expect(page.getByRole('main')).toHaveAttribute('aria-busy', 'true');
  expect(await axeViolations(page)).toEqual([]);

  release();

  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
});

test('takes a period chosen while a screen loads to that screen and period', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await openTheMenu(page, isMobile);
  await waitForPrefetchOf(page, 'acquisition');
  const release = await holdScreenRequests(page);

  await screenLink(page, 'Acquisition').click();
  await expect(page.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeVisible();
  await periodLink(page, '7 days').click();
  release();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=7d$`));
  await expect(periodLink(page, '7 days')).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
});

test('keeps the focus on the period chosen', async ({ page, isMobile }) => {
  test.skip(isMobile, 'A tap does not leave a keyboard focus to keep.');
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');

  await periodLink(page, '30 days').focus();
  await page.keyboard.press('Enter');

  await expect(periodLink(page, '30 days')).toHaveAttribute('aria-current', 'page');
  await expect(periodLink(page, '30 days')).toBeFocused();
});

for (const locale of LOCALES) {
  test.describe(`a browser that asks for ${locale}`, () => {
    test.use({ locale });

    test('opens a custom period and a refused one on every screen with a period, without a hydration error', async ({
      page,
    }) => {
      const errors = watchConsoleErrors(page);

      for (const screen of SCREENS_WITH_A_PERIOD) {
        for (const query of [CUSTOM_PERIOD, REFUSED_PERIOD]) {
          await page.goto(`/${STORE_ID}/${screen}?${query}`);
          await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
          await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        }
      }

      expect(errors).toEqual([]);
    });
  });
}
