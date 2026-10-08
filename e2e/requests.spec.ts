import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`requests, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation, also with the details open', async ({ page }) => {
      await page.goto(`/${STORE_ID}/requests`);
      await expect(page.getByRole('table', { name: 'Routes' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('button', { name: 'POST /orders, show details' }).click();
      await expect(page.getByRole('dialog', { name: 'POST /orders' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });

    test('has no WCAG 2.2 A or AA violation on the failed reads tab', async ({ page }) => {
      await page.goto(`/${STORE_ID}/requests?range=30d&kind=reads`);
      await expect(page.getByRole('table', { name: 'Routes' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('switches to the failed reads, counted without a rate, keeping the period', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/requests?range=30d`);
  const tabs = page.getByRole('navigation', { name: 'Request kind' });

  await tabs.getByRole('link', { name: 'Failed reads' }).click();

  await expect(page).toHaveURL(/range=30d&kind=reads$/);
  await expect(tabs.getByRole('link', { name: 'Failed reads' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('group', { name: 'Routes failing' })).toContainText(
    'GET /orders/:id',
  );
  await expect(page.getByRole('columnheader', { name: 'Failed' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Write error rate' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Show' })).toHaveCount(0);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d&kind=reads$/);

  await tabs.getByRole('link', { name: 'Writes' }).click();
  await expect(page).toHaveURL(/range=7d$/);
  await expect(page.getByRole('group', { name: 'Write error rate' })).toBeVisible();
});

test('keeps the focus in the details, closes them with Escape and refocuses the route', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/requests`);
  const opener = page.getByRole('button', { name: 'POST /orders, show details' });

  await opener.click();
  const details = page.getByRole('dialog', { name: 'POST /orders' });
  await expect(details.getByRole('button', { name: 'Close' })).toBeFocused();
  for (let press = 0; press < 4; press += 1) {
    await page.keyboard.press('Tab');
    expect(await details.evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(await details.evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);

  await page.keyboard.press('Escape');

  await expect(details).toBeHidden();
  await expect(opener).toBeFocused();
});

test('filters by the screen where a route failed, through reloads and periods', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/requests?range=30d`);
  await page.getByRole('button', { name: 'POST /orders, show details' }).click();

  await page
    .getByRole('dialog', { name: 'POST /orders' })
    .getByRole('link', { name: /\/orders\/new/ })
    .click();

  await expect(page).toHaveURL(/screen=%2Forders%2Fnew/);
  await expect(page.getByText('From screen')).toContainText('/orders/new');
  const rows = page.getByRole('table', { name: 'Routes' }).locator('tbody tr');
  await expect(rows).toHaveCount(1);

  await page.reload();
  await expect(rows).toHaveCount(1);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d&screen=%2Forders%2Fnew$/);
  await expect(rows).toHaveCount(1);

  await page.getByRole('link', { name: 'Clear the screen filter' }).click();
  await expect(page).toHaveURL(/range=7d$/);
  await expect(rows).toHaveCount(8);
});

test('shows only the failing routes when asked', async ({ page }) => {
  await page.goto(`/${STORE_ID}/requests?range=30d`);

  await page.getByRole('link', { name: 'Failing only' }).click();

  await expect(page).toHaveURL(/show=failing/);
  await expect(page.getByRole('table', { name: 'Routes' }).locator('tbody tr')).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('opens the visit of a recent failure in the timeline', async ({ page }) => {
  await page.goto(`/${STORE_ID}/requests`);
  await page.getByRole('button', { name: 'POST /orders, show details' }).click();

  await page
    .getByRole('dialog', { name: 'POST /orders' })
    .getByRole('link', { name: 'Open visit 3c07a1b2' })
    .click();

  await expect(page).toHaveURL(/\/timeline\?range=30d&visit=3c07a1b2-/);
  await expect(page.getByRole('region', { name: /^Visit 3c07a1b2 · / })).toContainText(
    'order_number_in_use',
  );
});

test('reopens the details of a route after Back from one of its visits', async ({ page }) => {
  await page.goto(`/${STORE_ID}/requests?range=7d`);
  await page.getByRole('button', { name: 'POST /orders, show details' }).click();
  await expect(page).toHaveURL(/\?range=7d&route=POST\+%2Forders$/);

  await page
    .getByRole('dialog', { name: 'POST /orders' })
    .getByRole('link', { name: /^Open visit / })
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\?range=7d&visit=/);
  await page.goBack();

  const details = page.getByRole('dialog', { name: 'POST /orders' });
  await expect(details).toBeVisible();
  await details.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('button', { name: 'POST /orders, show details' })).toBeFocused();
  await expect(page).toHaveURL(/\/requests\?range=7d$/);
});
