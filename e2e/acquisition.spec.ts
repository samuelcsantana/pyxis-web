import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

function count(text: string): number {
  return Number(text.replaceAll(',', ''));
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`acquisition, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/acquisition`);
      await expect(page.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeVisible();

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

  await page.getByRole('link', { name: 'Acquisition' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=7d$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeVisible();
});

test('shows the channels per day as a table whose totals add up', async ({ page }) => {
  await page.goto(`/${STORE_ID}/acquisition?range=7d`);
  const chart = page.getByRole('region', { name: 'Visits by channel' });
  await expect(chart.getByRole('img', { name: /^Stacked bar chart of 7 days,/ })).toBeVisible();

  await chart.getByRole('button', { name: 'View as table' }).click();

  const rows = chart.getByRole('table').locator('tbody tr');
  await expect(rows).toHaveCount(7);
  for (const row of await rows.all()) {
    const cells = (await row.locator('td').allTextContents()).map(count);
    const total = cells.pop();
    expect(total).toBe(cells.reduce((sum, value) => sum + value, 0));
  }
  expect(await axeViolations(page)).toEqual([]);
  expect(await sidewaysOverflow(page)).toBe(0);
});

test('rates the sources only when the project has a conversion event', async ({ page }) => {
  await page.goto(`/${STORE_ID}/acquisition`);
  const sources = page.getByRole('table', { name: 'Sources' });
  await expect(sources).toContainText('from ad clicks');
  await expect(sources.getByRole('columnheader', { name: 'Conversion rate' })).toBeVisible();

  await page.goto(`/${DOCS_ID}/acquisition`);
  await expect(page.getByRole('table', { name: 'Sources' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Conversion rate' })).toHaveCount(0);
});
