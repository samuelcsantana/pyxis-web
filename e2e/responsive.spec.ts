import { expect, test } from '@playwright/test';
import { sidewaysOverflow } from './accessibility';

const STORE_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const EXAMPLE_FUNNEL =
  '[{"type":"page","path":"/calculator"},{"type":"event","name":"calculator_result_shown"},{"type":"page","path":"/sign-up"}]';

const PHONE_SIZES = [
  { name: '320×640 portrait', width: 320, height: 640 },
  { name: '844×390 landscape', width: 844, height: 390 },
] as const;

const DEMO_ROUTES = [
  { heading: 'Overview', path: `/${STORE_ID}/overview` },
  {
    heading: 'Funnel',
    path: `/${STORE_ID}/funnel?steps=${encodeURIComponent(EXAMPLE_FUNNEL)}`,
  },
  { heading: 'Features', path: `/${STORE_ID}/features` },
  { heading: 'Requests', path: `/${STORE_ID}/requests` },
  { heading: 'Timeline', path: `/${STORE_ID}/timeline?user=u_7f3a` },
  { heading: 'Visits', path: `/${STORE_ID}/visits` },
  { heading: 'Devices', path: `/${STORE_ID}/devices` },
  { heading: 'Acquisition', path: `/${STORE_ID}/acquisition` },
  { heading: 'Sign in to Pyxis', path: '/sign-in' },
] as const;

for (const size of PHONE_SIZES) {
  test.describe(`at ${size.name}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const route of DEMO_ROUTES) {
      test(`${route.heading} never scrolls sideways once the page has hydrated`, async ({
        page,
      }) => {
        await page.goto(route.path);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
        await page.waitForLoadState('networkidle');

        await expect.poll(() => sidewaysOverflow(page)).toBe(0);
      });
    }
  });
}
