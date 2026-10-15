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
    page.getByText('Versão 1.1, vigente a partir de 20 de outubro de 2026.'),
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

test('links the contract from the home page footer, marked as Portuguese', async ({ page }) => {
  await page.goto('/');

  const footer = page.getByRole('contentinfo');
  await expect(footer.getByText('In Portuguese, the language of the contract.')).toBeVisible();
  await expect(footer.getByText(/^Sold by Ana Exemplo · CPF 000\.000\.000-00/)).toBeVisible();

  await footer.getByRole('link', { name: 'Terms of Use' }).click();

  await expect(page).toHaveURL(/\/termos$/);
});

test('sends the internal address of a document to its public one', async ({ request }) => {
  const response = await request.get('/legal/acordo-de-tratamento', { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('https://pyxis-analytics.dev/acordo-de-tratamento');
});
