import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';
import { currentNavigationLinks } from './navigation';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const INSTALL_PATH = `/${STORE_ID}/install`;
const HOSTED_API = 'https://api.pyxis-analytics.dev';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`install, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation on any tab and never scrolls sideways', async ({
      page,
    }) => {
      await page.goto(INSTALL_PATH);
      await expect(page.getByRole('tab', { name: 'Yourself' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('tab', { name: 'With an AI agent' }).click();
      await expect(page.getByRole('tabpanel', { name: 'With an AI agent' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('tab', { name: 'Google Tag Manager' }).click();
      await expect(page.getByRole('tabpanel', { name: 'Google Tag Manager' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('tab', { name: 'Shopify' }).click();
      await expect(page.getByRole('tabpanel', { name: 'Shopify' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);

      await page.getByRole('tab', { name: 'WordPress' }).click();
      await expect(page.getByRole('tabpanel', { name: 'WordPress' })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  });
}

test('opens the install guide from the navigation over the screen, without the pending tag once events arrive', async ({
  page,
  isMobile,
}) => {
  await page.goto(`/${STORE_ID}/overview`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  const install = page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Install' });
  await expect(install).not.toContainText('Pending');

  await install.click();

  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/overview#settings/install$`));
  await expect(
    page.getByRole('dialog', { name: 'Settings' }).getByText('1. Install Pyxis on your site'),
  ).toBeVisible();
  await expect(currentNavigationLinks(page)).toHaveAccessibleName('Overview');
});

test("hands the agent a request with the project's key, the API and the site", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  await page.getByRole('tab', { name: 'With an AI agent' }).click();

  const agent = page.getByRole('tabpanel', { name: 'With an AI agent' });
  const prompt = page.locator('#install-agent-prompt');
  await expect(prompt).toContainText(/The project’s public key is pyxis_pk_\w+/);
  await expect(prompt).toContainText(`the endpoint is ${HOSTED_API}`);
  await expect(prompt).toContainText('the site is at https://store.example.com');
  await expect(prompt).toContainText('for me to review.');
  await expect(page.getByRole('tabpanel', { name: 'Yourself' })).toBeHidden();
  await agent.getByRole('button', { name: 'Copy' }).click();
  await expect(agent.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    await prompt.textContent(),
  );
});

test('moves between the five ways to install with the arrow keys', async ({ page }) => {
  await page.goto(INSTALL_PATH);
  const yourself = page.getByRole('tab', { name: 'Yourself' });
  const withAgent = page.getByRole('tab', { name: 'With an AI agent' });
  const withTagManager = page.getByRole('tab', { name: 'Google Tag Manager' });
  const withShopify = page.getByRole('tab', { name: 'Shopify' });
  const withWordPress = page.getByRole('tab', { name: 'WordPress' });

  await yourself.focus();
  await page.keyboard.press('ArrowRight');

  await expect(withAgent).toBeFocused();
  await expect(withAgent).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'With an AI agent' })).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(withTagManager).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Google Tag Manager' })).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(withShopify).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Shopify' })).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(withWordPress).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'WordPress' })).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(yourself).toBeFocused();
  await expect(page.getByText('npm install pyxis-analytics')).toBeVisible();
});

test("walks a site with Google Tag Manager through the template with the project's key", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  await page.getByRole('tab', { name: 'Google Tag Manager' }).click();

  const tagManager = page.getByRole('tabpanel', { name: 'Google Tag Manager' });
  await expect(page.getByRole('tabpanel', { name: 'Yourself' })).toBeHidden();
  await expect(tagManager.getByRole('listitem')).toHaveCount(5);
  await expect(tagManager.getByRole('link', { name: 'template.tpl' })).toHaveAttribute(
    'href',
    'https://github.com/samuelcsantana/pyxis-gtm-template/blob/main/template.tpl',
  );
  await expect(tagManager).toContainText('Initialization - All Pages');
  await expect(tagManager).toContainText(`The Endpoint field must hold ${HOSTED_API}.`);
  const key = page.locator('#install-tag-manager-key');
  await expect(key).toHaveText(/^pyxis_pk_\w+$/);
  await tagManager.getByRole('button', { name: 'Copy' }).click();
  await expect(tagManager.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await key.textContent());
});

test("walks a Shopify store through its theme with the project's snippet", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  await page.getByRole('tab', { name: 'Shopify' }).click();

  const shopify = page.getByRole('tabpanel', { name: 'Shopify' });
  await expect(page.getByRole('tabpanel', { name: 'Yourself' })).toBeHidden();
  await expect(shopify.getByRole('listitem')).toHaveCount(4);
  await expect(shopify).toContainText('Open layout/theme.liquid, paste this snippet just before');
  await expect(shopify.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'href',
    `/${STORE_ID}/settings`,
  );
  const snippet = page.locator('#install-shopify-script');
  await expect(snippet).toContainText(`endpoint: '${HOSTED_API}'`);
  await shopify.getByRole('button', { name: 'Copy' }).click();
  await expect(shopify.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^<script type="module">\s+import \{ init \} from 'https:\/\/cdn\.jsdelivr\.net\/npm\/pyxis-analytics@[\d.]+\/dist\/index\.js';\s+init\(\{ key: 'pyxis_pk_\w+', endpoint: 'https:\/\/api\.pyxis-analytics\.dev' \}\);\s+<\/script>$/,
  );
});

test("walks a WordPress site through a header plugin with the project's classic snippet", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  await page.getByRole('tab', { name: 'WordPress' }).click();

  const wordPress = page.getByRole('tabpanel', { name: 'WordPress' });
  await expect(page.getByRole('tabpanel', { name: 'Yourself' })).toBeHidden();
  await expect(wordPress.getByRole('listitem')).toHaveCount(4);
  await expect(wordPress.getByRole('link', { name: 'WPCode' })).toHaveAttribute(
    'href',
    'https://wordpress.org/plugins/insert-headers-and-footers/',
  );
  await expect(wordPress.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'href',
    `/${STORE_ID}/settings`,
  );
  await wordPress.getByRole('button', { name: 'Copy' }).click();
  await expect(wordPress.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/pyxis-analytics@[\d.]+\/dist\/pyxis\.global\.js"><\/script>\s+<script>\s+pyxis\.init\(\{ key: 'pyxis_pk_\w+', endpoint: 'https:\/\/api\.pyxis-analytics\.dev' \}\);\s+<\/script>$/,
  );
});

test('copies the automatic events from the npm package, off until switched on', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  const first = page.getByRole('region', { name: '1. Install Pyxis on your site' });
  await expect(first.getByRole('heading', { name: 'Automatic events (optional)' })).toBeVisible();
  const snippet = first.locator('div:has(> #install-auto-events)');
  await snippet.getByRole('button', { name: 'Copy' }).click();
  await expect(snippet.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^import \{ autoEvents \} from 'pyxis-analytics\/auto';\s+autoEvents\(\{ outboundLinks: true, fileDownloads: true, formSubmits: true \}\);$/,
  );
});

test('offers a question for Claude once the first event arrived, and the way to connect it', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(INSTALL_PATH);

  const second = page.getByRole('region', { name: '2. Open a page of your site' });
  await expect(second.getByRole('status')).toHaveText('The first event arrived.');
  await expect(second).toContainText('Already connected Claude? Ask it:');
  await second.getByRole('button', { name: 'Copy' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^How many visits did .+ get today, and where did they come from\?$/,
  );

  const third = page.getByRole('region', { name: '3. Check with Claude (optional)' });
  await expect(third.locator('#install-claude-code')).toHaveText(
    `claude mcp add --transport http pyxis ${HOSTED_API}/mcp`,
  );
  await third.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL(new RegExp(`/${STORE_ID}/settings#settings-connections-heading$`));
});

test('tells a phone that installing happens on a computer and copies this address', async ({
  page,
  context,
  browserName,
  isMobile,
}) => {
  await page.goto(INSTALL_PATH);
  const notice = page.getByRole('group', { name: 'Installing happens on a computer' });

  if (!isMobile) {
    await expect(notice).toBeHidden();
    return;
  }
  test.skip(browserName !== 'chromium', 'clipboard permissions are a Chromium feature');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await expect(notice).toBeVisible();
  await expect(notice).toContainText(page.url());
  await notice.getByRole('button', { name: 'Copy the address' }).click();
  await expect(notice.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
});
