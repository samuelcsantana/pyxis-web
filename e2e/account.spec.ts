import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`account, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto('/account');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Account and billing' }),
      ).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the account menu and shows the free trial with the month used', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await page.getByRole('link', { name: 'Account and billing' }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(page).toHaveTitle('Account and billing · Pyxis');
  await expect(page.getByText(/Free trial until/)).toBeVisible();
  await expect(page.getByText(/41,230 of 100,000/)).toBeVisible();
  await expect(page.getByText('Up to 3 projects and 3 people, you included.')).toBeVisible();
});

test('opens billing, which the demo keeps on this page, and goes back to the dashboard', async ({
  page,
}) => {
  await page.goto('/account');

  await page.getByRole('button', { name: 'Manage billing' }).click();
  await page.waitForEvent('load');
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('button', { name: 'Manage billing' })).toBeEnabled();

  await page.getByRole('link', { name: 'Back to the dashboard' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
});

test('speaks Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto('/account');

  await expect(page.getByRole('heading', { level: 1, name: 'Conta e cobrança' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Gerenciar cobrança' })).toBeVisible();
});

test('closes the account only with the owner address, saying when everything goes', async ({
  page,
}) => {
  await page.goto('/account');
  const field = page.getByRole('textbox', { name: 'Type your e-mail address to confirm' });

  await field.fill('someone@example.com');
  await page.getByRole('button', { name: 'Close the account for good' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText(
    'That is not your e-mail address, so nothing was closed.',
  );

  await field.fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Close the account for good' }).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText(
    'The account is closed. Everything is deleted on',
  );
});
