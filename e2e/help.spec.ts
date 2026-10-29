import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { currentNavigationLinks } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`help and support, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/help`);
      await expect(page.getByRole('heading', { level: 1, name: 'Help and support' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the account menu with the support address and the reply time of the plan', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await page.getByRole('link', { name: 'Help and support' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help$`));
  await expect(page).toHaveTitle('Help and support · My site · Pyxis');
  const write = page.getByRole('region', { name: 'Write to support' });
  await expect(write.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(write.getByText(/reply within 2 business days/)).toBeVisible();

  await page.getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/install$`));
});

test('keeps the period of the screen through Help and Install', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/acquisition?range=today`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await page.getByRole('link', { name: 'Help and support' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help\\?range=today$`));

  await page.getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/install\\?range=today$`));

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.getByRole('link', { name: 'Visits' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/visits\\?range=today$`));
});

test('marks the account row as where Help is, and no link', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/help`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  const account = page
    .getByRole('navigation', { name: 'Main navigation' })
    .locator('summary[data-current]');
  await expect(account).toBeVisible();
  await expect(account).toContainText('Account and preferences');
  await expect(currentNavigationLinks(page)).toHaveCount(0);
});

test('closes Account and billing with the support address', async ({ page }) => {
  await page.goto('/account');

  const support = page.getByRole('region', { name: 'Support' });
  await expect(support.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(support.getByRole('button', { name: 'Copy' })).toBeVisible();
});
