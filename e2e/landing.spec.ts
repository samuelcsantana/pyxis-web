import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const MAIN_DOMAIN = 'https://pyxis-analytics.dev';
const DEMO_SCREEN = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: 'reduce' });

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

for (const path of ['/', '/pt-br']) {
  test(`grows with the reader's text size and never scrolls sideways at ${path}`, async ({
    page,
  }) => {
    await page.goto(path);
    const before = await page
      .getByRole('heading', { level: 1 })
      .evaluate((heading) => parseFloat(getComputedStyle(heading).fontSize));

    await page.addStyleTag({ content: 'html { font-size: 32px; }' });

    const after = await page
      .getByRole('heading', { level: 1 })
      .evaluate((heading) => parseFloat(getComputedStyle(heading).fontSize));
    expect(after).toBe(before * 2);
    await expect.poll(() => sidewaysOverflow(page)).toBe(0);
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

test('shows the sections in order', async ({ page }) => {
  await page.goto('/');

  const sections = page.locator('main section[id]');
  expect(await sections.evaluateAll((all) => all.map((section) => section.id))).toEqual([
    'never-stored',
    'dashboard',
    'install',
    'in-production',
    'built-in-public',
    'architecture',
    'comparison',
    'faq',
    'story',
  ]);
});

test('unfolds a question of the FAQ', async ({ page }) => {
  await page.goto('/');

  const question = page.getByText('Does it store IP addresses?');
  await question.click();

  await expect(page.getByText(/the address itself is never written anywhere/)).toBeVisible();
});

test('jumps to the privacy section from the header', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the header keeps only the essentials on a phone');
  await page.goto('/');

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Privacy' })
    .click();

  await expect(page).toHaveURL(/#never-stored$/);
  await expect(page.getByRole('heading', { name: 'What never gets stored' })).toBeInViewport();
});

test('opens each dashboard screen of the demo store from its card', async ({ page }) => {
  await page.goto('/');

  const cards = page.getByRole('region', { name: 'What the dashboard answers' }).getByRole('link');
  await expect(cards).toHaveCount(8);
  await expect(cards.first()).toHaveAttribute(
    'href',
    'https://demo.pyxis-analytics.dev/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview',
  );
});

test('copies the install command', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  const install = page.getByRole('region', { name: 'What a site adds' });
  await install.getByRole('button', { name: 'Copy' }).first().click();

  await expect(install.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'npm install pyxis-analytics',
  );
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('moves nothing, on load or while scrolling', async ({ page }) => {
    await page.goto('/');
    await page.mouse.wheel(0, 2_000);

    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
});

test('shows every section fully once it has been scrolled into view', async ({ page }) => {
  await page.goto('/');

  const story = page.getByRole('region', { name: 'Why Pyxis exists' });
  await story.scrollIntoViewIfNeeded();

  await expect(story.locator('.landing-reveal')).toHaveCSS('opacity', '1');
});

test.describe('measuring itself', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v1/batch', (route) => route.fulfill({ status: 202, body: '' }));
  });

  test('lists what this visit sent, live, and what never leaves the browser', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'See what it recorded' }).click();

    const recorded = page.getByRole('region', { name: 'What this page recorded' });
    await expect(recorded.getByText('page_view', { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(recorded).toContainText('Never sent:');
  });

  test('stops measuring in this browser when asked, until asked again', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Don’t measure my visits' }).click();

    await expect(page.getByText('Measurement is off in this browser.')).toBeVisible();
    await page.reload();
    await expect(page.getByText('Measurement is off in this browser.')).toBeVisible();
    await page.getByRole('button', { name: 'Measure again' }).click();
    await expect(page.getByText(/measured by Pyxis itself/)).toBeVisible();
  });
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
