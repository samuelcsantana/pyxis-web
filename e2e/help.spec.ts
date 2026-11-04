import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { currentNavigationLinks, openAccountMenu } from './navigation';

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

test('opens from the account menu inside the settings, with the support address and the reply time', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  await openAccountMenu(page, isMobile);
  await page.locator('details[open]').getByRole('link', { name: 'Help and support' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview#settings/help$`));
  const settings = page.getByRole('dialog', { name: 'Settings' });
  const write = settings.getByRole('region', { name: 'Write to support' });
  await expect(write.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(write.getByText(/reply within 2 business days/)).toBeVisible();

  await settings.getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview#settings/install$`));
});

test('keeps the screen and its period behind the help and the install guide', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/acquisition?range=today`);
  await openAccountMenu(page, isMobile);
  await page.locator('details[open]').getByRole('link', { name: 'Help and support' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=today#settings/help$`));

  await page.getByRole('dialog').getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(
    new RegExp(`/${STORE_ID}/acquisition\\?range=today#settings/install$`),
  );

  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=today$`));
});

test('marks nothing in the navigation on the help page, which opens as settings', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/help`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  await expect(currentNavigationLinks(page)).toHaveCount(0);
  await expect(page.locator('summary[data-current]')).toHaveCount(0);
});

test('closes Account and billing with the support address', async ({ page }) => {
  await page.goto('/account');

  const support = page.getByRole('region', { name: 'Support' });
  await expect(support.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(support.getByRole('button', { name: 'Copy' })).toBeVisible();
});
