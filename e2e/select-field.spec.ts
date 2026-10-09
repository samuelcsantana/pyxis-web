import { expect, type Locator, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

async function openVisitFilters(page: Page, isMobile: boolean): Promise<void> {
  await page.goto(`/${STORE_ID}/visits`);
  if (isMobile) {
    await page.getByRole('button', { name: 'Filters' }).click();
  }
}

function backgroundOf(locator: Locator): Promise<string> {
  return locator.evaluate((element) => getComputedStyle(element).backgroundColor);
}

function pickerBackgroundOf(select: Locator): Promise<string> {
  return select.evaluate(
    (element) => getComputedStyle(element, '::picker(select)').backgroundColor,
  );
}

function tokenColor(page: Page, token: string): Promise<string> {
  return page.evaluate((name) => {
    const probe = document.createElement('span');
    probe.style.backgroundColor = `var(${name})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }, token);
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`the channel list, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('opens on the surface of a card, with the hovered channel on the soft color', async ({
      page,
      isMobile,
    }) => {
      await openVisitFilters(page, isMobile);
      const channel = page.getByRole('combobox', { name: 'Channel' });
      await expect(channel).toHaveCSS('appearance', 'base-select');

      await channel.click();
      const paid = page.getByRole('option', { name: 'Paid' });
      await expect(paid).toBeVisible();
      await paid.hover();

      expect(await pickerBackgroundOf(channel)).toBe(await tokenColor(page, '--color-card'));
      expect(await backgroundOf(paid)).toBe(await tokenColor(page, '--color-soft'));
      await expect(page.locator('.select-chevron').first()).toHaveCSS('rotate', '180deg');
    });
  });
}

test('chooses a channel from the list, which then closes', async ({ page, isMobile }) => {
  await openVisitFilters(page, isMobile);
  const channel = page.getByRole('combobox', { name: 'Channel' });

  await channel.click();
  await page.getByRole('option', { name: 'Paid' }).click();

  await expect(channel).toHaveValue('paid');
  await expect(page.getByRole('option', { name: 'Paid' })).toBeHidden();
});

test('moves through the channels with the keyboard', async ({ page, isMobile }) => {
  await openVisitFilters(page, isMobile);
  const channel = page.getByRole('combobox', { name: 'Channel' });

  await channel.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(channel).toHaveValue('paid');
});
