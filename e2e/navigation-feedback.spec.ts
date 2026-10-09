import { expect, type Locator, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';
import { documentMarker, holdScreenRequests, markTheDocument } from './navigation';
import { pickCustomRange } from './range-calendar';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DEMO_USER = 'u_7f3a';

async function expectShownInside(control: Locator) {
  const mark = control.locator('[data-pending]');
  const [controlBox, markBox] = await Promise.all([control.boundingBox(), mark.boundingBox()]);
  if (controlBox === null || markBox === null) {
    throw new Error('the control or its pending mark is not laid out');
  }
  expect(markBox.x).toBeGreaterThanOrEqual(controlBox.x);
  expect(markBox.y).toBeGreaterThanOrEqual(controlBox.y);
  expect(markBox.x + markBox.width).toBeLessThanOrEqual(controlBox.x + controlBox.width);
  expect(markBox.y + markBox.height).toBeLessThanOrEqual(controlBox.y + controlBox.height);
  await expect
    .poll(() => mark.evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBeGreaterThan(0);
}

function screenRegion(page: Page): Locator {
  return page.locator('div:has(> main)');
}

async function expectScreenBusy(page: Page) {
  const region = screenRegion(page);
  await expect(region).toHaveAttribute('aria-busy', 'true');
  await expect
    .poll(() =>
      page.getByRole('main').evaluate((main) => Number(getComputedStyle(main, '::before').opacity)),
    )
    .toBeGreaterThan(0);
}

async function expectScreenAtRest(page: Page) {
  await expect(screenRegion(page)).not.toHaveAttribute('aria-busy');
}

async function openReadyPage(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await markTheDocument(page);
}

test('marks the clicked period and keeps the content busy until the period arrives', async ({
  page,
}) => {
  await openReadyPage(page, `/${STORE_ID}/overview`);
  const release = await holdScreenRequests(page);
  const sevenDays = page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' });

  await sevenDays.click();

  await expectShownInside(sevenDays);
  await expectScreenBusy(page);
  await expect(sevenDays).not.toHaveAttribute('aria-current');
  expect(await axeViolations(page)).toEqual([]);

  release();

  await expect(page).toHaveURL(/range=7d$/);
  await expect(sevenDays).toHaveAttribute('aria-current', 'page');
  await expectScreenAtRest(page);
  await expect(page.locator('[data-pending]')).toHaveCount(0);
  expect(await documentMarker(page)).toBe('kept');
});

test('marks the pressed KPI card and keeps the content busy until its chart arrives', async ({
  page,
}) => {
  await openReadyPage(page, `/${STORE_ID}/overview`);
  const release = await holdScreenRequests(page);
  const visitsCard = page.getByRole('group', { name: 'Visits', exact: true });

  await visitsCard.getByRole('button', { name: 'Visits', exact: true }).click();

  await expectShownInside(visitsCard);
  await expectScreenBusy(page);
  expect(await axeViolations(page)).toEqual([]);

  release();

  await expect(page).toHaveURL(/\/overview\?metric=visits$/);
  await expect(page.getByRole('region', { name: 'Visits per day' })).toBeVisible();
  await expectScreenAtRest(page);
  await expect(page.locator('[data-pending]')).toHaveCount(0);
  expect(await documentMarker(page)).toBe('kept');
});

test('marks the clicked tab while its list loads', async ({ page }) => {
  await openReadyPage(page, `/${STORE_ID}/features?range=7d`);
  const release = await holdScreenRequests(page);
  const screens = page
    .getByRole('navigation', { name: 'Feature kind' })
    .getByRole('link', { name: 'Screens', exact: true });

  await screens.click();

  await expectShownInside(screens);
  await expectScreenBusy(page);

  release();

  await expect(page).toHaveURL(/kind=screens$/);
  await expectScreenAtRest(page);
});

test('searches the features in place and says so while it waits', async ({ page }) => {
  await openReadyPage(page, `/${STORE_ID}/features?range=30d`);
  const release = await holdScreenRequests(page);

  await page.getByRole('searchbox', { name: 'Search events' }).fill('signup');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByRole('button', { name: 'Searching…' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await expectScreenBusy(page);

  release();

  await expect(page).toHaveURL(/q=signup/);
  await expect(page.getByRole('button', { name: 'Search' })).not.toHaveAttribute('aria-busy');
  await expectScreenAtRest(page);
  expect(await documentMarker(page)).toBe('kept');
});

test('applies a custom period in place and closes its form', async ({ page }) => {
  await openReadyPage(page, `/${STORE_ID}/overview`);
  const custom = page.locator('details', { hasText: 'Custom' });

  await custom.locator('summary').click();
  await pickCustomRange(page, 'August 2026', 'Saturday, August 1, 2026', 'Monday, August 31, 2026');

  await expect(page).toHaveURL(/from=2026-08-01&to=2026-08-31$/);
  await expect(page.getByText('Aug 1 – Aug 31, 2026', { exact: true })).toBeVisible();
  await expect(custom).not.toHaveAttribute('open');
  expect(await documentMarker(page)).toBe('kept');
});

test('filters the visits in place', async ({ page, isMobile }) => {
  await openReadyPage(page, `/${STORE_ID}/visits?range=30d`);
  if (isMobile) {
    await page.getByRole('button', { name: /^Filters/ }).click();
  }

  await page.getByRole('textbox', { name: 'Viewed page' }).fill('/pricing');
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/range=30d&path=%2Fpricing/);
  await expect(page.getByRole('textbox', { name: 'Viewed page' })).toHaveValue('/pricing');
  expect(await documentMarker(page)).toBe('kept');
});

test('looks up a timeline in place', async ({ page }) => {
  await openReadyPage(page, `/${STORE_ID}/timeline`);

  await page.getByRole('textbox', { name: 'User id' }).fill(DEMO_USER);
  await page.getByRole('button', { name: 'Show timeline' }).click();

  await expect(page).toHaveURL(new RegExp(`user=${DEMO_USER}$`));
  expect(await documentMarker(page)).toBe('kept');
});

test('applies edited funnel steps in place', async ({ page }) => {
  await openReadyPage(page, `/${STORE_ID}/funnel?range=30d`);

  await page.getByRole('button', { name: 'Edit steps' }).click();
  await page.getByRole('button', { name: 'Remove step 6' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/steps=/);
  expect(await documentMarker(page)).toBe('kept');
});
