import { expect, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';
const DOCS_NAME = 'Demo Docs';
const LIGHT_BACKGROUND = '#f4f6fa';
const DARK_BACKGROUND = '#0a1220';

test('names the screen and the project in the title of every screen', async ({ page }) => {
  await page.goto(`/${STORE_ID}/overview`);
  await expect(page).toHaveTitle('Overview · Demo Store · Pyxis');

  await page.goto(`/${DOCS_ID}/requests`);
  await expect(page).toHaveTitle(`Requests · ${DOCS_NAME} · Pyxis`);

  await page.goto('/sign-in');
  await expect(page).toHaveTitle('Sign in · Pyxis');
});

for (const [theme, color] of [
  ['dark', DARK_BACKGROUND],
  ['light', LIGHT_BACKGROUND],
] as const) {
  test(`colours the browser bar with the ${theme} theme the visitor chose`, async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([{ name: 'pyxis_theme', value: theme, url: baseURL ?? '' }]);

    await page.goto(`/${STORE_ID}/overview`);

    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', color);
  });
}

test('follows the system theme in the browser bar when none was chosen', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(
    page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'),
  ).toHaveAttribute('content', DARK_BACKGROUND);
  await expect(
    page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]'),
  ).toHaveAttribute('content', LIGHT_BACKGROUND);
});

test('serves the manifest, the favicon and a robots file that lets crawlers into the demo', async ({
  request,
}) => {
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.status()).toBe(200);
  expect(await manifest.json()).toMatchObject({ name: 'Pyxis', start_url: '/' });

  expect((await request.get('/favicon.ico')).status()).toBe(200);

  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toMatch(/User-Agent: \*\nAllow: \//);
});

test('gives the demo a link preview card with an image that loads', async ({ page, request }) => {
  await page.goto('/sign-in');

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Pyxis live demo',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  const image = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(image).not.toBeNull();
  const response = await request.get(new URL(image ?? '').pathname);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('image/png');
});
