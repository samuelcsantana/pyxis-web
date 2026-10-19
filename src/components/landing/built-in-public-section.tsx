import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { LANDING_LINKS, PROPER_NAMES } from './landing-links';

export interface BuiltInPublicSectionProps {
  readonly i18n: I18n;
}

export const BUILT_IN_PUBLIC_ID = 'built-in-public';

const ITEMS = ['coverage', 'realServices', 'provenance', 'decisions', 'storybook'] as const;
const CHECK_ICON = 'm5 12.5 4.5 4.5L19 7.5';
const OUT_ICON = 'M14 4h6v6 M20 4 11 13 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5';

function Icon({ path, className }: { readonly path: string; readonly className: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BuiltInPublicSection({ i18n }: BuiltInPublicSectionProps) {
  const { t } = i18n;
  const documents = [
    {
      doc: 'storybook',
      name: PROPER_NAMES.storybook,
      note: t('landing.public.storybook'),
      href: LANDING_LINKS.storybook,
    },
    {
      doc: 'api_reference',
      name: t('landing.footer.apiReference'),
      note: t('landing.public.apiReference'),
      href: LANDING_LINKS.apiReference,
    },
    {
      doc: 'playground',
      name: t('landing.footer.playground'),
      note: t('landing.public.playground'),
      href: LANDING_LINKS.playground,
    },
  ];
  return (
    <LandingSection
      id={BUILT_IN_PUBLIC_ID}
      eyebrow={t('landing.public.eyebrow')}
      title={t('landing.public.title')}
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ul className="grid gap-3.5 hyphens-auto wrap-anywhere">
          {ITEMS.map((item) => (
            <li key={item} className={`flex gap-3 text-base leading-relaxed ${REVEAL}`}>
              <Icon path={CHECK_ICON} className="mt-1 shrink-0 text-ok" />
              {t(`landing.public.items.${item}`)}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 hyphens-auto wrap-anywhere">
          {documents.map((document) => (
            <li key={document.href} className={`flex ${REVEAL}`}>
              <a
                href={document.href}
                {...trackAttributes(LANDING_EVENTS.docsOpened, { doc: document.doc })}
                className={`flex grow items-center justify-between gap-3 rounded-card border border-line bg-card px-4 py-3.5 hover:border-muted active:bg-soft ${FOCUS_RING} ${CONTROL_TRANSITION}`}
              >
                <span className="flex flex-col">
                  <span className="text-base font-semibold">{document.name}</span>
                  <span className="text-sm text-muted">{document.note}</span>
                </span>
                <Icon path={OUT_ICON} className="shrink-0 text-muted" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
