import { expect, type Page, test } from '@playwright/test';
import { axeViolations } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

function visitRows(page: Page) {
  return page
    .getByRole('table', { name: 'Visits' })
    .locator('tbody tr')
    .or(page.getByRole('list', { name: 'Visits' }).locator(':scope > li'));
}

function filters(page: Page) {
  return page.getByRole('search', { name: 'Filter the visits' });
}

test('opens the converting visits and the failing routes from the Overview cards', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);

  await page.getByRole('link', { name: 'See converting visits' }).click();

  await expect(page).toHaveURL(/\/visits\?range=30d&event=signup_completed$/);
  await expect(filters(page).getByRole('textbox', { name: 'Had event' })).toHaveValue(
    'signup_completed',
  );
  await expect(visitRows(page).first()).toBeVisible();

  await page.goto(`/${STORE_ID}/overview?range=30d`);
  await page.getByRole('link', { name: 'See failing routes' }).click();

  await expect(page).toHaveURL(/\/requests\?range=30d&show=failing$/);
  await expect(page.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('opens the visits of a screen and of a property value from Features', async ({ page }) => {
  await page.goto(`/${STORE_ID}/features?range=30d&kind=screens`);

  await page.getByRole('link', { name: '/payouts: see its visits' }).click();

  await expect(page).toHaveURL(/\/visits\?range=30d&path=%2Fpayouts$/);
  await expect(filters(page).getByRole('textbox', { name: 'Viewed page' })).toHaveValue('/payouts');
  await expect(visitRows(page).first()).toBeVisible();

  await page.goto(`/${STORE_ID}/features?range=30d`);
  await page.getByRole('button', { name: 'Properties of CTA clicked' }).click();
  await page
    .getByRole('link', { name: 'create_account: see the visits where cta is create_account' })
    .click();

  await expect(page).toHaveURL(/event=cta_clicked&property=cta%3Dcreate_account$/);
  await expect(filters(page).getByRole('textbox', { name: /^With property/ })).toHaveValue(
    'cta=create_account',
  );
  await expect(visitRows(page).first()).toBeVisible();
  await expect(page).toHaveTitle('Visits · Demo Store · Pyxis');
  expect(await axeViolations(page)).toEqual([]);
});

test('opens the visits of a device type and of a channel', async ({ page }) => {
  await page.goto(`/${DOCS_ID}/devices?range=30d`);

  await page.getByRole('link', { name: 'Tablet: see its visits' }).click();

  await expect(page).toHaveURL(/\/visits\?range=30d&device=tablet$/);
  await expect(filters(page).getByRole('combobox', { name: 'Device' })).toHaveValue('tablet');
  await expect(visitRows(page).first()).toBeVisible();

  await page.goto(`/${DOCS_ID}/acquisition?range=30d`);
  await page.getByRole('link', { name: 'Social: see its visits' }).click();

  await expect(page).toHaveURL(/\/visits\?range=30d&channel=social$/);
  await expect(filters(page).getByRole('combobox', { name: 'Channel' })).toHaveValue('social');
  await expect(visitRows(page).first()).toBeVisible();
});
