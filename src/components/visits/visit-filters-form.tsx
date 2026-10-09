import Form from 'next/form';
import Link from 'next/link';
import { CHANNELS, channelLabel } from '@/domain/acquisition';
import { deviceTypeLabel } from '@/domain/devices';
import { type Period, periodQuery } from '@/domain/period';
import type { I18n } from '@/i18n/i18n';
import {
  MAX_CAMPAIGN_LENGTH,
  MAX_SOURCE_LENGTH,
  PAGE_FILTER_PARAMETERS,
  VISIT_DEVICE_TYPES,
  VISIT_IDENTITIES,
  type VisitFilters,
  visitFilterCount,
} from '@/domain/visits';
import { PANEL } from '@/components/ui/panel-classes';
import { BUTTON_PRIMARY, FIELD, TEXT_LINK } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import { PendingSubmitButton } from '@/components/ui/pending-submit-button';
import { CollapsibleFilters } from './collapsible-filters';

export interface VisitFiltersFormProps {
  readonly action: string;
  readonly period: Period;
  readonly filters: VisitFilters;
  readonly problems: readonly string[];
  readonly clearHref: string | null;
  readonly i18n: I18n;
}

const LABEL = 'flex min-w-0 flex-col gap-1.5 text-caption font-medium';
const FIELD_CLASS = `min-h-11 w-full rounded-input px-3 text-base font-normal sm:text-sm ${FIELD}`;
const HINT = 'text-xs font-normal text-muted';

export function VisitFiltersForm({
  action,
  period,
  filters,
  problems,
  clearHref,
  i18n,
}: VisitFiltersFormProps) {
  const activeCount = visitFilterCount(filters);
  const t = i18n.t;
  return (
    <Form
      role="search"
      aria-label={t('visits.filters.label')}
      action={action}
      className={`${PANEL} gap-4`}
    >
      {[...new URLSearchParams(periodQuery(period))].map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <CollapsibleFilters
        label={
          activeCount === 0
            ? t('visits.filters.toggle')
            : t('visits.filters.toggleActive', { count: String(activeCount) })
        }
        initiallyOpen={activeCount > 0 || problems.length > 0}
      >
        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className="mb-2 text-caption font-semibold">
            {t('visits.filters.pages.legend')}
          </legend>
          <p id="visit-pages-hint" className={HINT}>
            {t('visits.filters.pages.hint')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAGE_FILTER_PARAMETERS.map((name, index) => (
              <label key={name} className={LABEL}>
                {t(`visits.filters.pages.${name}`)}
                <input
                  name={name}
                  defaultValue={filters.paths[index] ?? ''}
                  placeholder={index === 0 ? t('visits.filters.placeholders.path') : undefined}
                  aria-describedby="visit-pages-hint"
                  autoComplete="off"
                  spellCheck={false}
                  className={`${FIELD_CLASS} font-mono`}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className={LABEL}>
            {t('visits.filters.event')}
            <input
              name="event"
              defaultValue={filters.event ?? ''}
              placeholder={t('visits.filters.placeholders.event')}
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
          </label>
          <label className={LABEL}>
            {t('visits.filters.property')}
            <input
              name="property"
              defaultValue={filters.property ?? ''}
              placeholder={t('visits.filters.placeholders.property')}
              aria-describedby="visit-property-hint"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
            <span id="visit-property-hint" className={HINT}>
              {t('visits.filters.propertyHint')}
            </span>
          </label>
          <label className={LABEL}>
            {t('visits.filters.channel')}
            <SelectField
              name="channel"
              defaultValue={filters.channel ?? ''}
              className={FIELD_CLASS}
            >
              <option value="">{t('visits.filters.anyChannel')}</option>
              {CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {channelLabel(channel, i18n)}
                </option>
              ))}
            </SelectField>
          </label>
          <label className={LABEL}>
            {t('visits.filters.device')}
            <SelectField name="device" defaultValue={filters.device ?? ''} className={FIELD_CLASS}>
              <option value="">{t('visits.filters.anyDevice')}</option>
              {VISIT_DEVICE_TYPES.map((device) => (
                <option key={device} value={device}>
                  {deviceTypeLabel(device, i18n)}
                </option>
              ))}
            </SelectField>
          </label>
          <label className={LABEL}>
            {t('visits.filters.account')}
            <SelectField
              name="identity"
              defaultValue={filters.identity ?? ''}
              className={FIELD_CLASS}
            >
              <option value="">{t('visits.filters.anyone')}</option>
              {VISIT_IDENTITIES.map((identity) => (
                <option key={identity} value={identity}>
                  {t(`visits.filters.identities.${identity}`)}
                </option>
              ))}
            </SelectField>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className={LABEL}>
            {t('visits.filters.country')}
            <input
              name="country"
              defaultValue={filters.country ?? ''}
              placeholder={t('visits.filters.placeholders.country')}
              maxLength={2}
              aria-describedby="visit-country-hint"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono uppercase`}
            />
            <span id="visit-country-hint" className={HINT}>
              {t('visits.filters.countryHint')}
            </span>
          </label>
          <label className={LABEL}>
            {t('visits.filters.source')}
            <input
              name="source"
              defaultValue={filters.source ?? ''}
              placeholder={t('visits.filters.placeholders.source')}
              maxLength={MAX_SOURCE_LENGTH}
              aria-describedby="visit-source-hint"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
            <span id="visit-source-hint" className={HINT}>
              {t('visits.filters.sourceHint')}
            </span>
          </label>
          <label className={LABEL}>
            {t('visits.filters.campaign')}
            <input
              name="campaign"
              defaultValue={filters.campaign ?? ''}
              placeholder={t('visits.filters.placeholders.campaign')}
              maxLength={MAX_CAMPAIGN_LENGTH}
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
          </label>
          <label className={LABEL}>
            {t('visits.filters.route')}
            <input
              name="route"
              defaultValue={filters.route ?? ''}
              placeholder={t('visits.filters.placeholders.route')}
              aria-describedby="visit-route-hint"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
            <span id="visit-route-hint" className={HINT}>
              {t('visits.filters.routeHint')}
            </span>
          </label>
          <label className="flex min-h-11 items-center gap-2.5 self-start text-caption font-medium sm:mt-6">
            <input
              type="checkbox"
              name="failed"
              value="true"
              defaultChecked={filters.failed}
              className="size-5 shrink-0 text-base sm:text-sm"
            />
            {t('visits.filters.failed')}
          </label>
        </div>
        {problems.length === 0 ? null : (
          <div role="alert" className="rounded-input bg-bad-soft px-3 py-2 text-caption text-bad">
            <p className="font-semibold">{t('visits.filters.leftOut')}</p>
            <ul className="list-disc pl-5">
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <PendingSubmitButton
            label={t('visits.filters.apply')}
            pendingLabel={t('visits.filters.applying')}
            className={`min-h-11 rounded-input px-4.5 text-sm ${BUTTON_PRIMARY}`}
          />
          {clearHref === null ? null : (
            <Link href={clearHref} className={`text-caption ${TEXT_LINK}`}>
              {t('visits.filters.clear')}
            </Link>
          )}
        </div>
      </CollapsibleFilters>
    </Form>
  );
}
