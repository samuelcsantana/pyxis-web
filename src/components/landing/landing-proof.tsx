import type { I18n } from '@/i18n/i18n';
import { FOCUS_RING, CONTROL_TRANSITION } from '@/components/ui/control-classes';
import { LANDING_LINKS } from './landing-links';

export interface LandingProofProps {
  readonly i18n: I18n;
}

const FACTS = [
  { key: 'size', href: LANDING_LINKS.sdk },
  { key: 'dependencies', href: LANDING_LINKS.sdkPackage },
  { key: 'coverage', href: LANDING_LINKS.coverage },
  { key: 'license', href: LANDING_LINKS.license },
] as const;

export function LandingProof({ i18n }: LandingProofProps) {
  const { t } = i18n;
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-4">
      {FACTS.map((fact) => (
        <li key={fact.key} className="flex">
          <a
            href={fact.href}
            className={`flex grow flex-col gap-0.5 bg-card px-4.5 py-4 hover:bg-soft active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`}
          >
            <span className="font-mono text-figure leading-tight font-semibold tracking-tight tabular-nums">
              {t(`landing.proof.${fact.key}.value`)}
            </span>{' '}
            <span className="text-caption text-muted">{t(`landing.proof.${fact.key}.label`)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
