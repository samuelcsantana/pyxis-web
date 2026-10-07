import Link from 'next/link';
import { CHANNEL_LABELS, CHANNELS } from '@/domain/acquisition';
import { deviceTypeLabel } from '@/domain/devices';
import { type Period, periodQuery } from '@/domain/period';
import {
  PAGE_FILTER_PARAMETERS,
  VISIT_DEVICE_TYPES,
  VISIT_IDENTITIES,
  type VisitFilters,
  type VisitIdentity,
} from '@/domain/visits';
import { PANEL } from '@/components/ui/panel-classes';
import { FOCUS_RING } from '@/components/ui/control-classes';

export interface VisitFiltersFormProps {
  readonly action: string;
  readonly period: Period;
  readonly filters: VisitFilters;
  readonly problems: readonly string[];
  readonly clearHref: string | null;
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

const LABEL = 'flex min-w-0 flex-col gap-1.5 text-[13px] font-medium';
const FIELD = `min-h-11 w-full rounded-input border border-line bg-card px-3 text-sm font-normal text-ink ${FOCUS_RING}`;
const HINT = 'text-xs font-normal text-muted';

export function VisitFiltersForm({
  action,
  period,
  filters,
  problems,
  clearHref,
}: VisitFiltersFormProps) {
  return (
    <form
      role="search"
      aria-label="Filter the visits"
      action={action}
      method="get"
      className={`${PANEL} gap-4`}
    >
      {[...new URLSearchParams(periodQuery(period))].map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-[13px] font-semibold">Passed by pages</legend>
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
                className={`${FIELD} font-mono`}
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
            className={`${FIELD} font-mono`}
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
            className={`${FIELD} font-mono`}
          />
          <span id="visit-property-hint" className={HINT}>
            key=value, on the event above
          </span>
        </label>
        <label className={LABEL}>
          Channel
          <select name="channel" defaultValue={filters.channel ?? ''} className={FIELD}>
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
          <select name="device" defaultValue={filters.device ?? ''} className={FIELD}>
            <option value="">Any device</option>
            {VISIT_DEVICE_TYPES.map((device) => (
              <option key={device} value={device}>
                {deviceTypeLabel(device)}
              </option>
            ))}
          </select>
        </label>
        <label className={LABEL}>
          Account
          <select name="identity" defaultValue={filters.identity ?? ''} className={FIELD}>
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
        <div role="alert" className="rounded-input bg-bad-soft px-3 py-2 text-[13px] text-bad">
          <p className="font-semibold">Some filters were left out:</p>
          <ul className="list-disc pl-5">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className={`min-h-11 rounded-input bg-accent px-4.5 text-sm font-semibold text-accent-ink ${FOCUS_RING}`}
        >
          Apply filters
        </button>
        {clearHref === null ? null : (
          <Link
            href={clearHref}
            className={`text-[13px] text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
          >
            Clear filters
          </Link>
        )}
      </div>
    </form>
  );
}
