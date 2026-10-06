import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`devices, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/devices`);
      await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the sidebar and keeps the period', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  await page.getByRole('link', { name: 'Devices' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/devices\\?range=7d$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
});

test('lists every value of each breakdown with shares that add up', async ({ page }) => {
  await page.goto(`/${STORE_ID}/devices`);

  for (const name of ['Device type', 'Browser', 'Operating system', 'Countries']) {
    const cells = page.getByRole('table', { name }).locator('tbody tr td:last-child');
    await expect(cells.first()).toBeVisible();
    const shares = await cells.allTextContents();
    const total = shares.reduce((sum, share) => sum + Number(share.replace('%', '')), 0);
    expect(Math.abs(total - 100)).toBeLessThan(1);
  }
  await expect(page.getByRole('table', { name: 'Countries' })).toContainText('Brazil');
  await expect(page.getByRole('table', { name: 'Countries' })).toContainText('Other countries');
});

test('shows conversion by device only when the project has a conversion event', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/devices`);
  await expect(page.getByRole('heading', { name: 'Conversion by device' })).toBeVisible();

  await page.goto(`/${DOCS_ID}/devices`);
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Conversion by device' })).toHaveCount(0);
});
