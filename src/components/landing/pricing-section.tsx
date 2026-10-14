import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { CopyCodeButton } from './copy-code-button';
import { LINK_PRIMARY, LINK_QUIET, REVEAL } from './landing-classes';
import { CONTACT_EMAIL, LANDING_LINKS } from './landing-links';
import { LandingSection } from './landing-section';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface PricingSectionProps {
  readonly i18n: I18n;
}

export const PRICING_ID = 'pricing';
export const CONTACT_EMAIL_ID = 'pricing-contact-email';

const INCLUDED = ['events', 'sites', 'people', 'history', 'digest', 'agents'] as const;
const PERIOD_FIELD = 'pricing-period';
const YEARLY = 'year';
const MONTHLY = 'month';
const CHECK_ICON = 'm5 12.5 4.5 4.5L19 7.5';
const ARROW_ICON = 'M5 12h14 M13 6l6 6-6 6';

const PERIOD_OPTION = `relative flex cursor-pointer flex-wrap items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-sm font-medium text-muted hover:text-ink has-checked:bg-card has-checked:text-ink has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${CONTROL_TRANSITION}`;
const SHOW_WHEN_MONTHLY =
  'flex flex-col gap-1 group-has-[input[value=year]:checked]/pricing:hidden';
const SHOW_WHEN_YEARLY = 'hidden flex-col gap-1 group-has-[input[value=year]:checked]/pricing:flex';
const PRICE = 'text-5xl leading-none font-semibold tracking-[-0.03em] tabular-nums';
const NOTE = 'text-sm leading-relaxed text-muted';

function mailtoOf(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

interface PriceProps {
  readonly amount: string;
  readonly period: string;
  readonly note: string;
  readonly className: string;
}

function Price({ amount, period, note, className }: PriceProps) {
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-2.5">
        <span className={PRICE}>{amount}</span>
        <span className="text-base text-muted">{period}</span>
      </p>
      <p className={NOTE}>{note}</p>
    </div>
  );
}

function AskPanel({ i18n }: PricingSectionProps) {
  const { t } = i18n;
  return (
    <div className="mt-3 flex flex-col gap-3 rounded-card border border-dashed border-line-strong bg-soft p-4.5 text-base">
      <p className="font-semibold">{t('landing.pricing.askTitle')}</p>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-card bg-nav py-2.5 pr-2.5 pl-5">
        <code
          id={CONTACT_EMAIL_ID}
          className="min-w-0 font-mono text-sm wrap-anywhere text-nav-strong sm:text-base"
        >
          {CONTACT_EMAIL}
        </code>
        <CopyCodeButton
          placement="inline"
          code={CONTACT_EMAIL}
          targetId={CONTACT_EMAIL_ID}
          labels={{
            copy: t('landing.install.copy'),
            copied: t('landing.install.copied'),
            selected: t('landing.install.selected'),
          }}
          track={trackAttributes(LANDING_EVENTS.snippetCopied, { snippet: CONTACT_EMAIL_ID })}
        />
      </div>
      <p>{t('landing.pricing.askIntro')}</p>
      <ol className="grid list-decimal gap-1 pl-5">
        <li>{t('landing.pricing.askSite')}</li>
        <li>{t('landing.pricing.askVisits')}</li>
        <li>{t('landing.pricing.askEmail')}</li>
      </ol>
      <p className={NOTE}>{t('landing.pricing.askReply')}</p>
      <a
        href={mailtoOf(t('landing.pricing.mailSubject'))}
        className={`self-start text-sm ${LINK_QUIET} underline`}
      >
        {t('landing.pricing.askMail')}
      </a>
    </div>
  );
}

export function PricingSection({ i18n }: PricingSectionProps) {
  const { t } = i18n;
  return (
    <LandingSection
      id={PRICING_ID}
      eyebrow={t('landing.pricing.eyebrow')}
      title={t('landing.pricing.title')}
      lead={t('landing.pricing.lead')}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <div
            className={`group/pricing flex flex-col gap-5 rounded-card border border-line bg-card p-6 ${REVEAL}`}
          >
            <fieldset className="inline-flex max-w-full flex-wrap gap-0.5 self-start rounded-pill border border-line bg-soft p-[3px]">
              <legend className="sr-only">{t('landing.pricing.period')}</legend>
              <label className={PERIOD_OPTION}>
                <input
                  type="radio"
                  name={PERIOD_FIELD}
                  value={MONTHLY}
                  defaultChecked
                  aria-label={t('landing.pricing.monthlyLabel')}
                  className="sr-only"
                />
                {t('landing.pricing.monthly')}
              </label>
              <label className={PERIOD_OPTION}>
                <input
                  type="radio"
                  name={PERIOD_FIELD}
                  value={YEARLY}
                  aria-label={t('landing.pricing.yearlyLabel')}
                  className="sr-only"
                />
                {t('landing.pricing.yearly')}
                <span className="rounded-pill bg-accent px-2 py-0.5 font-mono text-caption font-medium text-accent-ink">
                  {t('landing.pricing.saving')}
                </span>
              </label>
            </fieldset>
            <Price
              amount={t('landing.pricing.monthlyPrice')}
              period={t('landing.pricing.perMonth')}
              note={t('landing.pricing.monthlyNote')}
              className={SHOW_WHEN_MONTHLY}
            />
            <Price
              amount={t('landing.pricing.yearlyPrice')}
              period={t('landing.pricing.perYear')}
              note={t('landing.pricing.yearlyNote')}
              className={SHOW_WHEN_YEARLY}
            />
            <ul className="grid gap-2.5 text-base">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent"
                  >
                    <path
                      d={CHECK_ICON}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t(`landing.pricing.included.${item}`)}
                </li>
              ))}
            </ul>
            <details className="group/ask">
              <summary
                className={`${LINK_PRIMARY} cursor-pointer list-none self-start [&::-webkit-details-marker]:hidden`}
                {...trackAttributes(LANDING_EVENTS.accessRequested, { from: PRICING_ID })}
              >
                {t('landing.pricing.ask')}
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-open/ask:rotate-90 motion-reduce:transition-none"
                >
                  <path
                    d={ARROW_ICON}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <AskPanel i18n={i18n} />
            </details>
            <p className={NOTE}>{t('landing.pricing.trial')}</p>
            <p className={NOTE}>{t('landing.pricing.availability')}</p>
          </div>
          <p className={`max-w-2xl ${NOTE}`}>{t('landing.pricing.invite')}</p>
        </div>
        <div className={`flex flex-col gap-2.5 rounded-card border border-line p-5 ${REVEAL}`}>
          <h3 className="text-lg font-semibold">{t('landing.pricing.selfHostTitle')}</h3>
          <p className="text-base leading-relaxed text-muted">{t('landing.pricing.selfHost')}</p>
          <a
            href={LANDING_LINKS.selfHost}
            className={`self-start font-semibold text-ink underline underline-offset-4 ${FOCUS_RING} ${CONTROL_TRANSITION}`}
            {...trackAttributes(LANDING_EVENTS.docsOpened, { doc: 'self-host' })}
          >
            {t('landing.pricing.selfHostLink')}
          </a>
        </div>
      </div>
    </LandingSection>
  );
}
