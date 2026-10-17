import { LANDING_PAGES, type LandingPage } from '@/lib/landing-pages';
import { jsonForScript } from './landing-structured-data';

export interface LanguagePrefetchProps {
  readonly current: LandingPage;
  readonly nonce: string | undefined;
}

export function languagePrefetchRulesOf(current: LandingPage) {
  return {
    prefetch: [
      {
        urls: LANDING_PAGES.filter((page) => page.locale !== current.locale).map(
          (page) => page.path,
        ),
        eagerness: 'immediate',
      },
    ],
  } as const;
}

export function LanguagePrefetch({ current, nonce }: LanguagePrefetchProps) {
  return (
    <script
      type="speculationrules"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: jsonForScript(languagePrefetchRulesOf(current)) }}
    />
  );
}
