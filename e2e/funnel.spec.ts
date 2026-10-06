import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`funnel, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation, also while editing', async ({ page }) => {
      await page.goto(`/${STORE_ID}/funnel`);
      await page.getByRole('link', { name: 'Start from an example funnel' }).click();
      await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);

      await page.getByRole('button', { name: 'Edit steps' }).click();
      await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('calculator');
      await expect(page.getByText('A page path starts with "/".')).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('round-trips an edited funnel through the URL', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel?range=30d`);
  await expect(page.getByRole('heading', { name: 'Build a funnel' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Step 1 page path' }).fill('/pricing');
  await page.getByRole('textbox', { name: 'Step 2 event name' }).fill('cta_clicked');
  await page.getByRole('button', { name: 'Add step' }).click();
  await page.getByRole('textbox', { name: 'Step 3 event name' }).fill('signup_completed');
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/steps=/);
  const steps = page.getByRole('list', { name: 'Funnel' }).getByRole('listitem');
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(2)).toContainText('Signup completed');

  await page.reload();
  await expect(steps).toHaveCount(3);
  await page.getByRole('button', { name: 'Edit steps' }).click();
  await expect(page.getByRole('textbox', { name: 'Step 1 page path' })).toHaveValue('/pricing');

  await page
    .getByRole('navigation', { name: 'Period' })
    .getByRole('link', { name: '7 days' })
    .click();
  await expect(page).toHaveURL(/range=7d/);
  await expect(steps).toHaveCount(3);
});

test('reorders the steps with the keyboard alone', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel`);
  await page.getByRole('link', { name: 'Start from an example funnel' }).click();
  await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit steps' }).click();

  await page.getByRole('button', { name: 'Move step 1 down' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('button', { name: 'Move step 2 down' })).toBeFocused();
  await expect(page.getByRole('textbox', { name: 'Step 2 page path' })).toHaveValue('/calculator');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Step 1 page path' })).toHaveValue('/calculator');

  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(
    page.getByRole('list', { name: 'Funnel' }).getByRole('listitem').first(),
  ).toContainText('Opened /calculator');
});

test('switches between per visit and per person and keeps the steps', async ({ page }) => {
  await page.goto(`/${STORE_ID}/funnel`);
  await page.getByRole('link', { name: 'Start from an example funnel' }).click();
  await expect(page.getByRole('list', { name: 'Funnel' })).toBeVisible();

  await page.getByRole('link', { name: 'Per person' }).click();

  await expect(page).toHaveURL(/mode=user/);
  await expect(page.getByRole('list', { name: 'Funnel' }).getByRole('listitem')).toHaveCount(6);
  await expect(page.getByText(/Per person: steps can span visits/)).toBeVisible();
});
