import { FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { legalDocumentOf, legalUrlOf } from '@/lib/legal-documents';
import { offersSignUp, type SignUpOffer } from '@/domain/sign-up';
import { REVEAL } from './landing-classes';
import { LandingSection } from './landing-section';

export interface FaqSectionProps {
  readonly i18n: I18n;
  readonly offer: SignUpOffer;
}

export const FAQ_ID = 'faq';

const QUESTIONS = [
  'cookies',
  'address',
  'people',
  'optOut',
  'retention',
  'claude',
  'use',
  'agency',
  'noCode',
  'aiInstall',
  'price',
  'trial',
  'cancel',
  'limit',
  'payment',
] as const;
const ANSWERED_DIFFERENTLY_WHEN_OPEN = ['use', 'cancel'] as const;
const FIRST_OPEN = 'cookies';

type Question = (typeof QUESTIONS)[number];
type AnsweredDifferentlyWhenOpen = (typeof ANSWERED_DIFFERENTLY_WHEN_OPEN)[number];

function isAnsweredDifferentlyWhenOpen(
  question: Question,
): question is AnsweredDifferentlyWhenOpen {
  return (ANSWERED_DIFFERENTLY_WHEN_OPEN as readonly Question[]).includes(question);
}
const FAQ_MOTION = 'landing-faq';

export function FaqSection({ i18n, offer }: FaqSectionProps) {
  const { t } = i18n;
  const signUpOpen = offersSignUp(offer);
  const terms = legalDocumentOf('terms', i18n.locale);
  return (
    <LandingSection id={FAQ_ID} eyebrow={t('landing.faq.eyebrow')} title={t('landing.faq.title')}>
      <div className={`grid max-w-3xl gap-2 hyphens-auto wrap-anywhere ${FAQ_MOTION}`}>
        {QUESTIONS.map((question) => (
          <details
            key={question}
            open={question === FIRST_OPEN}
            className={`group rounded-card border border-line bg-card ${REVEAL}`}
          >
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-card px-4 py-3.5 text-base font-semibold [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
            >
              {t(`landing.faq.items.${question}.question`)}
              <span
                aria-hidden="true"
                className="font-mono text-lg font-normal text-muted transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="px-4 pb-4 text-base leading-relaxed text-muted">
              {rich(
                signUpOpen && isAnsweredDifferentlyWhenOpen(question)
                  ? t(`landing.faq.items.${question}.answerOpen`)
                  : t(`landing.faq.items.${question}.answer`),
                {
                  code: (text) => <code className="font-mono text-sm text-ink">{text}</code>,
                  terms: (text) => (
                    <a
                      href={legalUrlOf(terms)}
                      hrefLang={terms.locale}
                      className="text-ink underline underline-offset-4"
                    >
                      {text}
                    </a>
                  ),
                },
              )}
            </p>
          </details>
        ))}
      </div>
    </LandingSection>
  );
}
