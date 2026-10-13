import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const MAIN_DOMAIN = 'https://pyxis-analytics.dev';
const DEMO_SCREEN = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const path of ['/', '/pt-br']) {
      test(`has no WCAG 2.2 A or AA violation and no sideways scroll at ${path}`, async ({
        page,
      }) => {
        await page.goto(path);

        expect(await axeViolations(page)).toEqual([]);
        expect(await sidewaysOverflow(page)).toBe(0);
      });
    }
  });
}

test('serves each language at its own address, with the tags search engines read', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Product analytics without cookies or personal data · Pyxis');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', MAIN_DOMAIN);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    `${MAIN_DOMAIN}/pt-br`,
  );
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
    '"@type":"SoftwareApplication"',
  );

  await page
    .getByRole('navigation', { name: 'Language' })
    .getByRole('link', { name: 'Português (Brasil)' })
    .click();

  await expect(page).toHaveURL(/\/pt-br$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Análise de uso de produto sem cookie, sem IP e sem dado pessoal.',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${MAIN_DOMAIN}/pt-br`,
  );
});

test('keeps the chosen theme in both languages without setting a cookie', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: /theme/ }).click();
  const chosen = await page.locator('html').getAttribute('data-theme');

  await page.goto('/pt-br');

  expect(chosen).toMatch(/^(light|dark)$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', chosen ?? '');
  expect(await context.cookies()).toEqual([]);
});

test('leads to the live demo and the dashboard sign-in', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Open the live demo' })).toHaveAttribute(
    'href',
    'https://demo.pyxis-analytics.dev',
  );
  await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
    'href',
    'https://app.pyxis-analytics.dev/sign-in',
  );
});

test('sends any other address on the main domain to the demo', async ({ request }) => {
  const response = await request.get(`${DEMO_SCREEN}?range=7d`, { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe(
    `https://demo.pyxis-analytics.dev${DEMO_SCREEN}?range=7d`,
  );
});

test('gives crawlers of the main domain their own robots.txt and sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  const sitemap = await (await request.get('/sitemap.xml')).text();

  expect(robots).toContain(`Sitemap: ${MAIN_DOMAIN}/sitemap.xml`);
  expect(sitemap).toContain(`<loc>${MAIN_DOMAIN}/</loc>`);
  expect(sitemap).toContain(`<loc>${MAIN_DOMAIN}/pt-br</loc>`);
  expect(sitemap).toContain('hreflang="x-default"');
});
