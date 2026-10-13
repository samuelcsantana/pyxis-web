'use client';

import { useEffect, useRef } from 'react';
import { CONTENT_ID } from '@/components/shell/content-id';
import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  SEGMENTED_THUMB,
  SLIDING_INDICATOR,
} from '@/components/ui/control-classes';
import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { useChoiceAhead } from '@/components/ui/use-choice-ahead';
import { choiceMark, useSlidingIndicator } from '@/components/ui/use-sliding-indicator';
import { type Locale, LOCALES, localeCode, localeName } from '@/i18n/locales';

export type LanguageMenuSurface = 'page' | 'nav';
export type LanguageMenuLayout = 'row' | 'column';

export interface LanguageMenuProps {
  readonly locale: Locale;
  readonly label: string;
  readonly choose: (form: FormData) => Promise<void>;
  readonly surface?: LanguageMenuSurface;
  readonly layout?: LanguageMenuLayout;
  readonly compactOnPhones?: boolean;
}

interface SurfaceClasses {
  readonly row: string;
  readonly column: string;
  readonly option: string;
  readonly current: string;
  readonly other: string;
  readonly thumb: string;
}

const SURFACES: Readonly<Record<LanguageMenuSurface, SurfaceClasses>> = {
  page: {
    row: SEGMENTED_GROUP,
    column: 'group/segmented relative flex flex-col gap-1',
    option: `h-8 px-2.5 ${SEGMENTED_OPTION}`,
    current: SEGMENTED_SELECTED,
    other: SEGMENTED_IDLE,
    thumb: SEGMENTED_THUMB,
  },
  nav: {
    row: 'group/language relative flex flex-wrap gap-1',
    column: 'group/language relative flex flex-col gap-1',
    option: `relative z-[1] flex h-8 items-center rounded-control px-2.5 text-caption ${NAV_CONTROL}`,
    current: `${NAV_ITEM_CURRENT} group-data-sliding/language:bg-transparent`,
    other: NAV_ITEM_IDLE,
    thumb: `rounded-control bg-nav-active ${SLIDING_INDICATOR}`,
  },
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const REVEAL_MS = 180;
const REVEAL_FRAMES: Keyframe[] = [
  { opacity: 0, translate: '0 0.25rem' },
  { opacity: 1, translate: '0 0' },
];

function revealContent(): void {
  const content = document.getElementById(CONTENT_ID);
  if (content === null || content.getAnimations().length > 0) {
    return;
  }
  if (window.matchMedia(REDUCED_MOTION).matches) {
    return;
  }
  content.animate(REVEAL_FRAMES, { duration: REVEAL_MS, easing: 'ease-out' });
}

function useRevealWhenTheLanguageArrives(locale: Locale): void {
  const shownLocale = useRef(locale);
  useEffect(() => {
    if (shownLocale.current === locale) {
      return;
    }
    shownLocale.current = locale;
    revealContent();
  }, [locale]);
}

export function LanguageMenu({
  locale,
  label,
  choose,
  surface = 'page',
  layout = 'row',
  compactOnPhones = false,
}: LanguageMenuProps) {
  const classes = SURFACES[surface];
  const [shown, chooseAhead] = useChoiceAhead(locale);
  const { attach, frame, sliding } = useSlidingIndicator(shown);
  useRevealWhenTheLanguageArrives(locale);
  return (
    <form action={choose}>
      <div
        ref={attach}
        role="group"
        aria-label={label}
        data-sliding={sliding}
        className={layout === 'column' ? classes.column : classes.row}
      >
        <SlidingIndicator frame={frame} shape="fill" className={classes.thumb} />
        {LOCALES.map((each) => (
          <button
            key={each}
            type="submit"
            name="locale"
            value={each}
            lang={each}
            {...choiceMark(each)}
            aria-pressed={each === shown}
            onClick={() => {
              chooseAhead(each);
            }}
            className={`${classes.option} ${each === shown ? classes.current : classes.other}`}
          >
            {compactOnPhones ? (
              <>
                <span className="sr-only sm:not-sr-only">{localeName(each)}</span>
                <span aria-hidden="true" className="sm:hidden">
                  {localeCode(each)}
                </span>
              </>
            ) : (
              localeName(each)
            )}
          </button>
        ))}
      </div>
    </form>
  );
}
