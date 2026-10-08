import { readFile } from 'node:fs/promises';
import { expect, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const ISO_DAY = /\d{4}-\d{2}-\d{2}/.source;
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const FAILED_COLUMN = 3;
const CHANNEL_COLUMN = 11;

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

test('downloads the screens the Features search finds', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?range=30d&kind=screens&q=orders`);
  const table = page.getByRole('table', { name: 'Most visited screens' });
  await expect(table).toBeVisible();
  const shownScreens = await table.getByRole('row').count();

  const csv = await downloadCsv(page, 'Screens as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-features-screens-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toBe('screen,page_views,visits');
  expect(csv.lines).toHaveLength(shownScreens);
  expect(csv.lines.slice(1).every((line) => line.startsWith('/orders'))).toBe(true);
});

test('downloads the Acquisition sources, campaigns and visits by channel', async ({ page }) => {
  await page.goto(`/${STORE_ID}/acquisition?range=7d`);
  const table = page.getByRole('table', { name: 'Sources' });
  await expect(table).toBeVisible();
  const shownSources = await table.getByRole('row').count();
  const shownCampaigns = await page
    .getByRole('table', { name: 'Campaigns' })
    .getByRole('row')
    .count();

  const sources = await downloadCsv(page, 'Sources as CSV');
  const campaigns = await downloadCsv(page, 'Campaigns as CSV');
  const channels = await downloadCsv(page, 'Visits by channel as CSV');

  expect(sources.fileName).toMatch(
    new RegExp(`^pyxis-acquisition-sources-${ISO_DAY}-${ISO_DAY}\\.csv$`),
  );
  expect(sources.lines[0]).toMatch(/^source,medium,channel,visits,/);
  expect(sources.lines).toHaveLength(shownSources);
  expect(campaigns.lines[0]).toMatch(/^campaign,source,medium,channel,visits,/);
  expect(campaigns.lines).toHaveLength(shownCampaigns);
  expect(channels.lines[0]).toBe('date,paid,email,social,campaign,organic,referral,direct');
  expect(channels.lines).toHaveLength(8);
});

test('downloads every Devices breakdown in one file', async ({ page }) => {
  await page.goto(`/${STORE_ID}/devices?range=30d`);
  await expect(page.getByRole('heading', { level: 1, name: 'Devices' })).toBeVisible();

  const csv = await downloadCsv(page, 'Device types, browsers, systems and countries as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-devices-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toMatch(/^dimension,value,visits/);
  const dimensions = new Set(csv.lines.slice(1).map((line) => line.split(',')[0]));
  expect([...dimensions]).toEqual(['device_type', 'browser', 'operating_system', 'country']);
});

test('downloads the visits that match the Visits filters', async ({ page }) => {
  await page.goto(`/${STORE_ID}/visits?range=30d&channel=paid`);
  await expect(page.getByRole('heading', { level: 1, name: 'Visits' })).toBeVisible();

  const csv = await downloadCsv(page, 'Newest 1,000 visits as CSV');

  expect(csv.fileName).toMatch(new RegExp(`^pyxis-visits-${ISO_DAY}-${ISO_DAY}\\.csv$`));
  expect(csv.lines[0]).toMatch(/^visit_id,started_at,ended_at,entry_path,/);
  expect(csv.lines.length).toBeGreaterThan(1);
  const channels = csv.lines.slice(1).map((line) => line.split(',')[CHANNEL_COLUMN]);
  expect(channels.every((channel) => channel === 'paid')).toBe(true);
});

test('answers not found for a table a screen does not have', async ({ request }) => {
  const overview = await request.get(`/${STORE_ID}/overview/export?table=visitors`);
  const acquisition = await request.get(`/${STORE_ID}/acquisition/export?table=countries`);

  expect(overview.status()).toBe(404);
  expect(acquisition.status()).toBe(404);
});
