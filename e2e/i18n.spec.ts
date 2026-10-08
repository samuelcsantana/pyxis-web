import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { parseCount } from './locale-numbers';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const PORTUGUESE = 'pt-BR';

const SCREENS = [
  ['overview', 'Visão geral'],
  ['funnel', 'Funil'],
  ['features', 'Funcionalidades'],
  ['requests', 'Requisições'],
  ['timeline', 'Linha do tempo'],
  ['visits', 'Visitas'],
  ['devices', 'Dispositivos'],
  ['acquisition', 'Aquisição'],
] as const;

function watchConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}

async function openLanguages(page: Page, isMobile: boolean, menu: string, languages: string) {
  if (isMobile) {
    await page.getByRole('button', { name: menu }).click();
    return;
  }
  await page.locator('summary', { hasText: languages }).click();
}

async function visitsFigure(page: Page, name: string): Promise<string | null> {
  return page.getByRole('group', { name, exact: true }).locator('p').first().textContent();
}

test.describe('a browser that asks for Brazilian Portuguese', () => {
  test.use({ locale: PORTUGUESE });

  for (const [slug, heading] of SCREENS) {
    test(`reads ${slug} in Portuguese, accessible, without hydration errors or a sideways scroll`, async ({
      page,
    }) => {
      const errors = watchConsoleErrors(page);

      await page.goto(`/${STORE_ID}/${slug}`);

      await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
      expect(errors).toEqual([]);
    });
  }

  test('signs in in Portuguese', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveTitle('Entrar · Pyxis');
    await expect(page.getByRole('heading', { name: 'Entrar no Pyxis' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(await axeViolations(page)).toEqual([]);
    expect(await sidewaysOverflow(page)).toBe(0);
  });

  test('counts the same visits as in English, written the Brazilian way', async ({
    page,
    browser,
  }) => {
    await page.goto(`/${STORE_ID}/overview?range=30d`);
    const portuguese = await visitsFigure(page, 'Visitas');
    const englishContext = await browser.newContext({ locale: 'en-US' });
    const englishPage = await englishContext.newPage();
    await englishPage.goto(`/${STORE_ID}/overview?range=30d`);
    const english = await visitsFigure(englishPage, 'Visits');
    await englishContext.close();

    expect(parseCount(portuguese, PORTUGUESE)).toBe(parseCount(english, 'en-US'));
    expect(parseCount(portuguese, PORTUGUESE)).toBeGreaterThan(999);
    expect(portuguese).toContain('.');
  });

  test('loads the rows a Server Action returns in Portuguese', async ({ page }) => {
    await page.goto(`/${STORE_ID}/requests?range=7d`);

    await page.getByRole('button', { name: 'POST /orders, ver detalhes' }).click();

    const details = page.getByRole('dialog', { name: 'POST /orders' });
    await expect(details.getByRole('table', { name: 'Dia a dia' })).toBeVisible();
    await expect(details.getByRole('columnheader', { name: 'Mediana' })).toBeVisible();
  });

  test('keeps the customer data as it was sent', async ({ page }) => {
    await page.goto(`/${STORE_ID}/overview?range=30d`);

    await expect(page.getByRole('region', { name: 'Páginas mais vistas' })).toContainText(
      '/calculator',
    );
    await expect(page.getByRole('region', { name: 'Principais eventos' })).toContainText(
      'Calculator result shown',
    );
  });
});

test('serves Brazilian Portuguese to a browser that asks for European Portuguese', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'pt-PT' });
  const page = await context.newPage();

  await page.goto(`/${STORE_ID}/overview`);

  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);
  await context.close();
});

test('switches the language in place, keeping the address, and back', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?range=7d`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await openLanguages(page, isMobile, 'Open menu', 'Language: English');
  await page.getByRole('button', { name: 'Português (Brasil)' }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);
  await expect(page.getByRole('heading', { level: 1, name: 'Visão geral' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);

  await openLanguages(page, isMobile, 'Abrir menu', 'Idioma: Português (Brasil)');
  await page.getByRole('button', { name: 'English' }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));
});

test('keeps a chosen language over the one the browser asks for', async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([{ name: 'pyxis_locale', value: PORTUGUESE, url: baseURL ?? '' }]);

  await page.goto(`/${STORE_ID}/visits`);

  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);
  await expect(page.getByRole('heading', { level: 1, name: 'Visitas' })).toBeVisible();
});
