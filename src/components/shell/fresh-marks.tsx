'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  FRESH_ARRIVED,
  FRESH_ITEM,
  FRESH_KEPT,
  FRESH_STARTED,
  FRESH_VALUE,
} from '@/components/ui/fresh-slots';
import { resolvePeriodOn } from '@/domain/period';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import {
  type Comparison,
  grewBy,
  type ShownNumbersStore,
  shownReadKey,
  startedAfter,
} from '@/lib/shown-numbers';
import type { ScreenReadNote } from './arrival-news';
import { CONTENT_ID } from './content-id';
import { screenSearchOf } from './screen-search';
import { screenSlugOf } from './screens';

export type FreshMark =
  | {
      readonly kind: 'count';
      readonly slot: Element;
      readonly count: number;
      readonly arrived: boolean;
    }
  | { readonly kind: 'visit'; readonly slot: Element; readonly arrived: boolean };

export interface FreshMarks {
  readonly read: (note: ScreenReadNote, today: string) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly marks: () => readonly FreshMark[];
}

type CountSlot = readonly [slot: Element, item: string, value: number];
type VisitSlot = readonly [slot: Element, startedAt: number];

const NO_MARKS: readonly FreshMark[] = [];
const CHIP =
  'inline-flex items-center rounded-pill bg-mark-mid px-2 align-middle text-micro leading-5 font-semibold whitespace-nowrap text-ink tabular-nums';

function noMarks(): readonly FreshMark[] {
  return NO_MARKS;
}

function numberIn(slot: Element, attribute: string): number {
  return Number(slot.getAttribute(attribute) ?? Number.NaN);
}

function countSlotsIn(root: ParentNode): readonly CountSlot[] {
  return [...root.querySelectorAll(`[${FRESH_ITEM}]`)].flatMap((slot) => {
    const value = numberIn(slot, FRESH_VALUE);
    return Number.isFinite(value)
      ? [[slot, String(slot.getAttribute(FRESH_ITEM)), value] as const]
      : [];
  });
}

function visitSlotsIn(root: ParentNode): readonly VisitSlot[] {
  return [...root.querySelectorAll(`[${FRESH_STARTED}]`)].flatMap((slot) => {
    const startedAt = numberIn(slot, FRESH_STARTED);
    return Number.isFinite(startedAt) ? [[slot, startedAt] as const] : [];
  });
}

function marksOf(
  counts: readonly CountSlot[],
  visits: readonly VisitSlot[],
  { against, arrived }: Comparison,
): readonly FreshMark[] {
  return [
    ...counts.flatMap(([slot, item, value]): FreshMark[] => {
      const count = grewBy(item, value, against);
      return count === 0 ? [] : [{ kind: 'count', slot, count, arrived }];
    }),
    ...visits.flatMap(([slot, startedAt]): FreshMark[] =>
      startedAfter(startedAt, against) ? [{ kind: 'visit', slot, arrived }] : [],
    ),
  ];
}

function isShown(note: ScreenReadNote): boolean {
  return note.path === window.location.pathname && note.search === window.location.search;
}

export function createFreshMarks(store: ShownNumbersStore): FreshMarks {
  const listeners = new Set<() => void>();
  let marks = NO_MARKS;

  const publish = (next: readonly FreshMark[]) => {
    marks = next;
    for (const listener of listeners) {
      listener();
    }
  };

  const compare = (note: ScreenReadNote, screen: string, today: string) => {
    const root = document.getElementById(CONTENT_ID);
    const counts = root === null ? [] : countSlotsIn(root);
    const visits = root === null ? [] : visitSlotsIn(root);
    if (counts.length === 0 && visits.length === 0) {
      return NO_MARKS;
    }
    const search = new URLSearchParams(note.search);
    const { from, to } = resolvePeriodOn(screenSearchOf(search), today);
    const comparison = store.compare({
      key: shownReadKey(screen, from, to, note.search),
      to,
      read: {
        readAt: note.readAt,
        values: Object.fromEntries(counts.map(([, item, value]) => [item, value])),
      },
      today,
    });
    return comparison === undefined ? NO_MARKS : marksOf(counts, visits, comparison);
  };

  return {
    read(note, today) {
      if (!isShown(note)) {
        return;
      }
      const screen = screenSlugOf(note.path);
      publish(screen === undefined ? NO_MARKS : compare(note, screen, today));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    marks: () => marks,
  };
}

export interface FreshMarksViewProps {
  readonly source: FreshMarks;
}

export function FreshMarksView({ source }: FreshMarksViewProps) {
  const t = useT();
  const locale = useLocale();
  const numbers = useMemo(() => new Intl.NumberFormat(displayTag(locale)), [locale]);
  const marks = useSyncExternalStore(source.subscribe, source.marks, noMarks);
  return marks.map((mark, index) =>
    createPortal(
      <span data-fresh-shown={mark.arrived ? FRESH_ARRIVED : FRESH_KEPT} className={CHIP}>
        {mark.kind === 'visit' ? (
          t('nav.arrivals.newVisit')
        ) : (
          <>
            <span aria-hidden="true">+{numbers.format(mark.count)}</span>
            <span className="sr-only">
              {t('nav.arrivals.moreSinceLastRead', { count: numbers.format(mark.count) })}
            </span>
          </>
        )}
      </span>,
      mark.slot,
      String(index),
    ),
  );
}
