import { expect, type Page, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { currentNavigationLinks } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const DOCS_ID = '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d';
const DEMO_EXPORT_ID = '5e1b3d7f-9a2c-4e6d-8f1b-3c5d7e9f1a2b';

const PARTS = [
  'Project',
  'Keys',
  'People',
  'E-mail',
  'Export events',
  'Delete project',
  'Account and billing',
  'Sessions',
  'Access tokens',
  'Connected apps',
];

async function openSettingsFrom(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.getByRole('link', { name: 'Settings' }).click();
  const window = page.getByRole('dialog', { name: 'Settings' });
  await expect(window).toBeVisible();
  return window;
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`settings, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation as a page and never scrolls sideways', async ({
      page,
    }) => {
      await page.goto(`/${STORE_ID}/settings/keys`);
      await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });

    test('has no WCAG 2.2 A or AA violation as a window over a screen', async ({
      page,
      isMobile,
    }) => {
      await page.goto(`/${STORE_ID}/devices`);
      const window = await openSettingsFrom(page, isMobile);
      if (isMobile) {
        await window.getByRole('link', { name: 'Project', exact: true }).click();
      }
      await expect(window.getByRole('region', { name: 'Project' })).toBeVisible();

      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens over the screen with its period and filter, and Esc closes it back to them', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/devices?range=7d&country=BR`);

  const window = await openSettingsFrom(page, isMobile);

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings\\?range=7d&country=BR$`));
  await expect(page).toHaveTitle('Project · My site · Pyxis');
  await expect(page.locator('h1', { hasText: 'Devices' })).toBeAttached();
  await window.getByRole('link', { name: 'Keys', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings/keys\\?range=7d&country=BR$`));
  await expect(window.getByRole('region', { name: 'Keys', exact: true })).toBeVisible();
  await expect(window.getByRole('heading', { name: 'Keys', exact: true })).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(window).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/devices\\?range=7d&country=BR$`));
  await expect(
    page.getByRole('navigation', { name: 'Period' }).getByRole('link', { name: '7 days' }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    isMobile
      ? page.getByRole('button', { name: 'Open menu' })
      : page.getByRole('link', { name: 'Settings' }),
  ).toBeFocused();
});

test('keeps the scroll of the screen under the window and after it closes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'a phone opens the window from its menu, at the top of the screen');
  await page.setViewportSize({ width: 1366, height: 650 });
  await page.goto(`/${STORE_ID}/devices`);
  await page.evaluate(() => {
    window.scrollTo(0, 600);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  const scrolled = await page.evaluate(() => window.scrollY);

  const settingsWindow = await openSettingsFrom(page, isMobile);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
  await page.keyboard.press('Escape');

  await expect(settingsWindow).toBeHidden();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
});

test('closes with Back, opens again with Forward, and closes with its button', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview?from=2026-08-01&to=2026-08-31`);
  const window = await openSettingsFrom(page, isMobile);

  await page.goBack();

  await expect(window).toBeHidden();
  await expect(page).toHaveURL(
    new RegExp(`/${STORE_ID}/overview\\?from=2026-08-01&to=2026-08-31$`),
  );
  await expect(page.getByText('Aug 1 – Aug 31, 2026', { exact: true })).toBeVisible();

  await page.goForward();
  await expect(window).toBeVisible();

  await window.getByRole('button', { name: 'Close' }).click();

  await expect(window).toBeHidden();
  await expect(page).toHaveURL(
    new RegExp(`/${STORE_ID}/overview\\?from=2026-08-01&to=2026-08-31$`),
  );
});

test('lists the parts first on a phone, and goes back to the list from a part', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'the list comes first only below the lg breakpoint');
  await page.goto(`/${STORE_ID}/overview`);
  const window = await openSettingsFrom(page, isMobile);
  const parts = window.getByRole('navigation', { name: 'Sections' });

  await expect(parts).toBeVisible();
  await expect(window.getByRole('heading', { name: 'Settings', exact: true })).toBeFocused();
  await parts.getByRole('link', { name: 'People' }).click();

  await expect(parts).toBeHidden();
  await expect(window.getByRole('heading', { name: 'People', exact: true })).toBeVisible();
  await window.getByRole('button', { name: 'Settings' }).click();

  await expect(parts).toBeVisible();
  await expect(parts.getByRole('link', { name: 'People' })).toBeFocused();
});

for (const viewport of [
  { width: 1366, height: 650, windowHeight: 551 },
  { width: 1440, height: 900, windowHeight: 704 },
]) {
  test(`keeps one height in every part at ${String(viewport.width)}×${String(viewport.height)}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'a phone shows the window full screen');
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`/${STORE_ID}/overview`);
    const window = await openSettingsFrom(page, isMobile);
    const heights = new Set<number>();

    for (const part of PARTS) {
      await window.getByRole('link', { name: part, exact: true }).click();
      await expect(window.getByRole('heading', { name: part, exact: true })).toBeFocused();
      const box = await window.boundingBox();
      heights.add(Math.round(box?.height ?? 0));
    }

    expect([...heights]).toEqual([viewport.windowHeight]);
  });
}

test('closes when a link inside it leaves for another page', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/overview`);
  const window = await openSettingsFrom(page, isMobile);
  await window.getByRole('link', { name: 'Export events' }).click();
  const panel = window.getByRole('region', { name: 'Export events' });

  await panel.getByRole('button', { name: 'Export events' }).click();
  await panel.getByRole('link', { name: 'Open the export' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Export' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('is a page when a part is opened directly, and its menu changes parts as pages', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/settings/keys`);

  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Keys', exact: true })).toContainText(
    /pyxis_pk_[0-9a-f]{32}/,
  );
  await expect(page).toHaveTitle('Keys · My site · Pyxis');
  if (isMobile) {
    await page.getByRole('main').getByRole('button', { name: 'Settings' }).click();
  }

  await page
    .getByRole('navigation', { name: 'Sections' })
    .getByRole('link', { name: 'People' })
    .click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings/people$`));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'People' })).toContainText('owner@example.com');
});

test('marks Settings current in the navigation on its page', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/settings`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  await expect(page.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test("shows the person's parts outside a project with only the You group", async ({
  page,
  isMobile,
}) => {
  await page.goto('/account/sessions');

  const parts = page.getByRole('navigation', { name: 'Sections' });
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sessions' })).toContainText('Chrome on Windows');
  if (isMobile) {
    await page.getByRole('main').getByRole('button', { name: 'Settings' }).click();
  }
  await expect(parts.getByRole('link')).toHaveText([
    'Account and billing',
    'Sessions',
    'Access tokens',
    'Connected apps',
  ]);
});

test('shows the origins, a public key and no secret key value for each project', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings`);
  const project = page.getByRole('region', { name: 'Project' });

  await expect(project.getByRole('textbox', { name: 'Origin 1' })).toHaveValue(
    'https://store.example.com',
  );
  await expect(page.getByRole('region', { name: 'Data retention' })).toContainText('13 months');
  await page.goto(`/${STORE_ID}/settings/keys`);
  const keys = page.getByRole('region', { name: 'Keys', exact: true });
  await expect(keys).toContainText(/pyxis_pk_[0-9a-f]{32}/);
  await expect(keys).not.toContainText('pyxis_sk_');

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

  await name.fill('My site BR');
  await project.getByRole('button', { name: 'Add an origin' }).click();
  await project.getByRole('textbox', { name: 'Origin 3' }).fill('shop.example.com');
  await project.getByRole('button', { name: 'Save changes' }).click();

  await expect(project.getByRole('status')).toHaveText('Saved');
});

test('creates a secret key, shows it once, and keeps the only public key', async ({ page }) => {
  await page.goto(`/${DOCS_ID}/settings/keys`);
  const keys = page.getByRole('region', { name: 'Keys', exact: true });

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
  await page.goto(`/${STORE_ID}/settings/delete`);
  const danger = page.getByRole('region', { name: 'Delete project' });
  const confirm = danger.getByRole('textbox', { name: 'Type My site to confirm' });

  await confirm.fill('Demo');
  await danger.getByRole('button', { name: 'Delete project for good' }).click();

  await expect(danger.getByRole('alert')).toHaveText("The name typed is not this project's name.");

  await confirm.fill('My site');
  await danger.getByRole('button', { name: 'Delete project for good' }).click();

  await expect(page).not.toHaveURL(/\/settings\/delete$/);
});

test('lists the people, adds an address with an e-mail and removes a member', async ({ page }) => {
  await page.goto(`/${STORE_ID}/settings/people`);
  const people = page.getByRole('region', { name: 'People' });

  await expect(people).toContainText('owner@example.com (you)');
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
  await page.goto(`/${STORE_ID}/settings/export`);
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

test('marks Settings in the navigation as where an export is', async ({ page, isMobile }) => {
  await page.goto(`/${STORE_ID}/exports/${DEMO_EXPORT_ID}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Export' })).toBeVisible();
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  const current = currentNavigationLinks(page);
  await expect(current).toHaveCount(1);
  await expect(current).toBeVisible();
  await expect(current).toHaveAccessibleName('Settings');
});

test('turns the weekly digest off and on from the e-mail panel, saying when it saved', async ({
  page,
}) => {
  await page.goto(`/${STORE_ID}/settings/email`);
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

  await page.goto(`/${STORE_ID}/settings/email`);

  await expect(
    page.getByRole('region', { name: 'E-mail' }).getByRole('switch', { name: 'Resumo semanal' }),
  ).toBeChecked();
});

test('lists the sessions with this device marked, and ends another one from its row', async ({
  page,
}) => {
  await page.goto('/account/sessions');
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
  await page.goto('/account/sessions');

  await page
    .getByRole('region', { name: 'Sessions' })
    .getByRole('button', { name: 'Sign out everywhere' })
    .click();

  await expect(page).toHaveURL(/\/sign-in$/);
});

test('names the sessions panel in Portuguese', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

  await page.goto('/account/sessions');
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
    await page.goto('/account/tokens');
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
    await page.goto('/account/tokens');
    const tokens = page.getByRole('region', { name: 'Access tokens' });

    await tokens.getByRole('button', { name: 'Create token' }).click();

    await expect(tokens.getByRole('alert')).toHaveText(
      'Give the token a name, so you can tell it apart later.',
    );
    await expect(tokens.getByRole('textbox', { name: 'Name' })).toBeFocused();
  });

  test('revokes a token from its row', async ({ page }) => {
    await page.goto('/account/tokens');
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

    await page.goto('/account/tokens');

    const tokens = page.getByRole('region', { name: 'Tokens de acesso' });
    await expect(tokens.getByRole('button', { name: 'Criar token' })).toBeVisible();
    await expect(tokens.getByRole('listitem').nth(1)).toContainText('Nunca usado');
  });
});

test.describe('connected apps', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  const CONNECTOR_URL = 'https://api.pyxis-analytics.dev/mcp';

  test('lists the connected apps and copies the address to connect Claude', async ({ page }) => {
    await page.goto('/account/apps');
    const apps = page.getByRole('region', { name: 'Connected apps' });
    const list = apps.getByRole('list', { name: 'Connected apps' });
    await expect(list.getByRole('listitem')).toHaveCount(2);
    await expect(list.getByRole('listitem').nth(0)).toContainText('Claude claude.ai');
    await expect(list.getByRole('listitem').nth(1)).toContainText('Claude Code claude.ai');

    const connect = apps.getByRole('group', { name: 'Connect Pyxis to Claude' });
    await connect
      .getByRole('button', { name: 'Copy', description: CONNECTOR_URL, exact: true })
      .click();

    await expect(
      connect.getByRole('button', { name: 'Copied', description: CONNECTOR_URL, exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CONNECTOR_URL);
  });

  test('revokes an app from its row', async ({ page }) => {
    await page.goto('/account/apps');
    const list = page
      .getByRole('region', { name: 'Connected apps' })
      .getByRole('list', { name: 'Connected apps' });

    await list
      .getByRole('listitem')
      .filter({ hasText: 'Claude Code' })
      .getByRole('button', { name: 'Revoke' })
      .click();

    await expect(list.getByRole('listitem').nth(1).getByRole('status')).toHaveText(
      'App disconnected',
    );
  });

  test('speaks Portuguese', async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'pyxis_locale', value: 'pt-BR', url: baseURL ?? '' }]);

    await page.goto('/account/apps');

    const apps = page.getByRole('region', { name: 'Aplicativos conectados' });
    await expect(apps.getByRole('group', { name: 'Conectar o Pyxis ao Claude' })).toBeVisible();
    await expect(apps.getByRole('button', { name: 'Revogar' })).toHaveCount(2);
  });
});
