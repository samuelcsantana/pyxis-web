export const APP_NAME = 'Pyxis';
export const TITLE_TEMPLATE = `%s · ${APP_NAME}`;

export function brandedTitle(title: string): string {
  return TITLE_TEMPLATE.replace('%s', title);
}
export const LIVE_DEMO_URL = 'https://demo.pyxis-analytics.dev';
export const DASHBOARD_URL = 'https://app.pyxis-analytics.dev';
export const LANDING_HOST = 'pyxis-analytics.dev';
export const LANDING_ORIGIN = `https://${LANDING_HOST}`;
export const APP_DESCRIPTION =
  'Privacy-first product analytics: no cookies on your visitors, no personal data, no third parties.';
