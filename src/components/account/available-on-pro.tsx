import Link from 'next/link';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { ProFeature } from '@/domain/pro-features';
import type { I18n } from '@/i18n/i18n';
import { ACCOUNT_PAGE } from './account-notice-banner';

export type ProOfferViewer = 'owner' | 'member';

export interface AvailableOnProProps {
  readonly i18n: I18n;
  readonly feature: ProFeature;
  readonly viewer: ProOfferViewer;
  readonly refused?: boolean;
}

const FEATURE_NAMES = {
  public_share_link: 'availableOnPro.features.publicShareLink',
  slack_alerts: 'availableOnPro.features.slackAlerts',
  annotations_by_token: 'availableOnPro.features.annotationsByToken',
  ga4_import: 'availableOnPro.features.ga4Import',
  search_console: 'availableOnPro.features.searchConsole',
} as const satisfies Readonly<Record<ProFeature, `availableOnPro.features.${string}`>>;

const BADGE =
  'rounded-pill bg-accent px-1.5 py-px font-mono text-caption font-medium text-accent-ink';

export function AvailableOnPro({ i18n, feature, viewer, refused = false }: AvailableOnProProps) {
  const { t } = i18n;
  const headingId = `available-on-pro-${feature}`;
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-2 rounded-card border border-line bg-card p-4"
    >
      <h3 id={headingId} className="flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden="true" className={BADGE}>
          {t('availableOnPro.badge')}
        </span>
        {t('availableOnPro.title')}
      </h3>
      {refused ? (
        <p role="alert" className="text-sm font-medium text-bad">
          {t('availableOnPro.refused')}
        </p>
      ) : null}
      <p className="text-sm text-muted">
        {t('availableOnPro.body', { feature: t(FEATURE_NAMES[feature]) })}
      </p>
      {viewer === 'owner' ? (
        <Link href={ACCOUNT_PAGE} className={`self-start text-sm ${TEXT_LINK}`}>
          {t('availableOnPro.subscribe')}
        </Link>
      ) : (
        <p className="text-sm">{t('availableOnPro.askOwner')}</p>
      )}
    </section>
  );
}
