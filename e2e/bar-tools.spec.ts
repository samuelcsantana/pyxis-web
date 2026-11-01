import { expect, type Locator, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';
import {
  expectAppliedFilters,
  hasThePhoneBar,
  openFiltersOnAPhone,
  openScreensOnAPhone,
  screensMenu,
} from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const ON_A_LAPTOP_ONLY =
  'Copy link and Export sit in the top bar from 1024px; a phone has neither.';
const NARROWEST_LAPTOP = { width: 1024, height: 768 };
const SCREENS = [
  'overview',
  'acquisition',
  'devices',
  'features',
  'funnel',
  'visits',
  'timeline',
  'requests',
] as const;

async function openTheFilterForm(page: Page): Promise<Locator> {
  if (hasThePhoneBar(page)) {
    await openFiltersOnAPhone(page);
    return page.getByRole('dialog', { name: 'Filters' });
  }
  const bar = page.getByRole('banner');
  await bar.getByText('Filter', { exact: true }).click();
  return bar;
}

async function screenShown(page: Page): Promise<void> {
  await expect(page.locator('main#content:visible')).not.toHaveAttribute('aria-busy');
}

test('adds a filter from the bar, and every screen keeps it', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  await screenShown(page);

  const form = await openTheFilterForm(page);
  await form.getByLabel('Filter by').selectOption('device');
  await expect(form.getByLabel('Value')).toHaveValue('mobile');
  expect(await axeViolations(page)).toEqual([]);
  await form.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/[?&]device=mobile(&|$)/);
  await screenShown(page);
  await expectAppliedFilters(page, ['Device: Mobile']);

  await openScreensOnAPhone(page, isMobile);
  await screensMenu(page).getByRole('link', { name: 'Acquisition', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?.*device=mobile`));
  await screenShown(page);
  await expectAppliedFilters(page, ['Device: Mobile']);
});

test('adds a typed country to the filters already there', async ({ page }) => {
  await page.goto(`/${STORE_ID}/devices?range=30d&os=ios`);
  await screenShown(page);

  const form = await openTheFilterForm(page);
  await form.getByLabel('Value').fill('br');
  await expect(form.getByLabel('Value')).toHaveValue('BR');
  await form.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/[?&]os=ios&country=BR(&|$)/);
  await screenShown(page);
  await expectAppliedFilters(page, ['System: iOS', 'Country: Brazil']);
});

test.describe('on a laptop', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, ON_A_LAPTOP_ONLY);
  });

  test('copies the link of the view, period and filters included', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`/${STORE_ID}/overview?range=7d&country=BR`);
    await screenShown(page);

    await page.getByRole('banner').getByRole('button', { name: 'Copy link' }).click();

    await expect(page.getByText('Link copied')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
    expect(await axeViolations(page)).toEqual([]);
  });

  test('selects the link for the visitor where the clipboard is refused', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.clipboard.writeText = () => Promise.reject(new Error('denied'));
    });
    await page.goto(`/${STORE_ID}/requests?range=7d`);
    await screenShown(page);
    const copy = page.getByRole('banner').getByRole('button', { name: 'Copy link' });

    await copy.click();

    const link = page.getByRole('textbox', { name: 'Copy link' });
    await expect(link).toBeFocused();
    await expect(link).toHaveValue(page.url());
    expect(await link.evaluate((input: HTMLInputElement) => input.selectionEnd)).toBe(
      page.url().length,
    );
    await page.keyboard.press('Escape');
    await expect(link).toHaveCount(0);
    await expect(copy).toBeFocused();
  });

  test('opens Export events in the settings window, keeping the view', async ({ page }) => {
    await page.goto(`/${STORE_ID}/funnel?range=7d`);
    await screenShown(page);

    await page.getByRole('banner').getByRole('link', { name: 'Export' }).click();

    await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings/export\\?range=7d$`));
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: 'Export events' }),
    ).toBeVisible();
  });

  test('wraps the bar at 1024px without clipping it, on every screen', async ({ page }) => {
    await page.setViewportSize(NARROWEST_LAPTOP);
    for (const screen of SCREENS) {
      await page.goto(`/${STORE_ID}/${screen}?range=30d&country=BR`);
      await screenShown(page);
      const banner = page.getByRole('banner');
      const fits = await banner.evaluate(
        (header) =>
          header.scrollWidth <= header.clientWidth &&
          document.documentElement.scrollWidth <= window.innerWidth,
      );
      expect(fits, screen).toBe(true);
    }
  });
});
