import { readFile } from 'node:fs/promises';
import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const filtersRow = (page: Page) => page.getByRole('region', { name: 'Filters', exact: true });

async function openTheMenu(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
}

function screenLink(page: Page, name: string) {
  return page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name, exact: true });
}

function periodLink(page: Page, name: string) {
  return page.getByRole('navigation', { name: 'Period' }).getByRole('link', { name });
}

async function visitsFigure(page: Page): Promise<number> {
  const text = await page.getByRole('group', { name: 'Visits', exact: true }).innerText();
  return Number((/\d[\d,]*/.exec(text)?.[0] ?? '').replaceAll(',', ''));
}

async function downloadedText(page: Page, linkName: string) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: linkName }).click(),
  ]);
  return {
    name: download.suggestedFilename(),
    text: await readFile(await download.path(), 'utf8'),
  };
}

test('a filter narrows the Overview, shows as a chip and compares with the same filters', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  const everyVisit = await visitsFigure(page);
  await expect(filtersRow(page)).toHaveCount(0);

  await page.goto(`/${STORE_ID}/overview?range=30d&device=mobile`);

  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['Device: Mobile']);
  await expect(filtersRow(page)).toContainText('New arrivals are paused while filters are on.');
  expect(await visitsFigure(page)).toBeLessThan(everyVisit);
  await expect(page.getByText(/same filters/).first()).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await filtersRow(page).getByRole('link', { name: 'Remove Device: Mobile' }).click();

  await expect(page).not.toHaveURL(/device=/);
  await expect(filtersRow(page)).toHaveCount(0);
  expect(await visitsFigure(page)).toBe(everyVisit);
});

test('keeps the filters across a change of period and of screen, but not on the timeline', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d&os=ios`);
  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['System: iOS']);

  await periodLink(page, '30 days').click();
  await expect(page).toHaveURL(/range=30d/);
  await expect(page).toHaveURL(/os=ios/);

  await openTheMenu(page, isMobile);
  await screenLink(page, 'Devices').click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/devices\\?.*os=ios`));
  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['System: iOS']);

  await openTheMenu(page, isMobile);
  await screenLink(page, 'Timeline').click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/timeline`));
  await expect(page).not.toHaveURL(/os=ios/);
  await expect(filtersRow(page)).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(/os=ios/);
  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['System: iOS']);
});

test('says no visit matches when the filters select nothing, and removes them', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/acquisition?range=7d&country=AQ`);

  await expect(page.getByRole('heading', { name: 'No visits match these filters' })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await page.getByRole('main').getByRole('link', { name: 'Remove filters' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=7d$`));
  await expect(page.getByRole('heading', { name: 'No visits match these filters' })).toHaveCount(0);
});

test('downloads the filtered rows of a filtered screen, in a file named as filtered', async ({
  page,
}) => {
  const linkName = 'Device types, browsers, systems, countries and regions as CSV';
  await page.goto(`/${STORE_ID}/devices?range=30d`);
  const everyVisit = await downloadedText(page, linkName);

  await page.goto(`/${STORE_ID}/devices?range=30d&browser=safari`);
  const filtered = await downloadedText(page, linkName);

  expect(filtered.name).toMatch(/-filtered\.csv$/);
  expect(everyVisit.name).not.toMatch(/filtered/);
  expect(filtered.text).not.toBe(everyVisit.text);
});
