import { LANDING_LINKS } from '@/components/landing/landing-links';
import { LANDING_ORIGIN } from './site';

export const LLMS_TEXT_CONTENT_TYPE = 'text/plain; charset=utf-8';

const HOSTED_API_URL = 'https://api.pyxis-analytics.dev';
const INTRODUCTION_POST =
  'https://www.samuelsantana.dev/en/blog/pyxis-analytics-without-cookies-ip-or-personal-data';
const RUNBOOK = `${LANDING_LINKS.api}/blob/main/docs/RUNBOOK.md`;

export function llmsText(): string {
  return [
    '# Pyxis',
    '',
    '> Privacy-first product analytics. A browser tracker and an API record page views, named',
    '> events and the results of a site’s own API calls without cookies, IP addresses or',
    '> personal data; a dashboard shows overview, funnels, visits, features, requests,',
    '> acquisition and devices. Open source under the MIT license.',
    '',
    'Pyxis stores no cookie, no IP address, no user agent and no city. URLs are reduced to path',
    'templates and lose their query strings, except utm_source, utm_medium and utm_campaign.',
    'Global Privacy Control and Do Not Track switch the tracker off. The hosted API keeps its data',
    'in São Paulo, Brazil, for 13 months.',
    '',
    '## Install the tracker',
    '',
    `- [pyxis-analytics on npm](${LANDING_LINKS.npm}): \`npm install pyxis-analytics\`, zero`,
    '  dependencies, under 5 KB gzipped, ES module with types.',
    "- Call `init({ key: 'pyxis_pk_…', endpoint })` once in the browser; every page and every",
    '  History API route change becomes a `page_view`. Without a key every function is a no-op.',
    `- The hosted endpoint is ${HOSTED_API_URL}. Keys are issued by whoever runs`,
    '  the API: there is no public sign-up today.',
    `  Anyone can [run their own](${RUNBOOK}).`,
    `- [SDK README](${LANDING_LINKS.sdk}#readme): \`track\`, \`identify\`, \`reset\`,`,
    '  `trackRequest`, `optOut`, `optIn`, `trackingStatus` and every option.',
    `- [Playground](${LANDING_LINKS.playground}): the real tracker in dry-run mode.`,
    '',
    '## Rules an integration must follow',
    '',
    '- Never send personal data in events: no names, e-mails, phone numbers, tax ids or text',
    '  typed by visitors. The server drops values that look like them, as a second barrier.',
    '- Event names: lowercase letters, digits and underscores, starting with a letter, up to 64',
    '  characters; `page_view`, `identify` and `api_request` are reserved.',
    '- Up to 10 properties per event; keys of up to 40 lowercase letters, digits or underscores;',
    '  values are strings of up to 100 characters, numbers or booleans, never nested.',
    '- `identify(userId)` takes the site’s internal account id, never an e-mail; call it on',
    '  every load of the signed-in area and `reset()` on sign-out.',
    "- Paths with readable slugs need `pathRules` (`'/blog/:slug'`) to group into one page;",
    '  numbers, UUIDs and e-mails become `:id` on their own.',
    '- If the site has a Content-Security-Policy, add the API endpoint to `connect-src`.',
    '',
    '## API and dashboard',
    '',
    `- [API reference](${LANDING_LINKS.apiReference}): the OpenAPI 3.1 document of ingestion,`,
    '  dashboard queries, erasure and export.',
    `- [pyxis-api](${LANDING_LINKS.api}): NestJS on AWS Lambda behind CloudFront, PostgreSQL,`,
    '  Terraform.',
    `- [pyxis-web](${LANDING_LINKS.web}): the dashboard, Next.js.`,
    `- [Live demo](${LANDING_LINKS.demo}): the dashboard with invented data, no sign-in.`,
    '',
    '## Optional',
    '',
    `- [Home page](${LANDING_ORIGIN})`,
    `- [Why Pyxis exists](${INTRODUCTION_POST})`,
    '',
  ].join('\n');
}
