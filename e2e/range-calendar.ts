import { expect, type Page } from '@playwright/test';

const MONTHS_TO_SEARCH = 36;

export async function showCalendarMonth(page: Page, month: string): Promise<void> {
  const wanted = page.getByRole('grid', { name: month });
  for (let step = 0; step < MONTHS_TO_SEARCH && !(await wanted.isVisible()); step += 1) {
    await page.getByRole('button', { name: 'Previous month' }).click();
  }
  await expect(wanted).toBeVisible();
}

export async function pickCustomRange(
  page: Page,
  month: string,
  firstDay: string,
  lastDay: string,
): Promise<void> {
  await showCalendarMonth(page, month);
  await page.getByRole('button', { name: firstDay, exact: true }).click();
  await page.getByRole('button', { name: lastDay, exact: true }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
}
