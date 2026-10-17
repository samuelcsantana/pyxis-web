import { expect, type Locator, type Page } from '@playwright/test';

export function languageTrigger(page: Page, label: string): Locator {
  return page.locator('summary', { hasText: `${label}:` });
}

async function pressWhereItIs(page: Page, target: Locator): Promise<void> {
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  if (box === null) {
    throw new Error('the language select is not on the screen');
  }
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

export async function chooseLanguage(page: Page, label: string, language: string): Promise<void> {
  const trigger = languageTrigger(page, label);
  const option = page
    .getByRole('list', { name: label, exact: true })
    .getByText(language, { exact: true });
  await expect(async () => {
    if (!(await option.isVisible())) {
      await pressWhereItIs(page, trigger);
    }
    await expect(option).toBeVisible({ timeout: 500 });
  }).toPass();
  await pressWhereItIs(page, option);
}
