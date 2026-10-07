import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const DEMO_PROJECT_PATH = /\/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d\/overview$/;

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`sign-in page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation on either step', async ({ page }) => {
      await page.goto('/sign-in?expired=1');
      expect(await axeViolations(page)).toEqual([]);

      await page.getByLabel('Email').fill('owner@demo-store.example');
      await page.getByRole('button', { name: 'Send code' }).click();
      await expect(page.getByLabel('6-digit code')).toBeFocused();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('tells a visitor whose session ended why they are here', async ({ page }) => {
  await page.goto('/sign-in?expired=1');

  await expect(page.getByRole('status')).toHaveText(
    'Your session ended. Sign in again to continue.',
  );
});

test('refuses a wrong code, then signs in with the demo code', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();

  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await expect(page.getByText('Code sent.')).toBeVisible();

  await page.getByLabel('6-digit code').fill('123456');
  await page.getByRole('button', { name: 'Verify and continue' }).click();
  await expect(page.locator('#sign-in-error')).toContainText('Invalid or expired code');

  await page.getByLabel('6-digit code').fill('000000');
  await page.getByRole('button', { name: 'Verify and continue' }).click();

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
});

test('goes back to change the email', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('typo@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();

  await page.getByRole('button', { name: 'Use a different email' }).click();

  await expect(page.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeFocused();
});

test('leaves the focus alone when the page opens', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByLabel('Email')).not.toBeFocused();
});

async function signInWithTheDemoCode(page: Page) {
  await page.getByLabel('Email').fill('owner@demo-store.example');
  await page.getByRole('button', { name: 'Send code' }).click();
  await page.getByLabel('6-digit code').fill('000000');
  await page.getByRole('button', { name: 'Verify and continue' }).click();
}

test('comes back to the screen it was sent from, filters included', async ({ page }) => {
  const screen = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/requests?show=failing&range=7d';
  await page.goto(`/sign-in?${new URLSearchParams({ next: screen }).toString()}`);

  await signInWithTheDemoCode(page);

  await expect(page).toHaveURL(/\/requests\?show=failing&range=7d$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Requests' })).toBeVisible();
});

test('goes to the projects when asked to come back somewhere else', async ({ page }) => {
  await page.goto('/sign-in?next=%2F%2Fevil.example%2Foverview');

  await signInWithTheDemoCode(page);

  await expect(page).toHaveURL(DEMO_PROJECT_PATH);
});
