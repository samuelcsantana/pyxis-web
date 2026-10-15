import { expect, test } from '@playwright/test';

const DEMO_CONNECTION_REQUEST_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';

test('the demo has no consent page, since it has no API to connect an app to', async ({ page }) => {
  const response = await page.goto(`/connect?request=${DEMO_CONNECTION_REQUEST_ID}`);

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found · Pyxis');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});
