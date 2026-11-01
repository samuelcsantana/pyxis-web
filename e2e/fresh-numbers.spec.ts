import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const RECORD_KEY = `pyxis:seen:numbers:${STORE_ID}`;
const A_MINUTE = 60 * 1000;
const AN_HOUR = 60 * A_MINUTE;

interface NumbersRead {
  readonly readAt: number;
  readonly values: Record<string, number>;
}

interface ShownRead {
  readonly to: string;
  readonly current: NumbersRead;
}

async function keptReads(page: Page): Promise<Record<string, ShownRead>> {
  return page.evaluate(
    (key) => JSON.parse(window.localStorage.getItem(key) ?? '{}') as Record<string, ShownRead>,
    RECORD_KEY,
  );
}

async function readOnce(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await expect.poll(async () => Object.keys(await keptReads(page)).length).toBeGreaterThan(0);
}

async function latestReadAt(page: Page): Promise<number> {
  return Math.max(0, ...Object.values(await keptReads(page)).map((read) => read.current.readAt));
}

async function seemEarlierAndSmaller(page: Page, earlierBy = AN_HOUR): Promise<void> {
  await page.evaluate(
    ({ key, by }) => {
      const reads = JSON.parse(window.localStorage.getItem(key) ?? '{}') as Record<
        string,
        ShownRead
      >;
      const earlier = Object.fromEntries(
        Object.entries(reads).map(([name, read]) => [
          name,
          {
            ...read,
            current: {
              readAt: read.current.readAt - by,
              values: Object.fromEntries(
                Object.entries(read.current.values).map(([item, value]) => [item, value - 1]),
              ),
            },
          },
        ]),
      );
      window.localStorage.setItem(key, JSON.stringify(earlier));
    },
    { key: RECORD_KEY, by: earlierBy },
  );
}

function slots(page: Page) {
  return page.locator('main [data-fresh-item]');
}

test('marks every count of Overview that went up since the last read, and lights its card', async ({
  page,
}) => {
  await readOnce(page, `/${STORE_ID}/overview`);
  await expect(page.locator('[data-fresh-shown]')).toHaveCount(0);
  await seemEarlierAndSmaller(page);

  await page.reload();

  const count = await slots(page).count();
  expect(count).toBeGreaterThan(2);
  await expect(page.locator('main [data-fresh-item] [data-fresh-shown="arrived"]')).toHaveCount(
    count,
  );
  const visits = page.getByRole('group', { name: 'Visits' });
  await expect(visits.locator('[data-fresh-item] [data-fresh-shown]')).toHaveText(/^\+\d/);
  expect(await visits.evaluate((card) => getComputedStyle(card).animationName)).toBe('fresh');
  expect(await axeViolations(page)).toEqual([]);
});

test('marks nothing on another period, the first read of it', async ({ page }) => {
  await readOnce(page, `/${STORE_ID}/overview`);
  await seemEarlierAndSmaller(page);

  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy');
  await expect.poll(async () => Object.keys(await keptReads(page)).length).toBe(2);

  await expect(page.locator('[data-fresh-shown]')).toHaveCount(0);
});

for (const screen of ['features', 'requests', 'devices', 'acquisition'] as const) {
  test(`marks the counts of ${screen} that went up since the last read`, async ({ page }) => {
    await readOnce(page, `/${STORE_ID}/${screen}`);
    await seemEarlierAndSmaller(page);

    await page.reload();

    await expect(page.locator('main [data-fresh-shown="arrived"]').first()).toBeAttached();
    expect(await axeViolations(page)).toEqual([]);
  });
}

test('marks as new the visits that started after the last read', async ({ page }) => {
  await readOnce(page, `/${STORE_ID}/visits`);
  await page.evaluate(
    ({ key, day }) => {
      const reads = JSON.parse(window.localStorage.getItem(key) ?? '{}') as Record<
        string,
        ShownRead
      >;
      const earlier = Object.fromEntries(
        Object.entries(reads).map(([name, read]) => [
          name,
          { ...read, current: { ...read.current, readAt: read.current.readAt - day } },
        ]),
      );
      window.localStorage.setItem(key, JSON.stringify(earlier));
    },
    { key: RECORD_KEY, day: 24 * AN_HOUR },
  );

  await page.reload();

  await expect(
    page.locator('main [data-fresh-shown="arrived"]:visible', { hasText: 'New' }).first(),
  ).toBeVisible();
});

test('shows the same marks, without lighting them, on a screen back from the cache', async ({
  page,
  isMobile,
}) => {
  await readOnce(page, `/${STORE_ID}/overview`);
  await seemEarlierAndSmaller(page);
  await page.reload();
  await expect(page.locator('main [data-fresh-shown="arrived"]').first()).toBeAttached();

  for (const screen of ['Funnel', 'Overview']) {
    if (isMobile) {
      await page.getByRole('button', { name: /^Open menu/ }).click();
    }
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: screen, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1, name: screen })).toBeVisible();
  }

  await expect(page.locator('main [data-fresh-shown="kept"]').first()).toBeAttached();
  await expect(page.locator('main [data-fresh-shown="arrived"]')).toHaveCount(0);
});

async function lookWithMarks(page: Page, path: string): Promise<number> {
  await readOnce(page, path);
  await seemEarlierAndSmaller(page);
  await page.reload();
  await expect(page.locator('main [data-fresh-shown="arrived"]').first()).toBeAttached();
  return page.locator('main [data-fresh-shown]').count();
}

async function expectTheSameLook(page: Page, marks: number, lookedAt: number): Promise<void> {
  await expect.poll(() => latestReadAt(page)).toBeGreaterThan(lookedAt);
  await expect(page.locator('main [data-fresh-shown="kept"]')).toHaveCount(marks);
  await expect(page.locator('main [data-fresh-shown="arrived"]')).toHaveCount(0);
}

test('keeps the marks of a look when the chart shows another metric', async ({ page }) => {
  const marks = await lookWithMarks(page, `/${STORE_ID}/overview`);
  const lookedAt = await latestReadAt(page);

  const visits = page.getByRole('group', { name: 'Visits', exact: true });
  await visits.getByRole('button', { name: 'Visits', exact: true }).click();
  await expect(page).toHaveURL(/metric=visits$/);

  await expectTheSameLook(page, marks, lookedAt);
});

function droppedAtStepTwo(page: Page) {
  return page
    .getByRole('list', { name: 'Funnel' })
    .getByRole('listitem')
    .nth(1)
    .getByRole('link', { name: /dropped, list who left before step 2$/ });
}

test('keeps the marks of a look when a step lists who left it', async ({ page }) => {
  const marks = await lookWithMarks(page, `/${STORE_ID}/funnel?range=30d`);
  const lookedAt = await latestReadAt(page);

  await droppedAtStepTwo(page).click();
  await expect(page).toHaveURL(/step=2&outcome=dropped/);

  await expectTheSameLook(page, marks, lookedAt);
});

test("keeps the marks of a look when the screen is read again with a route's details open", async ({
  page,
}) => {
  const marks = await lookWithMarks(page, `/${STORE_ID}/requests`);
  const lookedAt = await latestReadAt(page);
  await page.getByRole('button', { name: 'POST /orders, show details' }).click();
  await expect(page).toHaveURL(/route=/);

  await page.reload();

  await expect(page.getByRole('dialog', { name: 'POST /orders' })).toBeVisible();
  await expectTheSameLook(page, marks, lookedAt);
});

test('lights what went up since a read only a minute before', async ({ page }) => {
  await readOnce(page, `/${STORE_ID}/overview`);
  await seemEarlierAndSmaller(page, A_MINUTE);

  await page.reload();

  await expect(page.locator('main [data-fresh-item] [data-fresh-shown="arrived"]')).toHaveCount(
    await slots(page).count(),
  );
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('marks the counts without lighting the cards', async ({ page }) => {
    await readOnce(page, `/${STORE_ID}/overview`);
    await seemEarlierAndSmaller(page);

    await page.reload();

    const visits = page.getByRole('group', { name: 'Visits' });
    await expect(visits.locator('[data-fresh-item] [data-fresh-shown]')).toHaveText(/^\+\d/);
    expect(await visits.evaluate((card) => getComputedStyle(card).animationName)).toBe('none');
  });
});
