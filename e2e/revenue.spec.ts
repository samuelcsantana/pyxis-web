import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const PRICING_GOAL = 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703';
const MONEY = /R\$\s?[\d,.]+/;

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`revenue, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('the revenue on the Overview, Acquisition and the Funnel has no WCAG 2.2 A or AA violation', async ({
      page,
    }) => {
      for (const screen of ['overview', 'acquisition', 'funnel']) {
        await page.goto(`/${STORE_ID}/${screen}?range=30d`);
        await expect(page.getByText(MONEY).filter({ visible: true }).first()).toBeVisible();
        expect(await axeViolations(page)).toEqual([]);
        expect(await sidewaysOverflow(page)).toBe(0);
      }
    });
  });
}

test('shows the revenue of an event goal on the Overview and hides it for a page goal', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=30d`);

  const card = page.getByRole('group', { name: 'Revenue' });
  await expect(card).toContainText(MONEY);
  await expect(card).toContainText('per conversion');
  const goals = page.getByRole('region', { name: 'Goals' });
  if (isMobile) {
    await expect(goals.getByRole('columnheader', { name: 'Revenue' })).toBeHidden();
    await expect(goals.getByText(/ in revenue$/).first()).toBeVisible();
  } else {
    await expect(goals.getByRole('columnheader', { name: 'Revenue' })).toBeVisible();
    await expect(goals.getByRole('row', { name: /Saw the pricing/ })).toContainText('—');
  }

  await page.goto(`/${STORE_ID}/overview?range=30d&goal=${PRICING_GOAL}`);
  await expect(page.getByRole('group', { name: 'Conversions' })).toContainText('Saw the pricing');
  await expect(page.getByRole('group', { name: 'Revenue' })).toHaveCount(0);
});

test('gives each source and each event step of the funnel its revenue', async ({ page }) => {
  await page.goto(`/${STORE_ID}/acquisition?range=30d`);
  await expect(page.getByRole('region', { name: 'Sources' }).getByRole('row').nth(1)).toContainText(
    MONEY,
  );

  await page.goto(`/${STORE_ID}/funnel?range=30d`);
  await expect(page.getByText(/in revenue$/).first()).toBeVisible();
});

test('lets the owner choose the currency, and shows how to send revenue', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview?range=30d#settings/project`);
  const currency = page.getByRole('dialog', { name: 'Settings' }).getByRole('combobox', {
    name: 'Currency',
  });
  await expect(currency).toHaveValue('BRL');
  await currency.selectOption('USD');
  await expect(currency).toHaveValue('USD');

  await page.goto(`/${STORE_ID}/install`);
  await expect(page.getByText("track('purchase', { revenue: 129.9 });")).toBeVisible();
});
