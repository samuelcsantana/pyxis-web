import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const DOCUMENTS = [
  { path: '/termos', title: 'Termos de Uso do Pyxis' },
  {
    path: '/privacidade',
    title: 'Política de Privacidade do Pyxis',
  },
  {
    path: '/acordo-de-tratamento',
    title: 'Acordo de Tratamento de Dados Pessoais do Pyxis',
  },
  { path: '/en/terms', title: 'Pyxis Terms of Use' },
  { path: '/en/privacy', title: 'Pyxis Privacy Policy' },
  { path: '/en/dpa', title: 'Pyxis Personal Data Processing Agreement' },
  { path: '/es/terms', title: 'Términos de Uso de Pyxis' },
  { path: '/es/privacy', title: 'Política de Privacidad de Pyxis' },
  { path: '/es/dpa', title: 'Acuerdo de Tratamiento de Datos Personales de Pyxis' },
  { path: '/de/terms', title: 'Nutzungsbedingungen von Pyxis' },
  { path: '/de/privacy', title: 'Datenschutzerklärung von Pyxis' },
  { path: '/de/dpa', title: 'Auftragsverarbeitungsvertrag von Pyxis' },
  { path: '/fr/terms', title: 'Conditions d’utilisation de Pyxis' },
  { path: '/fr/privacy', title: 'Politique de confidentialité de Pyxis' },
  { path: '/fr/dpa', title: 'Accord de traitement des données personnelles de Pyxis' },
  { path: '/it/terms', title: 'Termini di utilizzo di Pyxis' },
  { path: '/it/privacy', title: 'Informativa sulla privacy di Pyxis' },
  { path: '/it/dpa', title: 'Accordo sul trattamento dei dati personali di Pyxis' },
  { path: '/nl/terms', title: 'Gebruiksvoorwaarden van Pyxis' },
  { path: '/nl/privacy', title: 'Privacybeleid van Pyxis' },
  { path: '/nl/dpa', title: 'Verwerkersovereenkomst van Pyxis' },
] as const;

const SELLER_LINE =
  'Fornecedor: Ana Exemplo · CPF 000.000.000-00 · Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000 · hello@pyxis-analytics.dev';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`contract documents, ${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: 'reduce' });

    for (const document of DOCUMENTS) {
      test(`${document.path} has no WCAG 2.2 A or AA violation and no sideways scroll`, async ({
        page,
      }) => {
        await page.goto(document.path);

        await expect(page.getByRole('heading', { level: 1, name: document.title })).toBeVisible();
        expect(await axeViolations(page)).toEqual([]);
        expect(await sidewaysOverflow(page)).toBe(0);
      });
    }
  });
}

test('shows the terms in Portuguese with the seller, the version and the effective date', async ({
  page,
}) => {
  await page.goto('/termos');

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page).toHaveTitle('Termos de Uso · Pyxis');
  await expect(
    page.getByText('Versão 1.3, vigente a partir de 20 de outubro de 2026.'),
  ).toBeVisible();
  await expect(page.getByText(/oferecido por Ana Exemplo, pessoa física/)).toBeVisible();
  await expect(page.getByText(SELLER_LINE)).toBeVisible();
  const documents = page.getByRole('navigation', { name: 'Documentos do contrato' });
  await expect(documents.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await documents.getByRole('link', { name: 'Política de Privacidade' }).click();

  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Política de Privacidade do Pyxis' }),
  ).toBeVisible();
});

test('lets a keyboard reach a wide table and scroll it on a small screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacidade');

  const table = page.getByRole('region', { name: 'Tabela 1' });
  await table.focus();

  await expect(table).toBeFocused();
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
});

test('links the contract in the page language from the home page footer', async ({ page }) => {
  await page.goto('/');

  const footer = page.getByRole('contentinfo');
  await expect(
    footer.getByText('Courtesy translations; the Portuguese text prevails.'),
  ).toBeVisible();
  await expect(footer.getByText(/^Sold by Ana Exemplo · CPF 000\.000\.000-00/)).toBeVisible();

  await footer.getByRole('link', { name: 'Terms of Use' }).click();

  await expect(page).toHaveURL(/\/en\/terms$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('shows a translation in its language and leads to the Portuguese text that prevails', async ({
  page,
}) => {
  await page.goto('/de/terms');

  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page).toHaveTitle('Nutzungsbedingungen · Pyxis');
  await expect(page.getByText('Version 1.3, gültig ab 20. Oktober 2026.')).toBeVisible();
  const versions = page.getByRole('navigation', { name: 'Dieses Dokument in anderen Sprachen' });
  await expect(versions.getByRole('link', { name: 'Deutsch' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.getByRole('link', { name: 'Português', exact: true }).first().click();

  await expect(page).toHaveURL(/\/termos$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('sends the internal address of a document to its public one', async ({ request }) => {
  const response = await request.get('/legal/acordo-de-tratamento', { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('https://pyxis-analytics.dev/acordo-de-tratamento');
});
