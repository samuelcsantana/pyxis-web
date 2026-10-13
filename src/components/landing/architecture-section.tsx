import type { I18n } from '@/i18n/i18n';
import { LandingSection } from './landing-section';

export interface ArchitectureSectionProps {
  readonly i18n: I18n;
}

export const ARCHITECTURE_ID = 'architecture';

const FLOW = ['site', 'edge', 'api', 'database'] as const;
const BESIDE = ['dashboard', 'retention', 'digest'] as const;

export function ArchitectureSection({ i18n }: ArchitectureSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={ARCHITECTURE_ID}
      eyebrow={t('landing.architecture.eyebrow')}
      title={t('landing.architecture.title')}
    >
      <ol className="grid gap-2.5 lg:grid-cols-4 lg:gap-7">
        {FLOW.map((part, index) => (
          <li
            key={part}
            className="relative flex flex-col gap-1 rounded-card border border-line-strong bg-card px-4 py-3.5"
          >
            <span className="text-base font-semibold">
              {t(`landing.architecture.${part}.name`)}
            </span>
            <span className="text-sm text-muted">{t(`landing.architecture.${part}.note`)}</span>
            {index < FLOW.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-1/2 -right-5.5 hidden -translate-y-1/2 text-muted lg:block"
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <ul className="mt-3 grid gap-2.5 md:grid-cols-3">
        {BESIDE.map((part) => (
          <li
            key={part}
            className="flex flex-col rounded-card border border-dashed border-line-strong px-4 py-3"
          >
            <span className="text-sm font-semibold">{t(`landing.architecture.${part}.name`)}</span>
            <span className="text-sm text-muted">{t(`landing.architecture.${part}.note`)}</span>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
