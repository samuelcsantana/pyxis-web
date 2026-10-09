import Form from 'next/form';
import Link from 'next/link';
import type { KeptParameters } from '@/components/shell/period-selector';
import {
  BUTTON_SECONDARY,
  FIELD_FOCUS_WITHIN_RING,
  TEXT_LINK,
} from '@/components/ui/control-classes';
import { PendingSubmitButton } from '@/components/ui/pending-submit-button';
import type { I18n } from '@/i18n/i18n';

export interface FeatureSearchProps {
  readonly action: string;
  readonly keep: KeptParameters;
  readonly query: string;
  readonly label: string;
  readonly clearHref: string;
  readonly i18n: I18n;
}

const SEARCH_ICON = 'M11 4a7 7 0 1 1 0 14a7 7 0 1 1 0-14 M20 20l-4-4';

export function FeatureSearch({ action, keep, query, label, clearHref, i18n }: FeatureSearchProps) {
  return (
    <Form
      role="search"
      action={action}
      className="flex w-full flex-wrap items-center gap-2 sm:w-auto"
    >
      {Object.entries(keep).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <label
        className={`flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-input border border-field bg-card px-3 ${FIELD_FOCUS_WITHIN_RING} sm:w-80 sm:flex-none`}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="text-muted">
          <path
            d={SEARCH_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={label}
          className="min-w-0 grow bg-transparent text-base text-ink outline-none placeholder:text-muted sm:text-sm"
        />
      </label>
      <PendingSubmitButton
        label={i18n.t('features.search.submit')}
        pendingLabel={i18n.t('features.search.submitting')}
        className={`min-h-11 rounded-input px-3.5 text-sm font-medium ${BUTTON_SECONDARY}`}
      />
      {query === '' ? null : (
        <Link href={clearHref} className={`text-sm ${TEXT_LINK}`}>
          {i18n.t('features.search.clear')}
        </Link>
      )}
    </Form>
  );
}
