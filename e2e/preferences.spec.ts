import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { openThemeAndLanguage } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`theme and language, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({
      page,
      isMobile,
    }) => {
      await page.goto(`/${STORE_ID}/overview`);
      const part = await openThemeAndLanguage(page, isMobile);

      await expect(part.getByText('These apply to this browser.')).toBeVisible();
      await expect(part.getByRole('button', { name: 'System' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the account menu as the window, titled after the part', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);

  await openThemeAndLanguage(page, isMobile);

  await expect(page).toHaveURL(/\/account\/preferences$/);
  await expect(page).toHaveTitle('Theme and language · My site · Pyxis');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));
});

test('opens directly as the full Settings page, with the choices of this browser', async ({
  page,
}) => {
  await page.goto('/account/preferences');

  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  const part = page.getByRole('region', { name: 'Theme and language' });
  await expect(part.getByRole('group', { name: 'Theme' })).toBeVisible();
  await expect(part.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
  expect(await axeViolations(page)).toEqual([]);
});
