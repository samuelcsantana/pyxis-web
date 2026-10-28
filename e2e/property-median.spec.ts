import { expect, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

test('a numeric property shows its median and splits it by another property', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?range=30d`);

  await page.getByRole('button', { name: 'Properties of Product created' }).click();

  const median = page.getByRole('definition').first();
  await expect(median).not.toBeEmpty();
  const split = page.getByRole('combobox', { name: 'Split by' });
  await expect(split).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await split.selectOption('category');

  const groups = page.getByRole('table', { name: /Split by category/ });
  await expect(groups.getByRole('rowheader')).toHaveCount(4);
  expect(await axeViolations(page)).toEqual([]);
});

test('a property that is not a number shows no median', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?range=30d`);

  await page.getByRole('button', { name: 'Properties of Calculator result shown' }).click();

  await expect(page.getByRole('table', { name: /calculator/ })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Split by' })).toHaveCount(0);
});
