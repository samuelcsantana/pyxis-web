import Link from 'next/link';
import type { ItemKind, TimelineItem, VisitView } from '@/domain/timeline';
import { TONE_CLASSES } from '@/components/requests/status-styles';
import { Breakable } from '@/components/ui/breakable';
import { FOCUS_RING, TEXT_LINK } from '@/components/ui/control-classes';

const ICONS: Readonly<Record<ItemKind, string>> = {
  page: 'M6 3h9l3 3v15H6z M14 3v4h4',
  event: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  request: 'M4 7h13 M13 3l4 4-4 4 M20 17H7 M11 13l-4 4 4 4',
  identify: 'M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8z M4 21a8 8 0 0 1 16 0',
};
const FAILURE_ICON = 'M12 3l9 16H3l9-16z M12 10v4 M12 17h.01';

const KIND_CLASSES: Readonly<Record<ItemKind, string>> = {
  page: 'bg-soft text-sky-ink',
  event: 'bg-soft text-violet-ink',
  request: 'bg-ok-soft text-ok',
  identify: 'bg-warn-soft text-ink',
};

function iconOf(item: TimelineItem): { readonly path: string; readonly classes: string } {
  if (item.tag !== null && item.tag.tone !== 'success') {
    return { path: FAILURE_ICON, classes: TONE_CLASSES[item.tag.tone] };
  }
  return { path: ICONS[item.kind], classes: KIND_CLASSES[item.kind] };
}

export interface VisitPersonLink {
  readonly label: string;
  readonly href: string;
}

export interface VisitCardProps {
  readonly visit: VisitView;
  readonly emptyText: string;
  readonly focusable?: boolean;
  readonly person?: VisitPersonLink | null;
}

export function VisitCard({ visit, emptyText, focusable = false, person = null }: VisitCardProps) {
  const headingId = `visit-${visit.key}`;
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col rounded-card border border-line bg-card px-3.5 pt-3.5 pb-2 text-ink sm:px-5.5 sm:pt-4.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <h3
          id={headingId}
          tabIndex={focusable ? -1 : undefined}
          className={`text-callout font-semibold ${FOCUS_RING}`}
        >
          {visit.heading}
        </h3>
        <p className="text-xs text-muted">{visit.meta}</p>
        {person === null ? null : (
          <Link href={person.href} className={`text-xs ${TEXT_LINK}`}>
            {person.label}
          </Link>
        )}
      </div>
      {visit.items.length === 0 ? (
        <p className="py-3.5 text-caption text-muted">{emptyText}</p>
      ) : (
        <ol>
          {visit.items.map((item) => {
            const icon = iconOf(item);
            return (
              <li
                key={item.key}
                className="grid grid-cols-[4.25rem_2rem_minmax(0,1fr)] items-center gap-x-3 border-b border-line py-2.5 last:border-b-0 sm:grid-cols-[4.5rem_2rem_minmax(0,1fr)_auto] sm:gap-x-3.5"
              >
                <span className="font-mono text-xs text-muted tabular-nums">{item.time}</span>
                <span
                  aria-hidden="true"
                  className={`flex size-7.5 items-center justify-center rounded-pill ${icon.classes}`}
                >
                  <svg width={15} height={15} viewBox="0 0 24 24">
                    <path
                      d={icon.path}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium wrap-anywhere">
                    <Breakable text={item.title} />
                  </span>
                  {item.detail === '' ? null : (
                    <span className="font-mono text-xs text-muted wrap-anywhere">
                      <Breakable text={item.detail} />
                    </span>
                  )}
                </span>
                {item.tag === null ? null : (
                  <span
                    className={`col-start-3 max-w-full justify-self-start rounded-pill px-2.5 py-0.5 text-xs font-semibold tabular-nums wrap-anywhere sm:col-start-auto ${TONE_CLASSES[item.tag.tone]}`}
                  >
                    {item.tag.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
