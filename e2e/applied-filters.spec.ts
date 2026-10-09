import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const applied = (page: Page) => page.getByRole('region', { name: 'Applied filters' });

test('lists the applied filters above the visits, each removable on its own', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d&channel=paid&event=signup_completed`);

  await expect(applied(page).getByRole('listitem')).toHaveText([
    'Had event: signup_completed',
    'Channel: Paid',
  ]);
  expect(await axeViolations(page)).toEqual([]);

  await applied(page).getByRole('link', { name: 'Remove Channel: Paid' }).click();

  await expect(page).not.toHaveURL(/channel=/);
  await expect(page).toHaveURL(/event=signup_completed/);
  await expect(applied(page).getByRole('listitem')).toHaveText(['Had event: signup_completed']);
});

test('clears every applied filter at once, keeping the period', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=7d&channel=paid&failed=true`);
  await expect(applied(page).getByRole('listitem')).toHaveText([
    'Channel: Paid',
    'With a failed request',
  ]);

  await applied(page).getByRole('link', { name: 'Clear all' }).click();

  await expect(page).toHaveURL(/range=7d$/);
  await expect(applied(page)).toHaveCount(0);
});
