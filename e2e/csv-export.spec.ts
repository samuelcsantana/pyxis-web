import { readFile } from 'node:fs/promises';
import { expect, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const ISO_DAY = /\d{4}-\d{2}-\d{2}/.source;
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const FAILED_COLUMN = 3;

interface DownloadedCsv {
  readonly fileName: string;
  readonly lines: readonly string[];
}

async function downloadCsv(page: Page, linkName: string): Promise<DownloadedCsv> {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: linkName }).click(),
  ]);
  const text = await readFile(await download.path(), 'utf8');
  expect(text.startsWith(BYTE_ORDER_MARK)).toBe(true);
  return {
    fileName: download.suggestedFilename(),
    lines: text.slice(BYTE_ORDER_MARK.length).trimEnd().split('\r\n'),
  };
}

test('downloads the top pages of the Overview period as a CSV file', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  const table = page.getByRole('table', { name: 'Top pages' });
  await expect(table).toBeVisible();
  const shownPages = await table.getByRole('row').count();

  const csv = await downloadCsv(page, 'Top pages as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-overview-pages-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toBe('path,page_views,visits');
  expect(csv.lines).toHaveLength(shownPages);
  expect(csv.lines.some((line) => line.startsWith('/calculator,'))).toBe(true);
  await expect(page).toHaveURL(/\/overview\?range=7d$/);
});

test('downloads one row per day of the Overview period', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);

  const csv = await downloadCsv(page, 'Activity per day as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-overview-daily-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toMatch(/^date,page_views,events,visits,/);
  expect(csv.lines).toHaveLength(31);
});

test('downloads the failing written routes the Requests screen shows', async ({ page }) => {
  await page.goto(`/${STORE_ID}/requests?range=30d&show=failing`);
  const table = page.getByRole('table', { name: 'Routes' });
  await expect(table).toBeVisible();
  const shownRoutes = await table.getByRole('row').count();

  const csv = await downloadCsv(page, 'Writes as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-requests-writes-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toBe('method,route,requests,failed,median_duration_ms,statuses');
  expect(csv.lines).toHaveLength(shownRoutes);
  const failed = csv.lines.slice(1).map((line) => Number(line.split(',')[FAILED_COLUMN]));
  expect(failed.every((count) => count > 0)).toBe(true);
});

test('answers not found for a table a screen does not have', async ({ request }) => {
  const response = await request.get(`/${STORE_ID}/overview/export?table=visitors`);

  expect(response.status()).toBe(404);
});
