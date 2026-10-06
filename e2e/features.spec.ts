import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`features, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/features?q=sign`);
      await expect(page.getByRole('table', { name: 'Most used events' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('switches between events and screens through the URL', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?range=7d`);

  await page.getByRole('link', { name: 'Screens' }).click();

  await expect(page).toHaveURL(/range=7d&kind=screens$/);
  await expect(page.getByRole('table', { name: 'Most visited screens' })).toContainText(
    '/orders/:id',
  );
  await expect(page.getByRole('link', { name: 'Screens' })).toHaveAttribute('aria-current', 'page');
});

test('searches, keeps the search on reload and across periods, then clears it', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/features?range=30d`);

  await page.getByRole('searchbox', { name: 'Search events' }).fill('signup');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page).toHaveURL(/q=signup/);
  const rows = page.getByRole('table', { name: 'Most used events' }).locator('tbody tr');
  await expect(rows).toHaveCount(2);
  await page.reload();
  await expect(rows).toHaveCount(2);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d&kind=events&q=signup$/);
  await expect(rows).toHaveCount(2);

  await page.getByRole('link', { name: 'Clear' }).click();
  await expect(page).toHaveURL(/range=7d&kind=events$/);
  await expect(rows).toHaveCount(8);
});

test('says when nothing matches the search', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?q=refund`);

  await expect(page.getByText('Nothing matches “refund”.')).toBeVisible();
});
