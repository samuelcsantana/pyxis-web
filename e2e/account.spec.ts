import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`account, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto('/account');
      await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Account and billing' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the account menu as the settings window, with the free trial and the month used', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await page.getByRole('link', { name: 'Account and billing' }).click();

  const window = page.getByRole('dialog', { name: 'Settings' });
  const plan = window.getByRole('region', { name: 'Account and billing' });
  await expect(page).toHaveURL(/\/account$/);
  await expect(page).toHaveTitle('Account and billing · My site · Pyxis');
  await expect(plan.getByText(/Free trial until/)).toBeVisible();
  await expect(plan.getByText(/41,230 of 100,000/)).toBeVisible();
  await expect(plan.getByText('Up to 3 projects and 3 people, you included.')).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');

  await expect(window).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));
  await expect(
    isMobile
      ? page.getByRole('button', { name: 'Open menu' })
      : page.locator('summary', { hasText: 'Account and preferences' }),
  ).toBeFocused();
});

test('lists Account and billing first under You, and opens it from another part', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the phone opens the list first, checked in settings.spec.ts');
  await page.goto(`/${STORE_ID}/overview`);
  await page.getByRole('link', { name: 'Settings' }).click();
  const window = page.getByRole('dialog', { name: 'Settings' });
  const parts = window.getByRole('navigation', { name: 'Sections' });

  await expect(parts.getByRole('link')).toHaveText([
    'Project',
    'Keys',
    'People',
    'E-mail',
    'Export events',
    'Delete project',
    'Account and billing',
    'Theme and language',
    'Sessions',
    'Access tokens',
    'Connected apps',
    'Help and support',
  ]);
  await parts.getByRole('link', { name: 'Account and billing' }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(
    window.getByRole('heading', { name: 'Account and billing', exact: true }),
  ).toBeFocused();
  await expect(window.getByRole('region', { name: 'Account and billing' })).toBeVisible();
  await expect(window.getByRole('region', { name: 'Support' })).toHaveCount(0);
});

test('shows nothing of the free plan while the API keeps it closed', async ({ page }) => {
  await page.goto('/account');

  await expect(page.getByText(/Free trial until/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Withdrawal' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'The paid plan' })).toHaveCount(0);
  await expect(page.getByText(/^If you cancel/)).toHaveCount(0);
  await expect(page.getByText(/free plan/i)).toHaveCount(0);
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

test('explains a suspended account and points to Account and billing', async ({ page }) => {
  await page.goto('/account-suspended');

  await expect(page).toHaveTitle('This account is suspended · Pyxis');
  await expect(
    page.getByRole('heading', { level: 1, name: 'This account is suspended' }),
  ).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await page.getByRole('link', { name: 'Open Account and billing' }).click();
  await expect(page).toHaveURL(/\/account$/);
});

test('speaks Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto('/account');

  await expect(page.getByRole('heading', { level: 1, name: 'Configurações' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Conta e cobrança' }).getByRole('button', {
      name: 'Gerenciar cobrança',
    }),
  ).toBeVisible();
});

test('closes the account only with the owner address, saying when everything goes', async ({
  page,
}) => {
  await page.goto('/account');
  const toggle = page.getByRole('button', { name: 'Close the account', exact: true });
  const field = page.getByRole('textbox', { name: 'Type your e-mail address to confirm' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(field).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await field.fill('someone@example.com');
  await page.getByRole('button', { name: 'Close the account for good' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText(
    'That is not your e-mail address, so nothing was closed.',
  );

  await field.fill('owner@example.com');
  await page.getByRole('button', { name: 'Close the account for good' }).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText(
    'The account is closed. Everything is deleted on',
  );
});
