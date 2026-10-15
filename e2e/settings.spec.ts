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
  const project = page.getByRole('region', { name: 'Project' });

  await expect(project.getByRole('textbox', { name: 'Origin 1' })).toHaveValue(
    'https://store.example.com',
  );
  const keys = page.getByRole('region', { name: 'Keys' });
  await expect(keys).toContainText(/pyxis_pk_[0-9a-f]{32}/);
  await expect(keys).not.toContainText('pyxis_sk_');
  await expect(page.getByRole('region', { name: 'Data retention' })).toContainText('13 months');

  await page.goto(`/${DOCS_ID}/settings`);

  await expect(
    page.getByRole('region', { name: 'Project' }).getByRole('textbox', { name: 'Origin 1' }),
  ).toHaveValue('https://docs.example.com');
});

test('lets the owner change the project, with each problem named under its field', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);
  const project = page.getByRole('region', { name: 'Project' });
  const name = project.getByRole('textbox', { name: 'Name' });

  await name.fill('');
  await project.getByRole('button', { name: 'Save changes' }).click();

  await expect(name).toBeFocused();
  await expect(project.getByRole('alert')).toHaveText('Give the project a name.');

  await name.fill('Demo Store BR');
  await project.getByRole('button', { name: 'Add an origin' }).click();
  await project.getByRole('textbox', { name: 'Origin 3' }).fill('shop.example.com');
  await project.getByRole('button', { name: 'Save changes' }).click();

  await expect(project.getByRole('status')).toHaveText('Saved');
});

test('creates a secret key, shows it once, and keeps the only public key', async ({ page }) => {
  await page.goto(`/${DOCS_ID}/settings`);
  const keys = page.getByRole('region', { name: 'Keys' });

  await expect(keys).toContainText('The only public key stays');
  await keys.getByRole('button', { name: 'New secret key' }).click();

  const reveal = keys.getByRole('group', { name: 'Copy the secret key now' });
  await expect(reveal).toContainText('pyxis_sk_');
  await expect(keys.getByRole('heading', { name: 'Copy the secret key now' })).toBeFocused();
  expect(await axeViolations(page)).toEqual([]);

  await reveal.getByRole('button', { name: 'Done' }).click();

  await expect(keys).not.toContainText('pyxis_sk_');
});

test('deletes a project only with its name typed, then leaves its settings', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings`);
  const danger = page.getByRole('region', { name: 'Delete project' });
  const confirm = danger.getByRole('textbox', { name: 'Type Demo Store to confirm' });

  await confirm.fill('Demo');
  await danger.getByRole('button', { name: 'Delete project for good' }).click();

  await expect(danger.getByRole('alert')).toHaveText("The name typed is not this project's name.");

  await confirm.fill('Demo Store');
  await danger.getByRole('button', { name: 'Delete project for good' }).click();

  await expect(page).not.toHaveURL(/\/settings$/);
});

test('lists the people, adds an address with an e-mail and removes a member', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings`);
  const people = page.getByRole('region', { name: 'People' });

  await expect(people).toContainText('owner@demo-store.example (you)');
  await people.getByRole('button', { name: 'Add person' }).click();
  await expect(people.getByRole('alert')).toHaveText(
    'Write the e-mail address of the person to add.',
  );

  await people.getByRole('textbox', { name: 'E-mail address' }).fill('ana@example.com');
  await people.getByRole('button', { name: 'Add person' }).click();
  await expect(people.getByRole('status')).toHaveText(
    'ana@example.com was added and got an e-mail with how to sign in.',
  );

  await people.getByRole('button', { name: 'Remove' }).click();
  await expect(people.getByText('Removed')).toBeVisible();
});

test('asks for an export, opens it and downloads the file', async ({ page, request }) => {
  await page.goto(`/${STORE_ID}/settings`);
  const panel = page.getByRole('region', { name: 'Export events' });

  await panel.getByRole('button', { name: 'Export events' }).click();
  await expect(panel.getByRole('status')).toContainText('The file is being prepared.');
  await panel.getByRole('link', { name: 'Open the export' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Export' })).toBeVisible();
  await expect(page.getByText(/12,480 events, ready until/)).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
  const href = await page.getByRole('link', { name: 'Download the file' }).getAttribute('href');
  const file = await request.get(href ?? '');

  expect(file.ok()).toBe(true);
  expect(await file.text()).toMatch(/^id,occurred_at,name,path,/);
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

test.describe('access tokens', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('creates a token, shows it once with a copy button, then offers the form again', async ({
    page,
  }) => {
    await page.goto(`/${STORE_ID}/settings`);
    const tokens = page.getByRole('region', { name: 'Access tokens' });
    await expect(tokens.getByRole('listitem')).toHaveCount(2);
    await expect(tokens.getByRole('listitem').nth(1)).toContainText('Never used');

    await tokens.getByRole('textbox', { name: 'Name' }).fill('Claude Code');
    await tokens.getByRole('combobox', { name: 'Expires in' }).selectOption('30');
    await tokens.getByRole('button', { name: 'Create token' }).click();

    const reveal = tokens.getByRole('group', { name: 'Copy your new token now' });
    await expect(reveal).toContainText(/pyxis_at_[A-Za-z0-9]{32}/);
    await expect(page.getByRole('heading', { name: 'Copy your new token now' })).toBeFocused();
    expect(await axeViolations(page)).toEqual([]);
    expect(await sidewaysOverflow(page)).toBe(0);

    await reveal.getByRole('button', { name: 'Copy' }).click();

    await expect(reveal.getByRole('button', { name: 'Copied' })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
      /^pyxis_at_[A-Za-z0-9]{32}$/,
    );

    await reveal.getByRole('button', { name: 'Done' }).click();

    await expect(tokens.getByRole('textbox', { name: 'Name' })).toHaveValue('');
  });

  test('asks for a name under the field before calling anything', async ({ page }) => {
    await page.goto(`/${STORE_ID}/settings`);
    const tokens = page.getByRole('region', { name: 'Access tokens' });

    await tokens.getByRole('button', { name: 'Create token' }).click();

    await expect(tokens.getByRole('alert')).toHaveText(
      'Give the token a name, so you can tell it apart later.',
    );
    await expect(tokens.getByRole('textbox', { name: 'Name' })).toBeFocused();
  });

  test('revokes a token from its row', async ({ page }) => {
    await page.goto(`/${STORE_ID}/settings`);
    const tokens = page.getByRole('region', { name: 'Access tokens' });

    await tokens
      .getByRole('listitem')
      .filter({ hasText: 'Claude Code' })
      .getByRole('button', { name: 'Revoke' })
      .click();

    await expect(tokens.getByRole('listitem').nth(0).getByRole('status')).toHaveText(
      'Token revoked',
    );
    await expect(tokens.getByRole('alert')).toHaveCount(0);
  });

  test('speaks Portuguese', async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

    await page.goto(`/${STORE_ID}/settings`);

    const tokens = page.getByRole('region', { name: 'Tokens de acesso' });
    await expect(tokens.getByRole('button', { name: 'Criar token' })).toBeVisible();
    await expect(tokens.getByRole('listitem').nth(1)).toContainText('Nunca usado');
  });
});
