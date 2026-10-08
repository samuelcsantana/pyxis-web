import { expect, type Page, test } from '@playwright/test';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const SCREENS = [
  { heading: 'Overview', path: `/${STORE_ID}/overview` },
  { heading: 'Features', path: `/${STORE_ID}/features` },
  { heading: 'Visits', path: `/${STORE_ID}/visits` },
  { heading: 'Sign in to Pyxis', path: '/sign-in' },
] as const;

function movingElements(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const seconds = (durations: string) =>
      Math.max(...durations.split(',').map((duration) => Number.parseFloat(duration)));
    const describe = (element: Element) =>
      `${element.tagName.toLowerCase()}.${element.getAttribute('class') ?? ''}`;
    return [...document.querySelectorAll('*')]
      .filter((element) => {
        const style = getComputedStyle(element);
        const transitions =
          style.transitionProperty !== 'none' && seconds(style.transitionDuration) > 0;
        const animations = style.animationName !== 'none' && seconds(style.animationDuration) > 0;
        return transitions || animations;
      })
      .map(describe);
  });
}

test.use({ reducedMotion: 'reduce' });

for (const screen of SCREENS) {
  test(`${screen.heading} moves nothing when the system asks for reduced motion`, async ({
    page,
  }) => {
    await page.goto(screen.path);
    await expect(page.getByRole('heading', { level: 1, name: screen.heading })).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(await movingElements(page)).toEqual([]);
  });
}
