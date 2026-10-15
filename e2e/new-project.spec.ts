import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`new project, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto('/new-project');
      await expect(page.getByRole('heading', { level: 1, name: 'New project' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('creates a project from the switcher and follows it to the installation', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.locator('summary', { hasText: 'Switch project' }).click();
  await page.getByRole('link', { name: 'New project' }).click();
  await expect(page).toHaveURL(/\/new-project$/);

  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();

  await page.getByRole('textbox', { name: 'Project name' }).fill('My shop');
  await page.getByRole('textbox', { name: 'Site address' }).fill('shop.example.com');
  await page.getByRole('button', { name: 'Create project' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/install$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Install' })).toBeVisible();
  await expect(page.getByText(/init\(\{ key: 'pyxis_pk_/).first()).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
  await page.getByRole('link', { name: 'Open the dashboard' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview$`));
});
