'use client';

import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { rich } from '@/i18n/rich';
import { landingMeasurement, type Measurement, type RecordedEvent } from './landing-measurement';
import { HOST_PLACEHOLDER, ID_PLACEHOLDER, type RecordedLabels } from './measurement-labels';

export interface RecordedDrawerProps {
  readonly labels: RecordedLabels;
  readonly locale: string;
  readonly measurement?: Measurement;
  readonly revealAfterScroll?: number;
}

const SHOWN_ID_LENGTH = 8;
const NO_EVENTS: readonly RecordedEvent[] = [];
const ESCAPE = 'Escape';
export const REVEAL_AFTER_SCROLL_PX = 120;
const TOGGLE_TRANSITION =
  'transition-[background-color,opacity,visibility] duration-200 motion-reduce:transition-none';

const nothingYet = () => NO_EVENTS;
const closedOnTheServer = () => false;
const unknownOnTheServer = () => null;
const atTheTopOnTheServer = () => false;

function subscribeToScroll(onScroll: () => void): () => void {
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}

function detailsOf(event: RecordedEvent, labels: RecordedLabels): string {
  const referrer =
    event.referrerHost === undefined
      ? []
      : [
          event.referrerHost === null
            ? labels.noReferrer
            : labels.referrer.replace(HOST_PLACEHOLDER, event.referrerHost),
        ];
  return [
    event.path,
    ...event.properties.map(([key, value]) => `${key}: ${value}`),
    ...referrer,
  ].join(' · ');
}

function timeOf(occurredAt: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(occurredAt));
}

export function RecordedDrawer({
  labels,
  locale,
  measurement = landingMeasurement,
  revealAfterScroll = REVEAL_AFTER_SCROLL_PX,
}: RecordedDrawerProps) {
  const events = useSyncExternalStore(measurement.subscribe, measurement.events, nothingYet);
  const open = useSyncExternalStore(
    measurement.subscribe,
    measurement.drawerOpen,
    closedOnTheServer,
  );
  const status = useSyncExternalStore(
    measurement.subscribe,
    measurement.status,
    unknownOnTheServer,
  );
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY >= revealAfterScroll,
    atTheTopOnTheServer,
  );
  const panelId = useId();
  const titleId = useId();
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === ESCAPE) {
        measurement.setDrawerOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, measurement]);

  if (status !== 'on') {
    return null;
  }
  const visit = events.at(-1)?.sessionId.slice(0, SHOWN_ID_LENGTH);
  const shown = scrolled || open;
  return (
    <>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          measurement.setDrawerOpen(!open);
        }}
        className={`fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-pill border border-line-strong bg-card py-2 pr-3.5 pl-3 text-caption font-semibold text-ink shadow-raised hover:bg-soft active:bg-line ${FOCUS_RING} ${TOGGLE_TRANSITION} ${shown ? '' : 'invisible opacity-0'}`}
      >
        <span aria-hidden="true" className="size-2 rounded-pill bg-ok ring-3 ring-ok-soft" />
        {labels.button}{' '}
        <span className="rounded-pill bg-soft px-1.5 font-mono text-xs tabular-nums">
          {events.length}
        </span>
      </button>
      {open ? (
        <section
          id={panelId}
          aria-labelledby={titleId}
          className="fixed bottom-16 left-4 z-30 flex max-h-[min(70dvh,32rem)] w-[min(24rem,calc(100vw-2rem))] flex-col rounded-panel border border-line-strong bg-card text-ink shadow-raised"
        >
          <div className="flex items-start gap-2.5 border-b border-line px-4 pt-3.5 pb-2.5">
            <div className="flex flex-col gap-0.5">
              <h2 id={titleId} className="text-sm font-semibold">
                {labels.title}
              </h2>
              <p className="text-xs text-muted">{labels.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                measurement.setDrawerOpen(false);
                toggle.current?.focus();
              }}
              className={`ml-auto rounded-control px-2 py-1 text-xs font-semibold text-muted hover:bg-soft hover:text-ink ${FOCUS_RING}`}
            >
              {labels.close}
            </button>
          </div>
          {visit === undefined ? null : (
            <p className="px-4 pt-2 text-xs text-muted">
              {labels.visit.replace(ID_PLACEHOLDER, visit)}
            </p>
          )}
          {events.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">{labels.empty}</p>
          ) : (
            <ol className="grid min-h-0 grow content-start gap-1.5 overflow-y-auto px-4 py-2.5">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 rounded-input border border-line px-2.5 py-2 text-xs"
                >
                  <time
                    dateTime={event.occurredAt}
                    className="row-span-2 font-mono text-muted tabular-nums"
                  >
                    {timeOf(event.occurredAt, locale)}
                  </time>
                  <code className="font-mono font-semibold">{event.name}</code>
                  <span className="font-mono break-all text-muted">{detailsOf(event, labels)}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="border-t border-line px-4 pt-2.5 pb-3.5 text-xs leading-relaxed text-muted">
            {rich(labels.never, {
              strong: (text) => <strong className="font-semibold text-ink">{text}</strong>,
            })}
          </p>
        </section>
      ) : null}
    </>
  );
}
