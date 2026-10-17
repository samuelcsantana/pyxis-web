'use client';

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
import { type Locale, LOCALES, localeName } from '@/i18n/locales';
import { useRevealWhenTheLanguageArrives } from './use-reveal-when-the-language-arrives';

export type LanguageMenuSurface = 'page' | 'nav';
export type LanguageMenuLayout = 'row' | 'column';

export interface LanguageMenuProps {
  readonly locale: Locale;
  readonly label: string;
  readonly choose: (form: FormData) => Promise<void>;
  readonly surface?: LanguageMenuSurface;
  readonly layout?: LanguageMenuLayout;
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

export function LanguageMenu({
  locale,
  label,
  choose,
  surface = 'page',
  layout = 'row',
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
            {localeName(each)}
          </button>
        ))}
      </div>
    </form>
  );
}
