import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const filtersRow = (page: Page) => page.getByRole('region', { name: 'Filters', exact: true });

async function openTheMenu(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
}

test('a row button filters every screen, and pressing it again removes the filter', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/devices?range=30d`);
  const browsers = page.getByRole('table', { name: 'Browser' });

  await browsers.getByRole('link', { name: 'Filter by Safari' }).click();

  await expect(page).toHaveURL(/browser=safari/);
  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['Browser: Safari']);
  const active = browsers.getByRole('link', { name: 'Remove filter Safari' });
  await expect(active).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await openTheMenu(page, isMobile);
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Overview', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?.*browser=safari`));
  await expect(filtersRow(page).getByRole('listitem')).toHaveText(['Browser: Safari']);

  await page.goBack();
  await page
    .getByRole('table', { name: 'Browser' })
    .getByRole('link', { name: 'Remove filter Safari' })
    .click();

  await expect(page).not.toHaveURL(/browser=/);
  await expect(filtersRow(page)).toHaveCount(0);
});

test('the name of a row still opens its visits', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);
  const pages = page.getByRole('table', { name: 'Top pages' });
  await expect(pages.getByRole('link', { name: /^Filter by \// }).first()).toBeVisible();

  await pages
    .getByRole('link', { name: /: see its visits$/ })
    .first()
    .click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/visits\\?.*path=`));
});
