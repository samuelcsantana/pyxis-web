import { defineConfig, devices } from '@playwright/test';

const PORT = 3101;
const BASE_URL = `http://localhost:${String(PORT)}`;
const isCi = process.env.CI !== undefined;
const LANDING_SPECS = /landing.*\.spec\.ts/;
const LANDING_HOST = '127.0.0.1';
const ON_THE_MAIN_DOMAIN = { baseURL: `http://${LANDING_HOST}:${String(PORT)}` };
const DESKTOP = { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } };
const MOBILE = { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } };
const NAVIGATOR_WEBDRIVER_OFF = '--disable-blink-features=AutomationControlled';

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
    launchOptions: { args: [NAVIGATOR_WEBDRIVER_OFF] },
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
      EXCHANGE_RATES_URL: `${BASE_URL}/no-exchange-rates`,
      NEXT_TELEMETRY_DISABLED: '1',
      VERCEL_ENV: 'preview',
      VERCEL_BRANCH_URL: LANDING_HOST,
      SELLER_NAME: 'Ana Exemplo',
      SELLER_TAX_ID: '000.000.000-00',
      SELLER_ADDRESS: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
      TERMS_EFFECTIVE_DATE: '2026-10-20',
    },
  },
});
