import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`settings, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation and never scrolls sideways', async ({ page }) => {
      await page.goto(`/${STORE_ID}/settings`);
      await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens from the navigation and marks it current', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  await page.getByRole('link', { name: 'Settings' }).click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  await expect(page).toHaveTitle('Settings · Demo Store · Pyxis');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await expect(page.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('shows the origins, a public key and no secret key value for each project', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);

  await expect(page.getByRole('region', { name: 'Allowed origins' })).toContainText(
    'https://store.example.com',
  );
  const keys = page.getByRole('region', { name: 'Keys' });
  await expect(keys).toContainText(/pyxis_pk_[0-9a-f]{32}/);
  await expect(keys).not.toContainText('pyxis_sk_');
  await expect(page.getByRole('region', { name: 'Data retention' })).toContainText('13 months');

  await page.goto(`/${DOCS_ID}/settings`);

  await expect(page.getByRole('region', { name: 'Allowed origins' })).toContainText(
    'https://docs.example.com',
  );
});

test('turns the weekly digest off and on from the e-mail panel, saying when it saved', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);
  const email = page.getByRole('region', { name: 'E-mail' });
  const toggle = email.getByRole('switch', { name: 'Weekly digest' });

  await expect(toggle).toBeChecked();
  await expect(email).toContainText('the week that closed on Sunday in');

  await toggle.click();

  await expect(toggle).not.toBeChecked();
  await expect(email.getByText('Saved')).toBeVisible();
  await expect(email.getByRole('alert')).toHaveCount(0);

  await toggle.press('Space');

  await expect(toggle).toBeChecked();
});

test('names the switch in Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto(`/${STORE_ID}/settings`);

  await expect(
    page.getByRole('region', { name: 'E-mail' }).getByRole('switch', { name: 'Resumo semanal' }),
  ).toBeChecked();
});

test('lists the sessions with this device marked, and ends another one from its row', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);
  const sessions = page.getByRole('region', { name: 'Sessions' });
  const rows = sessions.getByRole('listitem');

  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText('Chrome on Windows');
  await expect(rows.nth(0)).toContainText('This device');
  await expect(rows.nth(1)).toContainText('Safari on iOS');
  await expect(rows.nth(2)).toContainText('Unknown browser');

  await rows.nth(1).getByRole('button', { name: 'End' }).click();

  await expect(rows.nth(1).getByRole('status')).toHaveText('Session ended');
  await expect(sessions.getByRole('alert')).toHaveCount(0);
});

test('signs out everywhere from the sessions panel, to the sign-in page', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings`);

  await page
    .getByRole('region', { name: 'Sessions' })
    .getByRole('button', { name: 'Sign out everywhere' })
    .click();

  await expect(page).toHaveURL(/\/sign-in$/);
});

test('names the sessions panel in Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto(`/${STORE_ID}/settings`);
  const sessions = page.getByRole('region', { name: 'Sessões' });

  await expect(sessions).toContainText('Este dispositivo');
  await expect(sessions.getByRole('button', { name: 'Encerrar' })).toHaveCount(3);
  await expect(
    sessions.getByRole('button', { name: 'Sair de todos os dispositivos' }),
  ).toBeVisible();
});
