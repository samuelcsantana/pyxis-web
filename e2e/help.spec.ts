import { expect, type Page, test } from '@playwright/test';
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

async function openHelpFromTheAccountMenu(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  await page.getByRole('link', { name: 'Help and support' }).click();
}

test('opens from the account menu as the settings window, in two clicks, with the support address', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);

  await openHelpFromTheAccountMenu(page, isMobile);

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help$`));
  await expect(page).toHaveTitle('Help and support · My site · Pyxis');
  const part = page.getByRole('dialog', { name: 'Settings' }).getByRole('region', {
    name: 'Help and support',
  });
  const write = part.getByRole('region', { name: 'Write to support' });
  await expect(write.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(write.getByText(/reply within 2 business days/)).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);

  await part.getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/install$`));
  await expect(page.getByRole('dialog', { name: 'Install' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(1);
});

test('keeps the period of the screen through Help and Install', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/acquisition?range=today`);

  await openHelpFromTheAccountMenu(page, isMobile);
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help\\?range=today$`));

  await page.getByRole('link', { name: 'How to install' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/install\\?range=today$`));
  await expect(page.getByRole('dialog', { name: 'Install' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help\\?range=today$`));
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/acquisition\\?range=today$`));
  await expect(page.getByRole('dialog')).toHaveCount(0);

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Visits', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/visits\\?range=today$`));
});

test('closes to the screen it opened over with Escape', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);

  await openHelpFromTheAccountMenu(page, isMobile);
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));
  await expect(
    isMobile
      ? page.getByRole('button', { name: 'Open menu' })
      : page.locator('summary', { hasText: 'Account and preferences' }),
  ).toBeFocused();
});

test('stays the Help page when opened directly, marked in the account menu, which reloads it', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/help`);
  await expect(page.getByRole('heading', { level: 1, name: 'Help and support' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(currentNavigationLinks(page)).toHaveCount(0);

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Account and preferences' }).click();
  const row = page.getByRole('link', { name: 'Help and support' });
  await expect(row).toHaveAttribute('aria-current', 'page');
  await row.click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/help$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Help and support' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await axeViolations(page)).toEqual([]);
});

test('leaves the support address out of Account and billing', async ({ page }) => {
  await page.goto('/account');

  await expect(page.getByRole('region', { name: 'Account and billing' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Support' })).toHaveCount(0);
});
