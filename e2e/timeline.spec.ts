import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DEMO_USER = 'u_7f3a';
const SIGN_UP_VISIT = '19c2e5f6-a7b8-4c90-9d01-2e3f4a5b6c03';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`timeline, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/timeline?user=${DEMO_USER}`);
      await expect(page.getByRole('heading', { name: `User ${DEMO_USER}` })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('looks up the demo person and filters the story', async ({ page }) => {
  await page.goto(`/${STORE_ID}/timeline`);
  await expect(page.getByRole('heading', { name: 'Look up a person or a visit' })).toBeVisible();

  await page.getByRole('textbox', { name: 'User id' }).fill(DEMO_USER);
  await page.getByRole('button', { name: 'Show timeline' }).click();

  await expect(page).toHaveURL(new RegExp(`user=${DEMO_USER}$`));
  await expect(page.getByRole('region', { name: /^Visit .+ · / })).toHaveCount(2);
  await expect(page.getByText('1 failed request')).toBeVisible();

  await page.getByRole('link', { name: 'Errors only' }).click();
  await expect(page).toHaveURL(/show=errors/);
  await expect(page.getByRole('listitem').filter({ hasText: 'POST /' })).toHaveCount(1);
});

test('opens one visit by its id, and says when an id is unknown', async ({ page }) => {
  await page.goto(`/${STORE_ID}/timeline`);

  await page.getByRole('combobox', { name: 'Look up' }).selectOption('visit');
  await page.getByRole('textbox', { name: 'Visit id' }).fill(SIGN_UP_VISIT);
  await page.getByRole('button', { name: 'Show timeline' }).click();

  await expect(page).toHaveURL(new RegExp(`visit=${SIGN_UP_VISIT}$`));
  await expect(page.getByRole('region', { name: /^Visit 19c2e5f6 · / })).toContainText(
    'Visit linked to the user',
  );

  await page.goto(`/${STORE_ID}/timeline?user=nobody_here`);
  await expect(
    page.getByRole('heading', { name: 'No visits found for User nobody_here' }),
  ).toBeVisible();
});
