import { LANDING_HOST } from './site';

const PREVIEW_ENVIRONMENT = 'preview';

function previewHosts(): readonly string[] {
  if (process.env.VERCEL_ENV !== PREVIEW_ENVIRONMENT) {
    return [];
  }
  return [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(
    (host): host is string => host !== undefined && host !== '',
  );
}

export function isLandingHostname(hostname: string | undefined): boolean {
  if (hostname === undefined) {
    return false;
  }
  return hostname === LANDING_HOST || previewHosts().includes(hostname);
}
