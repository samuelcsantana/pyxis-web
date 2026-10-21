import { expect, type Locator, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { chooseLanguage } from './language-select';

const ONE_ROW_HEADER_PX = 72;
const NARROW_PHONE_WIDTHS = [320, 360, 390];
const PHONE_HEIGHT = 844;
const MAIN_DOMAIN = 'https://pyxis-analytics.dev';
const DEMO_PROJECT = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DEMO_SCREEN = `${DEMO_PROJECT}/overview`;
const DEMO_ORIGIN = 'http://localhost:3101';
const FRAMES_AFTER_CLICK = 5;
const ARRIVAL_TOLERANCE_PX = 2;

async function scrollAfterFollowing(link: Locator): Promise<readonly number[]> {
  return link.evaluate(async (anchor: HTMLElement, frames: number) => {
    anchor.click();
    const seen: number[] = [];
    for (let frame = 0; frame < frames; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      seen.push(window.scrollY);
    }
    return seen;
  }, FRAMES_AFTER_CLICK);
}

const HOME_PATHS = ['/', '/pt-br', '/es', '/de', '/fr', '/it', '/nl'];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: 'reduce' });

    for (const path of HOME_PATHS) {
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

for (const path of HOME_PATHS) {
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

test('keeps the header on one row on a phone, in every language', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Only a phone is narrow enough to wrap the header.');
  for (const path of HOME_PATHS) {
    await page.goto(path);

    const header = await page.getByRole('banner').boundingBox();
    expect(header?.height).toBeLessThan(ONE_ROW_HEADER_PX);
  }
});

test('keeps the billing period switch on one row on a phone, in every language', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Only a phone is narrow enough to wrap the switch.');
  for (const width of NARROW_PHONE_WIDTHS) {
    await page.setViewportSize({ width, height: PHONE_HEIGHT });
    for (const path of HOME_PATHS) {
      await page.goto(path);

      const optionTops = await page
        .locator('#pricing fieldset label')
        .evaluateAll((options) =>
          options.map((option) => Math.round(option.getBoundingClientRect().top)),
        );
      expect(new Set(optionTops).size, `${path} at ${String(width)}px`).toBe(1);
      expect(await sidewaysOverflow(page)).toBe(0);
    }
  }
});

test('serves each language at its own address, with the tags search engines read', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(
    'What converts and what fails on your site, without cookies · Pyxis',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', MAIN_DOMAIN);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    `${MAIN_DOMAIN}/pt-br`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
    'href',
    `${MAIN_DOMAIN}/es`,
  );
  for (const language of ['de', 'fr', 'it', 'nl']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute(
      'href',
      `${MAIN_DOMAIN}/${language}`,
    );
  }
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
    '"@type":"SoftwareApplication"',
  );

  await chooseLanguage(page, 'Language', 'Português (Brasil)');

  await expect(page).toHaveURL(/\/pt-br$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Descubra o que converte e o que falha no seu site, sem coletar dados pessoais.',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${MAIN_DOMAIN}/pt-br`,
  );

  await chooseLanguage(page, 'Idioma', 'Español');

  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle('Qué convierte y qué falla en tu sitio, sin cookies · Pyxis');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Descubre qué convierte y qué falla en tu sitio, sin recopilar datos personales.',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${MAIN_DOMAIN}/es`);
});

test('opens the other language from what the page fetched ahead of the click', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'speculation rules are a Chromium feature');
  await page.goto('/');

  await chooseLanguage(page, 'Language', 'Português (Brasil)');

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  expect(
    await page.evaluate((): unknown[] =>
      performance
        .getEntriesByType('navigation')
        .map((entry): unknown => Reflect.get(entry, 'deliveryType')),
    ),
  ).toEqual(['navigational-prefetch']);
});

test('switches language on the section being read, from what the page fetched ahead', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'speculation rules are a Chromium feature');
  await page.goto('/');
  await page
    .getByRole('region', { name: 'One plan, in reais, with everything the demo shows' })
    .scrollIntoViewIfNeeded();
  await expect(page).toHaveURL(/\/#pricing$/);

  await chooseLanguage(page, 'Language', 'Português (Brasil)');

  await expect(page).toHaveURL(/\/pt-br#pricing$/);
  await expect(
    page.getByRole('region', { name: 'Um plano, em reais, com tudo o que a demonstração mostra' }),
  ).toBeInViewport();
  expect(
    await page.evaluate((): unknown[] =>
      performance
        .getEntriesByType('navigation')
        .map((entry): unknown => Reflect.get(entry, 'deliveryType')),
    ),
  ).toEqual(['navigational-prefetch']);
});

test('opens the language chosen before when the address names none, with no cookie', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await chooseLanguage(page, 'Language', 'Español');
  await expect(page).toHaveURL(/\/es$/);

  await page.goto('/');

  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  expect(await context.cookies()).toEqual([]);

  await chooseLanguage(page, 'Idioma', 'English');
  await page.goto('/');

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test.describe('a browser that asks for Brazilian Portuguese', () => {
  test.use({ locale: 'pt-BR' });

  test('opens the Portuguese page from the address that names no language', async ({ page }) => {
    await page.goto('/?utm_source=post');

    await expect(page).toHaveURL(/\/pt-br\?utm_source=post$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Descubra o que converte e o que falha no seu site, sem coletar dados pessoais.',
    );
  });

  test('keeps the site the visitor came from as the source of the visit', async ({ page }) => {
    await page.goto('/', { referer: 'https://www.linkedin.com/' });

    await expect(page).toHaveURL(/\/pt-br$/);
    await page.getByRole('button', { name: 'Ver o que foi registrado' }).click();
    const recorded = page.getByRole('region', { name: 'O que esta página registrou' });
    await expect(recorded).toContainText('origem: linkedin.com', { timeout: 10_000 });
  });

  test('keeps the language an address names', async ({ page }) => {
    await page.goto('/es');

    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test('wears the theme kept on the device before any script of the page loads', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.setItem('pyxis:theme', 'dark');
  });
  await page.route('**/_next/static/**/*.js', (route) => route.abort());

  await page.goto('/pt-br');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('shows on the preview card the drop-off and the failing write the demo screens show', async ({
  page,
}) => {
  await page.goto('/');
  const facts = page.locator('#landing-preview dl').last();
  const [dropOff, failingWrite] = await facts.locator('dd code').allTextContents();
  const [continued, failed] = await facts.locator('dd .text-bad').allTextContents();
  const failedShare = failed?.replace(' failed', '') ?? '';

  await page.goto(`${DEMO_ORIGIN}${DEMO_PROJECT}/funnel?range=30d`);
  await expect(page.getByText(`· ${continued ?? ''}`, { exact: false }).first()).toBeVisible();
  expect(dropOff).toMatch(/ → /);

  await page.goto(`${DEMO_ORIGIN}${DEMO_PROJECT}/requests?range=30d`);
  await expect(
    page
      .getByRole('row')
      .filter({ hasText: failingWrite ?? '' })
      .first(),
  ).toContainText(`${failedShare} errors`);
});

test('opens the other language still, without playing the entrance again', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('.landing-preview');
  await expect(preview).not.toHaveCSS('animation-name', 'none');

  await chooseLanguage(page, 'Language', 'Português (Brasil)');

  await expect(page.locator('html')).toHaveAttribute('data-language-switched', '');
  await expect(preview).toHaveCSS('animation-name', 'none');

  await page.reload();

  await expect(page.locator('html')).not.toHaveAttribute('data-language-switched');
});

test('opens an address with a section already on it, without gliding from the top', async ({
  page,
}) => {
  await page.goto('/pt-br#pricing');

  const { opened, settled } = await page.evaluate(() => {
    const scrolled = window.scrollY;
    document.getElementById('pricing')?.scrollIntoView();
    return { opened: scrolled, settled: window.scrollY };
  });
  expect(opened).toBeGreaterThan(0);
  expect(Math.abs(opened - settled)).toBeLessThanOrEqual(ARRIVAL_TOLERANCE_PX);
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
    'https://demo.pyxis-analytics.dev/?lang=en',
  );
  await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
    'href',
    'https://app.pyxis-analytics.dev/sign-in?lang=en',
  );
});

test('carries the language and the chosen theme to the dashboard and the demo', async ({
  page,
}) => {
  await page.goto('/pt-br');
  await page.getByRole('button', { name: /tema/i }).click();
  const theme = await page.locator('html').getAttribute('data-theme');

  await expect(page.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
    'href',
    `https://app.pyxis-analytics.dev/sign-in?lang=pt-BR&theme=${theme ?? ''}`,
  );
  await expect(page.getByRole('link', { name: 'Abrir a demonstração' })).toHaveAttribute(
    'href',
    `https://demo.pyxis-analytics.dev/?lang=pt-BR&theme=${theme ?? ''}`,
  );
});

test('wears the theme a link brought and remembers it, with no cookie and a clean address', async ({
  page,
  context,
}) => {
  await page.goto('/pt-br?theme=dark');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page).toHaveURL(/\/pt-br$/);
  expect(await page.evaluate(() => window.localStorage.getItem('pyxis:theme'))).toBe('dark');
  expect(await context.cookies()).toEqual([]);
});

test('shows the sections in order', async ({ page }) => {
  await page.goto('/');

  const sections = page.locator('main section[id]');
  expect(await sections.evaluateAll((all) => all.map((section) => section.id))).toEqual([
    'never-stored',
    'dashboard',
    'ask-claude',
    'install',
    'in-production',
    'built-in-public',
    'architecture',
    'comparison',
    'pricing',
    'faq',
    'story',
  ]);
});

test('unfolds a question of the FAQ', async ({ page }) => {
  await page.goto('/');

  const question = page.getByText('Does it store IP addresses?');
  await question.evaluate((summary) => {
    summary.scrollIntoView({ block: 'center' });
  });
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

test('jumps to the pricing from the header', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the header keeps only the essentials on a phone');
  await page.goto('/');

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Pricing' })
    .click();

  await expect(page).toHaveURL(/#pricing$/);
  await expect(
    page.getByRole('heading', { name: 'One plan, in reais, with everything the demo shows' }),
  ).toBeInViewport();
});

test('shows the yearly price once the visitor picks it', async ({ page }) => {
  await page.goto('/pt-br#pricing');
  const pricing = page.getByRole('region', {
    name: 'Um plano, em reais, com tudo o que a demonstração mostra',
  });

  await expect(pricing.getByText('R$ 39', { exact: true })).toBeVisible();
  await expect(pricing.getByText('R$ 390', { exact: true })).toBeHidden();
  await pricing.locator('label').filter({ hasText: 'Anual' }).click();

  await expect(pricing.getByRole('radio', { name: /^Anual/ })).toBeChecked();
  await expect(pricing.getByText('R$ 390', { exact: true })).toBeVisible();
  await expect(pricing.getByText('R$ 39', { exact: true })).toBeHidden();
});

test('opens the request for access with the address to write to', async ({ page }) => {
  await page.goto('/#pricing');
  const pricing = page.getByRole('region', {
    name: 'One plan, in reais, with everything the demo shows',
  });
  const address = pricing.getByText('hello@pyxis-analytics.dev', { exact: true });

  await expect(address).toBeHidden();
  await pricing.getByText('Request access').click();

  await expect(address).toBeVisible();
  await expect(pricing.getByRole('link', { name: 'Open in my e-mail app' })).toHaveAttribute(
    'href',
    'mailto:hello@pyxis-analytics.dev?subject=I%20would%20like%20to%20use%20Pyxis',
  );
});

test('opens each dashboard screen of the demo store from its card', async ({ page }) => {
  await page.goto('/');

  const section = page.getByRole('region', { name: 'What the dashboard answers' });
  const cards = section.getByRole('list').getByRole('link');
  await expect(cards).toHaveCount(8);
  await expect(cards.first()).toHaveAttribute(
    'href',
    'https://demo.pyxis-analytics.dev/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview?lang=en',
  );
  await expect(section.getByRole('link', { name: 'How to connect' })).toHaveAttribute(
    'href',
    '#ask-claude',
  );
});

test('leads from the hero to asking Claude, and copies the connector address', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  await page.getByRole('link', { name: /Ask Claude about your numbers/ }).click();

  await expect(page).toHaveURL(/#ask-claude$/);
  const section = page.getByRole('region', {
    name: 'Ask Claude instead of digging through charts',
  });
  await expect(section).toBeInViewport();
  await section.getByRole('button', { name: 'Copy' }).first().click();
  await expect(section.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'https://api.pyxis-analytics.dev/mcp',
  );
});

test('glides to a section of the page instead of jumping to it', async ({ page }) => {
  await page.goto('/');

  const path = await scrollAfterFollowing(
    page.getByRole('link', { name: /Ask Claude about your numbers/ }),
  );
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-gliding'));

  const landed = await page.evaluate(() => window.scrollY);
  expect(path[0]).toBeLessThan(landed);
  expect(new Set(path).size).toBeGreaterThan(1);
  await expect(page).toHaveURL(/#ask-claude$/);
});

test('the mascot arrives on its own, tells tips, and flies off once it has led there', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const nudge = page.getByRole('complementary', { name: 'News: Pyxis in Claude' });
  await expect(nudge).toBeVisible();
  await expect(nudge).toContainText('MCP access is here!');

  await nudge.getByRole('button', { name: 'Another tip' }).click();
  await expect(nudge).toContainText('Ask “how did last week go?” and Claude reads your numbers.');
  await nudge.getByRole('link', { name: 'See how to connect' }).click();
  await expect(page).toHaveURL(/#ask-claude$/);
  await expect(nudge).toHaveCount(0);
  await page.goto('/');
  await page.waitForTimeout(2_000);
  await expect(page.getByRole('complementary', { name: 'News: Pyxis in Claude' })).toHaveCount(0);

  const nextVisit = await context.newPage();
  await nextVisit.goto('/');
  const nextNudge = nextVisit.getByRole('complementary', { name: 'News: Pyxis in Claude' });
  await expect(nextNudge).toBeVisible();
  await nextNudge.getByRole('button', { name: 'Dismiss' }).click();
  await expect(nextNudge).toHaveCount(0);
  await nextVisit.reload();
  await nextVisit.waitForTimeout(2_000);
  await expect(nextVisit.getByRole('complementary', { name: 'News: Pyxis in Claude' })).toHaveCount(
    0,
  );
});

test('keeps the mascot away from a page opened on the section it leads to', async ({
  page,
  context,
}) => {
  await page.goto('/#ask-claude');
  await page.waitForTimeout(2_000);
  await expect(page.getByRole('complementary', { name: 'News: Pyxis in Claude' })).toHaveCount(0);

  const atTheTop = await context.newPage();
  await atTheTop.goto('/');
  await expect(
    atTheTop.getByRole('complementary', { name: 'News: Pyxis in Claude' }),
  ).toBeVisible();
});

test('keeps the address on the section being read, and clean at the top', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('region', { name: 'One plan, in reais, with everything the demo shows' })
    .scrollIntoViewIfNeeded();
  await expect(page).toHaveURL(/\/#pricing$/);
  await page.getByRole('region', { name: 'Questions people ask' }).scrollIntoViewIfNeeded();
  await expect(page).toHaveURL(/\/#faq$/);

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
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

  test('jumps straight to a section of the page', async ({ page }) => {
    await page.goto('/');

    const path = await scrollAfterFollowing(
      page.getByRole('link', { name: /Ask Claude about your numbers/ }),
    );

    expect(new Set(path).size).toBe(1);
    await expect(
      page.getByRole('region', { name: 'Ask Claude instead of digging through charts' }),
    ).toBeInViewport();
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

  test('runs in a Chromium that does not report automation, as a visitor browser does', async ({
    page,
  }) => {
    await page.goto('/');

    expect(await page.evaluate(() => navigator.webdriver)).toBe(false);
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

  test('keeps the recorder toggle off the first screen until the visitor scrolls', async ({
    page,
  }) => {
    for (const path of HOME_PATHS) {
      await page.goto(path);
      const toggle = page.getByRole('button', {
        name: /What this page recorded|O que esta página registrou|Lo que registró esta página|Was diese Seite erfasst hat|Ce que cette page a enregistré|Cosa ha registrato questa pagina|Wat deze pagina vastlegde/,
        includeHidden: true,
      });
      await expect(toggle).toHaveCount(1);
      await expect(toggle).toBeHidden();

      await page.evaluate(() => {
        window.scrollTo({ top: 400, behavior: 'instant' });
      });
      await expect(toggle).toBeVisible();

      await toggle.click();
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await expect(toggle).toBeVisible();
      await expect(
        page.getByRole('region', {
          name: /What this page recorded|O que esta página registrou|Lo que registró esta página|Was diese Seite erfasst hat|Ce que cette page a enregistré|Cosa ha registrato questa pagina|Wat deze pagina vastlegde/,
        }),
      ).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(toggle).toBeHidden();
    }
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
  const headers = { 'x-forwarded-host': 'pyxis-analytics.dev' };
  const robots = await (await request.get('/robots.txt', { headers })).text();
  const sitemap = await (await request.get('/sitemap.xml', { headers })).text();

  expect(robots).toContain(`Sitemap: ${MAIN_DOMAIN}/sitemap.xml`);
  expect(sitemap).toContain(`<loc>${MAIN_DOMAIN}/</loc>`);
  expect(sitemap).toContain(`<loc>${MAIN_DOMAIN}/pt-br</loc>`);
  expect(sitemap).toContain(`<loc>${MAIN_DOMAIN}/es</loc>`);
  expect(sitemap).toContain('hreflang="x-default"');
});

test('offers no install of the home page as an app', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="manifest"]')).toHaveCount(0);
  expect((await request.get('/manifest.webmanifest')).status()).toBe(404);
});
