import { FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';

export interface ComparisonSectionProps {
  readonly i18n: I18n;
}

export const COMPARISON_ID = 'comparison';

const ROWS = ['cookie', 'address', 'linking', 'thirdParties', 'source'] as const;
const HEADER_CELL =
  'px-4 py-3 text-left text-xs font-semibold tracking-[0.06em] text-muted uppercase';
const CELL = 'border-t border-line px-4 py-3 text-left align-top';

export function ComparisonSection({ i18n }: ComparisonSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={COMPARISON_ID}
      eyebrow={t('landing.comparison.eyebrow')}
      title={t('landing.comparison.title')}
    >
      <div
        role="region"
        aria-label={t('landing.comparison.table')}
        tabIndex={0}
        className={`overflow-x-auto rounded-card border border-line bg-card ${FOCUS_RING} ${REVEAL}`}
      >
        <table
          aria-labelledby={`${COMPARISON_ID}-title`}
          className="w-full min-w-xl border-collapse text-sm"
        >
          <thead>
            <tr>
              <th scope="col" className={HEADER_CELL}>
                {t('landing.comparison.aspect')}
              </th>
              <th scope="col" className={HEADER_CELL}>
                {APP_NAME}
              </th>
              <th scope="col" className={HEADER_CELL}>
                {t('landing.comparison.typical')}
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row}>
                <th scope="row" className={`${CELL} font-normal`}>
                  {t(`landing.comparison.rows.${row}.aspect`)}
                </th>
                <td className={`${CELL} font-semibold`}>
                  {t(`landing.comparison.rows.${row}.pyxis`)}
                </td>
                <td className={`${CELL} text-muted`}>
                  {t(`landing.comparison.rows.${row}.typical`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-caption text-muted">{t('landing.comparison.foot')}</p>
    </LandingSection>
  );
}
