import Form from 'next/form';
import Link from 'next/link';
import { CHANNEL_LABELS, CHANNELS } from '@/domain/acquisition';
import { deviceTypeLabel } from '@/domain/devices';
import { type Period, periodQuery } from '@/domain/period';
import type { I18n } from '@/i18n/i18n';
import {
  PAGE_FILTER_PARAMETERS,
  VISIT_DEVICE_TYPES,
  VISIT_IDENTITIES,
  type VisitFilters,
  type VisitIdentity,
  visitFilterCount,
} from '@/domain/visits';
import { PANEL } from '@/components/ui/panel-classes';
import { BUTTON_PRIMARY, FIELD, TEXT_LINK } from '@/components/ui/control-classes';
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

const PAGE_FIELD_LABELS: Readonly<Record<(typeof PAGE_FILTER_PARAMETERS)[number], string>> = {
  path: 'Viewed page',
  path2: 'And page',
  path3: 'And also page',
};

const IDENTITY_LABELS: Readonly<Record<VisitIdentity, string>> = {
  identified: 'Identified',
  anonymous: 'Anonymous',
};

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
  return (
    <Form role="search" aria-label="Filter the visits" action={action} className={`${PANEL} gap-4`}>
      {[...new URLSearchParams(periodQuery(period))].map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <CollapsibleFilters
        activeCount={activeCount}
        initiallyOpen={activeCount > 0 || problems.length > 0}
      >
        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className="mb-2 text-caption font-semibold">Passed by pages</legend>
          <p id="visit-pages-hint" className={HINT}>
            A visit must have viewed every page given. A * matches any characters, as in /blog/*.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAGE_FILTER_PARAMETERS.map((name, index) => (
              <label key={name} className={LABEL}>
                {PAGE_FIELD_LABELS[name]}
                <input
                  name={name}
                  defaultValue={filters.paths[index] ?? ''}
                  placeholder={index === 0 ? '/pricing' : undefined}
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
            Had event
            <input
              name="event"
              defaultValue={filters.event ?? ''}
              placeholder="signup_completed"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
          </label>
          <label className={LABEL}>
            With property
            <input
              name="property"
              defaultValue={filters.property ?? ''}
              placeholder="plan=pro"
              aria-describedby="visit-property-hint"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASS} font-mono`}
            />
            <span id="visit-property-hint" className={HINT}>
              key=value, on the event above
            </span>
          </label>
          <label className={LABEL}>
            Channel
            <select name="channel" defaultValue={filters.channel ?? ''} className={FIELD_CLASS}>
              <option value="">Any channel</option>
              {CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {CHANNEL_LABELS[channel]}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL}>
            Device
            <select name="device" defaultValue={filters.device ?? ''} className={FIELD_CLASS}>
              <option value="">Any device</option>
              {VISIT_DEVICE_TYPES.map((device) => (
                <option key={device} value={device}>
                  {deviceTypeLabel(device, i18n)}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL}>
            Account
            <select name="identity" defaultValue={filters.identity ?? ''} className={FIELD_CLASS}>
              <option value="">Anyone</option>
              {VISIT_IDENTITIES.map((identity) => (
                <option key={identity} value={identity}>
                  {IDENTITY_LABELS[identity]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {problems.length === 0 ? null : (
          <div role="alert" className="rounded-input bg-bad-soft px-3 py-2 text-caption text-bad">
            <p className="font-semibold">Some filters were left out:</p>
            <ul className="list-disc pl-5">
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <PendingSubmitButton
            label="Apply filters"
            pendingLabel="Applying…"
            className={`min-h-11 rounded-input px-4.5 text-sm ${BUTTON_PRIMARY}`}
          />
          {clearHref === null ? null : (
            <Link href={clearHref} className={`text-caption ${TEXT_LINK}`}>
              Clear filters
            </Link>
          )}
        </div>
      </CollapsibleFilters>
    </Form>
  );
}
