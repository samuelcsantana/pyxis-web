import { expect, type Locator, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';
const FIGURES = ['Visits', 'Identified users', 'Conversions', 'Write error rate'] as const;

function count(text: string | null): number {
  return Number((text ?? '').replaceAll(',', ''));
}

function dailyChart(page: Page): Locator {
  return page.getByRole('region', { name: 'Activity per day' });
}

function chartFigure(page: Page): Locator {
  return dailyChart(page).getByRole('img', { name: /^Line chart of / });
}

async function topOf(page: Page, figure: string): Promise<number> {
  const box = await page.getByRole('group', { name: figure, exact: true }).boundingBox();
  return box?.y ?? Number.NaN;
}

test('shows the four figures of a project with a conversion event', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);

  for (const name of FIGURES) {
    await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole('region', { name: 'Top pages' })).toContainText('/calculator');
  await expect(page.getByRole('region', { name: 'Top events' })).toContainText(
    'Calculator result shown',
  );
});

test('leaves conversions out for a project without a conversion event', async ({ page }) => {
  await page.goto(`/${DOCS_ID}/overview`);

  await expect(page.getByRole('heading', { level: 2, name: 'Visits', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Conversions' })).toHaveCount(0);
});

test('lays the figures out four in a row on a desktop and two on a phone', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page.getByRole('heading', { level: 2, name: 'Visits', exact: true })).toBeVisible();

  const visits = await topOf(page, 'Visits');
  expect(await topOf(page, 'Identified users')).toBe(visits);
  if (isMobile) {
    expect(await topOf(page, 'Conversions')).toBeGreaterThan(visits);
  } else {
    expect(await topOf(page, 'Write error rate')).toBe(visits);
  }
});

test('shows the chart as a table that adds up to the legend totals', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  const chart = dailyChart(page);
  await expect(chartFigure(page)).toHaveAccessibleName(/^Line chart of 7 days\./);
  const legendTotal = await chart
    .locator('p:has(strong)', { hasText: 'Page views' })
    .locator('strong')
    .textContent();

  await chart.getByRole('button', { name: 'Table', exact: true }).click();

  const rows = chart.getByRole('table').locator('tbody tr');
  await expect(rows).toHaveCount(7);
  const tableTotal = (await rows.locator('td:first-of-type').allTextContents())
    .map(count)
    .reduce((sum, value) => sum + value, 0);
  expect(tableTotal).toBe(count(legendTotal));
  expect(await axeViolations(page)).toEqual([]);
  expect(await sidewaysOverflow(page)).toBe(0);
});

test('draws one point per day, and the figures of a single day without a chart', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  await expect(chartFigure(page)).toHaveAccessibleName(/^Line chart of 30 days\./);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: 'Today' })
    .click();

  await expect(page).toHaveURL(/range=today$/);
  const figures = page.getByRole('region', { name: 'Activity of the day' });
  await expect(figures).toContainText('Page views and named events, today');
  await expect(dailyChart(page)).toHaveCount(0);
  for (const name of ['Visits', 'Identified users', 'Conversions', 'Write error rate']) {
    await expect(
      page
        .getByRole('group', { name, exact: true })
        .getByText(/^vs\. yesterday until \d{2}:\d{2}(, better|, worse)?$/),
    ).toBeVisible();
  }
  expect(await axeViolations(page)).toEqual([]);
});

test('opens the visits of a top page, in the same period, from the keyboard too', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);

  await page.getByRole('link', { name: '/calculator: see its visits' }).click();

  await expect(page).toHaveURL(/\/visits\?range=7d&path=%2Fcalculator$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Visits' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Viewed page' })).toHaveValue('/calculator');
  const rows = page
    .getByRole('table', { name: 'Visits' })
    .locator('tbody tr')
    .or(page.getByRole('list', { name: 'Visits' }).locator(':scope > li'));
  await expect(rows).toHaveCount(8);

  await page.goBack();
  const eventLink = page.getByRole('link', {
    name: 'Calculator result shown: see its visits',
  });
  await eventLink.focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/visits\?range=7d&event=calculator_result_shown$/);
  await expect(page.getByRole('textbox', { name: 'Had event' })).toHaveValue(
    'calculator_result_shown',
  );
  await expect(rows).toHaveCount(8);
});

test('plots the figure a card picks, from the keyboard too, and keeps it across periods', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
  const visits = page.getByRole('button', { name: 'Visits', exact: true });
  await expect(visits).toHaveAttribute('aria-pressed', 'false');

  await visits.focus();
  await page.keyboard.press('Space');

  await expect(page).toHaveURL(/\/overview\?range=7d&metric=visits$/);
  const chart = page.getByRole('region', { name: 'Visits per day' });
  await expect(chart.getByRole('img')).toHaveAccessibleName(
    /^Line chart of 7 days\. Visits: .+ Dashed, the previous period\. Visits: /,
  );
  await expect(visits).toHaveAttribute('aria-pressed', 'true');
  await expect(visits).toBeFocused();
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
  await expect(page).toHaveTitle('Overview · Demo Store · Pyxis');
  expect(await axeViolations(page)).toEqual([]);

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '30 days' })
    .click();

  await expect(page).toHaveURL(/\/overview\?range=30d&metric=visits$/);
  await expect(page.getByRole('region', { name: 'Visits per day' })).toBeVisible();

  await page.getByRole('button', { name: 'Visits', exact: true }).click();

  await expect(page).toHaveURL(/\/overview\?range=30d$/);
  await expect(dailyChart(page)).toBeVisible();
});

test('opens on the figure the address names, its table beside the previous period', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d&metric=write-errors`);
  const chart = page.getByRole('region', { name: 'Write error rate per day' });
  await expect(page.getByRole('button', { name: 'Write error rate', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(chart.getByRole('img')).toBeVisible();
  await expect(chart.getByText('0.0%', { exact: true })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await chart.getByRole('button', { name: 'Table', exact: true }).click();

  await expect(chart.getByRole('columnheader')).toHaveText([
    'Day',
    'Write error rate',
    'Compared with',
    'Write error rate then',
  ]);
  await expect(chart.getByRole('table').locator('tbody tr')).toHaveCount(7);
});

test('shows the values of the day under the pointer', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Phones have no pointer to hover with.');
  await page.goto(`/${STORE_ID}/overview?range=7d&metric=visits`);
  const plot = page.getByRole('region', { name: 'Visits per day' }).locator('[data-layer="hover"]');
  const box = await plot.boundingBox();
  if (box === null) {
    throw new Error('The chart has no plot to hover');
  }

  await expect(async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2);
    await expect(plot).toContainText(/^Oct \d+Visits[\d,]+Visits, (Sep|Oct) \d+[\d,]+$/, {
      timeout: 1_000,
    });
  }).toPass();
  await page.mouse.move(0, 0);
  await expect(plot).toBeEmpty();
});

test('shows when visits start, adding up to the Visits figure, also as a table', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  const panel = page.getByRole('region', { name: 'When visits start' });
  await expect(panel.getByRole('img', { name: /^Busiest: / })).toBeVisible();
  const visits = count(
    await page
      .getByRole('group', { name: 'Visits', exact: true })
      .locator('p.tabular-nums')
      .first()
      .textContent(),
  );

  await panel.getByRole('button', { name: 'Table', exact: true }).click();

  const rows = panel.getByRole('table').locator('tbody tr');
  await expect(rows).toHaveCount(7);
  const started = (await rows.locator('td').allTextContents())
    .map(count)
    .reduce((sum, value) => sum + value, 0);
  expect(started).toBe(visits);
  expect(await axeViolations(page)).toEqual([]);
  expect(await sidewaysOverflow(page)).toBe(0);
});
