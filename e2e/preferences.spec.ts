import { expect, test } from '@playwright/test';
import { chooseLanguage } from './language-select';

const STORE_OVERVIEW = '/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview';

test('takes the language and the theme a link brought, then shows the clean address', async ({
  page,
  context,
}) => {
  await page.goto(`${STORE_OVERVIEW}?range=7d&lang=pt-BR&theme=dark`);

  await expect(page).toHaveURL(new RegExp(`${STORE_OVERVIEW}\\?range=7d$`));
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === 'pyxis_locale')?.value).toBe('pt-BR');
  expect(cookies.find((cookie) => cookie.name === 'pyxis_theme')?.value).toBe('dark');
});

test('leads back to the home page in the language chosen on the sign-in page', async ({ page }) => {
  await page.goto('/sign-in');
  const home = page.getByRole('banner').getByRole('link', { name: 'Pyxis' });
  await expect(home).toHaveAttribute('href', 'https://pyxis-analytics.dev/');

  await chooseLanguage(page, 'Language', 'Português (Brasil)');

  await expect(home).toHaveAttribute('href', 'https://pyxis-analytics.dev/pt-br');
  await page.getByRole('button', { name: /tema|theme/i }).click();
  await expect(home).toHaveAttribute(
    'href',
    /^https:\/\/pyxis-analytics\.dev\/pt-br\?theme=(dark|light)$/,
  );
});
