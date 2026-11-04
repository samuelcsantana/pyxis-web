'use client';

import { applyTheme, useThemeOnPage } from '@/components/theme/theme-on-page';
import { FOCUS_RING, CONTROL_TRANSITION } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { type Theme, THEME_CHOICES, type ThemeChoice } from '@/lib/theme';

export interface ThemeTilesProps {
  readonly initialTheme?: Theme;
}

const LABELS = {
  light: 'theme.light',
  dark: 'theme.dark',
  system: 'theme.system',
} as const satisfies Readonly<Record<ThemeChoice, string>>;

const LIGHT = { surface: '#f6f7f9', card: '#ffffff', line: '#d9dde3', bar: '#1f2430' };
const DARK = { surface: '#12151b', card: '#1c212a', line: '#323946', bar: '#e8ebf0' };

interface MiniatureProps {
  readonly colors: typeof LIGHT;
  readonly x: number;
}

function Miniature({ colors, x }: MiniatureProps) {
  return (
    <g transform={`translate(${String(x)} 0)`}>
      <rect width="120" height="72" fill={colors.surface} />
      <rect x="10" y="10" width="24" height="52" rx="3" fill={colors.card} stroke={colors.line} />
      <rect x="40" y="10" width="70" height="22" rx="3" fill={colors.card} stroke={colors.line} />
      <rect x="40" y="38" width="70" height="24" rx="3" fill={colors.card} stroke={colors.line} />
      <rect x="46" y="17" width="30" height="4" rx="2" fill={colors.bar} />
      <rect x="46" y="45" width="44" height="4" rx="2" fill={colors.line} />
      <rect x="14" y="16" width="16" height="3" rx="1.5" fill={colors.bar} />
      <rect x="14" y="24" width="12" height="3" rx="1.5" fill={colors.line} />
    </g>
  );
}

function Preview({ choice }: { readonly choice: ThemeChoice }) {
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <clipPath id="theme-tile-half">
          <rect x="60" width="60" height="72" />
        </clipPath>
      </defs>
      <Miniature colors={choice === 'dark' ? DARK : LIGHT} x={0} />
      {choice === 'system' ? (
        <g clipPath="url(#theme-tile-half)">
          <Miniature colors={DARK} x={0} />
        </g>
      ) : null}
    </svg>
  );
}

export function ThemeTiles({ initialTheme }: ThemeTilesProps) {
  const t = useT();
  const chosen = useThemeOnPage(initialTheme);
  return (
    <div role="group" aria-label={t('theme.label')} className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {THEME_CHOICES.map((choice) => {
        const selected = choice === chosen;
        return (
          <button
            key={choice}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              applyTheme(choice);
            }}
            className={`flex flex-col gap-2 rounded-input text-left ${FOCUS_RING} ${CONTROL_TRANSITION}`}
          >
            <span
              className={`block overflow-hidden rounded-input border-2 ${selected ? 'border-accent' : 'border-line hover:border-muted'}`}
            >
              <Preview choice={choice} />
            </span>
            <span
              className={`px-0.5 text-caption ${selected ? 'font-semibold text-ink' : 'text-muted'}`}
            >
              {t(LABELS[choice])}
            </span>
          </button>
        );
      })}
    </div>
  );
}
