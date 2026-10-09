import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`settings, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/settings`);
      await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the gear beside the project and marks it current', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  await page.getByRole('link', { name: 'Project settings' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  await expect(page).toHaveTitle('Settings · Demo Store · Pyxis');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await expect(page.getByRole('link', { name: 'Project settings' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('shows the origins, a public key and no secret key value for each project', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);

  await expect(page.getByRole('region', { name: 'Allowed origins' })).toContainText(
    'https://store.example.com',
  );
  const keys = page.getByRole('region', { name: 'Keys' });
  await expect(keys).toContainText(/pyxis_pk_[0-9a-f]{32}/);
  await expect(keys).not.toContainText('pyxis_sk_');
  await expect(page.getByRole('region', { name: 'Data retention' })).toContainText('13 months');

  await page.goto(`/${DOCS_ID}/settings`);

  await expect(page.getByRole('region', { name: 'Allowed origins' })).toContainText(
    'https://docs.example.com',
  );
});
