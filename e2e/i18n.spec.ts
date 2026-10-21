import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { languageTrigger } from './language-select';
import { parseCount } from './locale-numbers';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const PORTUGUESE = 'pt-BR';
const ONE_ROW_HEADER_PX = 72;

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

async function openLanguages(page: Page, isMobile: boolean, menu: string, account: string) {
  if (isMobile) {
    await page.getByRole('button', { name: menu }).click();
  }
  await page.locator('summary', { hasText: account }).click();
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

  test('names the demo store as the reader’s own site, in Portuguese', async ({ page }) => {
    await page.goto(`/${STORE_ID}/overview`);

    await expect(page).toHaveTitle('Visão geral · Meu site · Pyxis');
    await expect(page.getByText('MS', { exact: true }).first()).toBeAttached();
  });

  test('signs in in Portuguese', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveTitle('Entrar · Pyxis');
    await expect(page.getByRole('heading', { name: 'Entrar no Pyxis' })).toBeVisible();
    await expect(languageTrigger(page, 'Idioma')).toHaveText('Idioma: Português (Brasil)');
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

const SPANISH = 'es';

const SPANISH_SCREENS = [
  ['overview', 'Vista general'],
  ['funnel', 'Embudo'],
  ['features', 'Funcionalidades'],
  ['requests', 'Solicitudes'],
  ['timeline', 'Línea de tiempo'],
  ['visits', 'Visitas'],
  ['devices', 'Dispositivos'],
  ['acquisition', 'Adquisición'],
] as const;

test.describe('a browser that asks for Spanish', () => {
  test.use({ locale: 'es-MX' });

  for (const [slug, heading] of SPANISH_SCREENS) {
    test(`reads ${slug} in Spanish, accessible, without hydration errors or a sideways scroll`, async ({
      page,
    }) => {
      const errors = watchConsoleErrors(page);

      await page.goto(`/${STORE_ID}/${slug}`);

      await expect(page.locator('html')).toHaveAttribute('lang', SPANISH);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
      expect(errors).toEqual([]);
    });
  }

  test('signs in in Spanish', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveTitle('Iniciar sesión · Pyxis');
    await expect(page.getByRole('heading', { name: 'Iniciar sesión en Pyxis' })).toBeVisible();
    expect((await page.getByRole('banner').boundingBox())?.height).toBeLessThan(ONE_ROW_HEADER_PX);
    await expect(languageTrigger(page, 'Idioma')).toHaveText('Idioma: Español');
    expect(await axeViolations(page)).toEqual([]);
    expect(await sidewaysOverflow(page)).toBe(0);
  });

  test('counts the same visits as in English, written the Spanish way', async ({
    page,
    browser,
  }) => {
    await page.goto(`/${STORE_ID}/overview?range=30d`);
    const spanish = await visitsFigure(page, 'Visitas');
    const englishContext = await browser.newContext({ locale: 'en-US' });
    const englishPage = await englishContext.newPage();
    await englishPage.goto(`/${STORE_ID}/overview?range=30d`);
    const english = await visitsFigure(englishPage, 'Visits');
    await englishContext.close();

    expect(parseCount(spanish, SPANISH)).toBe(parseCount(english, 'en-US'));
    expect(parseCount(spanish, SPANISH)).toBeGreaterThan(999);
  });

  test('loads the rows a Server Action returns in Spanish', async ({ page }) => {
    await page.goto(`/${STORE_ID}/requests?range=7d`);

    await page.getByRole('button', { name: 'POST /orders, ver detalles' }).click();

    const details = page.getByRole('dialog', { name: 'POST /orders' });
    await expect(details.getByRole('table', { name: 'Día a día' })).toBeVisible();
    await expect(details.getByRole('columnheader', { name: 'Mediana' })).toBeVisible();
  });
});

const MORE_LANGUAGES = [
  {
    locale: 'de',
    browser: 'de-AT',
    screens: [
      ['overview', 'Übersicht'],
      ['funnel', 'Funnel'],
      ['features', 'Funktionen'],
      ['requests', 'Anfragen'],
      ['timeline', 'Zeitleiste'],
      ['visits', 'Besuche'],
      ['devices', 'Geräte'],
      ['acquisition', 'Akquisition'],
    ],
  },
  {
    locale: 'fr',
    browser: 'fr-CA',
    screens: [
      ['overview', 'Vue d’ensemble'],
      ['funnel', 'Entonnoir'],
      ['features', 'Fonctionnalités'],
      ['requests', 'Requêtes'],
      ['timeline', 'Chronologie'],
      ['visits', 'Visites'],
      ['devices', 'Appareils'],
      ['acquisition', 'Acquisition'],
    ],
  },
  {
    locale: 'it',
    browser: 'it-CH',
    screens: [
      ['overview', 'Panoramica'],
      ['funnel', 'Funnel'],
      ['features', 'Funzionalità'],
      ['requests', 'Richieste'],
      ['timeline', 'Cronologia'],
      ['visits', 'Visite'],
      ['devices', 'Dispositivi'],
      ['acquisition', 'Acquisizione'],
    ],
  },
  {
    locale: 'nl',
    browser: 'nl-BE',
    screens: [
      ['overview', 'Overzicht'],
      ['funnel', 'Funnel'],
      ['features', 'Functies'],
      ['requests', 'Verzoeken'],
      ['timeline', 'Tijdlijn'],
      ['visits', 'Bezoeken'],
      ['devices', 'Apparaten'],
      ['acquisition', 'Acquisitie'],
    ],
  },
] as const;

for (const language of MORE_LANGUAGES) {
  test.describe(`a browser that asks for ${language.browser}`, () => {
    test.use({ locale: language.browser });

    for (const [slug, heading] of language.screens) {
      test(`reads ${slug} in ${language.locale}, accessible, without hydration errors or a sideways scroll`, async ({
        page,
      }) => {
        const errors = watchConsoleErrors(page);

        await page.goto(`/${STORE_ID}/${slug}`);

        await expect(page.locator('html')).toHaveAttribute('lang', language.locale);
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        await expect(page.getByRole('main')).not.toHaveAttribute('aria-busy', 'true');
        expect(await axeViolations(page)).toEqual([]);
        expect(await sidewaysOverflow(page)).toBe(0);
        expect(errors).toEqual([]);
      });
    }
  });
}

test('counts the same visits in French as in English, with a narrow space between thousands', async ({
  browser,
}) => {
  const frenchContext = await browser.newContext({ locale: 'fr-FR' });
  const frenchPage = await frenchContext.newPage();
  await frenchPage.goto(`/${STORE_ID}/overview?range=30d`);
  const french = await visitsFigure(frenchPage, 'Visites');
  await frenchContext.close();
  const englishContext = await browser.newContext({ locale: 'en-US' });
  const englishPage = await englishContext.newPage();
  await englishPage.goto(`/${STORE_ID}/overview?range=30d`);
  const english = await visitsFigure(englishPage, 'Visits');
  await englishContext.close();

  expect(parseCount(french, 'fr')).toBe(parseCount(english, 'en-US'));
  expect(parseCount(french, 'fr')).toBeGreaterThan(999);
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

  await openLanguages(page, isMobile, 'Open menu', 'Account and preferences');
  await page.getByRole('button', { name: 'Português (Brasil)' }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);
  await expect(page.getByRole('heading', { level: 1, name: 'Visão geral' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', PORTUGUESE);

  await openLanguages(page, isMobile, 'Abrir menu', 'Conta e preferências');
  await page.getByRole('button', { name: 'Español' }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1, name: 'Vista general' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview\\?range=7d$`));

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  await openLanguages(page, isMobile, 'Abrir el menú', 'Cuenta y preferencias');
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

test('opens the account menu inside the window, with the languages in it', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);

  await openLanguages(page, isMobile, 'Open menu', 'Account and preferences');

  const languages = page.getByRole('group', { name: 'Language', exact: true });
  await expect(languages).toBeVisible();
  const box = await languages.boundingBox();
  const width = page.viewportSize()?.width ?? 0;
  expect(box?.x).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
  for (const name of ['English', 'Português (Brasil)', 'Español']) {
    await expect(languages.getByRole('button', { name })).toBeInViewport({ ratio: 1 });
  }
});
