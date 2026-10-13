export const LANDING_EVENTS = {
  demoOpened: 'demo_opened',
  codeOpened: 'code_opened',
  docsOpened: 'docs_opened',
  postOpened: 'post_opened',
  siteOpened: 'site_opened',
  snippetCopied: 'snippet_copied',
  languageSwitched: 'language_switched',
} as const;

export type LandingEvent = (typeof LANDING_EVENTS)[keyof typeof LANDING_EVENTS];

export function trackAttributes(
  event: LandingEvent,
  properties: Readonly<Record<string, string>> = {},
): Readonly<Record<string, string>> {
  return {
    'data-track': event,
    ...Object.fromEntries(
      Object.entries(properties).map(([key, value]) => [`data-track-${key}`, value]),
    ),
  };
}
