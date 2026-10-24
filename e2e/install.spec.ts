import { expect, test } from '@playwright/test';
import { axeViolations, sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const INSTALL_PATH = `/${STORE_ID}/install`;
const HOSTED_API = 'https://api.pyxis-analytics.dev';

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`install, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('has no WCAG 2.2 A or AA violation on either tab and never scrolls sideways', async ({
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
    });
  });
}

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

test('moves between the two ways to install with the arrow keys', async ({ page }) => {
  await page.goto(INSTALL_PATH);
  const yourself = page.getByRole('tab', { name: 'Yourself' });
  const withAgent = page.getByRole('tab', { name: 'With an AI agent' });

  await yourself.focus();
  await page.keyboard.press('ArrowRight');

  await expect(withAgent).toBeFocused();
  await expect(withAgent).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'With an AI agent' })).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(yourself).toBeFocused();
  await expect(page.getByText('npm install pyxis-analytics')).toBeVisible();
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
