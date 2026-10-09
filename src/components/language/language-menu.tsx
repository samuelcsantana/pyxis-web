import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';
import { type Locale, LOCALES, localeName } from '@/i18n/locales';

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
  readonly group: string;
  readonly option: string;
  readonly current: string;
  readonly other: string;
}

const SURFACES: Readonly<Record<LanguageMenuSurface, SurfaceClasses>> = {
  page: {
    group: SEGMENTED_GROUP,
    option: `h-8 px-2.5 ${SEGMENTED_OPTION}`,
    current: SEGMENTED_SELECTED,
    other: SEGMENTED_IDLE,
  },
  nav: {
    group: 'flex flex-wrap gap-1',
    option: `flex h-8 items-center rounded-control px-2.5 text-caption ${NAV_CONTROL}`,
    current: NAV_ITEM_CURRENT,
    other: NAV_ITEM_IDLE,
  },
};

const COLUMN_GROUP = 'flex flex-col gap-1';

export function LanguageMenu({
  locale,
  label,
  choose,
  surface = 'page',
  layout = 'row',
}: LanguageMenuProps) {
  const classes = SURFACES[surface];
  return (
    <form action={choose}>
      <div
        role="group"
        aria-label={label}
        className={layout === 'column' ? COLUMN_GROUP : classes.group}
      >
        {LOCALES.map((each) => (
          <button
            key={each}
            type="submit"
            name="locale"
            value={each}
            lang={each}
            aria-pressed={each === locale}
            className={`${classes.option} ${each === locale ? classes.current : classes.other}`}
          >
            {localeName(each)}
          </button>
        ))}
      </div>
    </form>
  );
}
