import { defineConfig, devices } from '@playwright/test';

const PORT = 3101;
const BASE_URL = `http://localhost:${String(PORT)}`;
const isCi = process.env.CI !== undefined;
const LANDING_SPECS = /landing.*\.spec\.ts/;
const ON_THE_MAIN_DOMAIN = { extraHTTPHeaders: { 'x-forwarded-host': 'pyxis-analytics.dev' } };
const DESKTOP = { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } };
const MOBILE = { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } };

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'en-US',
  },
  projects: [
    { name: 'desktop', testIgnore: LANDING_SPECS, use: DESKTOP },
    { name: 'mobile', testIgnore: LANDING_SPECS, use: MOBILE },
    {
      name: 'landing-desktop',
      testMatch: LANDING_SPECS,
      use: { ...DESKTOP, ...ON_THE_MAIN_DOMAIN },
    },
    { name: 'landing-mobile', testMatch: LANDING_SPECS, use: { ...MOBILE, ...ON_THE_MAIN_DOMAIN } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${String(PORT)}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_PYXIS_API_URL: '',
      NEXT_PUBLIC_LANDING_PYXIS_KEY: 'pyxis_pk_e2e_local',
      NEXT_PUBLIC_LANDING_PYXIS_ENDPOINT: BASE_URL,
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});
