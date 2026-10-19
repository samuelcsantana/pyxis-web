import type { JSX } from 'react';
import type { Locale } from '@/i18n/locales';

const WIDTH = 30;
const HEIGHT = 20;
const SHOWN_WIDTH = 21;
const SHOWN_HEIGHT = 14;
const VIEW_BOX = `0 0 ${String(WIDTH)} ${String(HEIGHT)}`;

const UNITED_STATES_STRIPES = 13;
const UNITED_STATES_CANTON_STRIPES = 7;
const UNITED_STATES_STRIPE = HEIGHT / UNITED_STATES_STRIPES;
const UNITED_STATES_CANTON = {
  width: 12,
  height: UNITED_STATES_STRIPE * UNITED_STATES_CANTON_STRIPES,
} as const;
const UNITED_STATES_STARS = [
  [2, 1.6],
  [5, 1.6],
  [8, 1.6],
  [11, 1.6],
  [3.5, 3.3],
  [6.5, 3.3],
  [9.5, 3.3],
  [2, 5],
  [5, 5],
  [8, 5],
  [11, 5],
  [3.5, 6.7],
  [6.5, 6.7],
  [9.5, 6.7],
  [2, 8.4],
  [5, 8.4],
  [8, 8.4],
  [11, 8.4],
] as const;
const STAR_RADIUS = 0.55;

const BRAZIL_DIAMOND = '15,2.5 27,10 15,17.5 3,10';
const BRAZIL_GLOBE_RADIUS = 4.6;
const BRAZIL_BAND = 'M10.6 9.2c3-.9 6.4-.5 8.9 1.2';
const BRAZIL_BAND_WIDTH = 0.9;

const SPAIN_BAND = { top: HEIGHT / 4, height: HEIGHT / 2 } as const;
const THIRD_OF_WIDTH = WIDTH / 3;
const THIRD_OF_HEIGHT = HEIGHT / 3;

const COLORS = {
  unitedStatesRed: '#b22234',
  unitedStatesBlue: '#3c3b6e',
  white: '#ffffff',
  brazilGreen: '#009c3b',
  brazilYellow: '#ffdf00',
  brazilBlue: '#002776',
  spainRed: '#c60b1e',
  spainYellow: '#ffc400',
  germanyBlack: '#000000',
  germanyRed: '#dd0000',
  germanyGold: '#ffce00',
  franceBlue: '#002654',
  franceRed: '#ce1126',
  italyGreen: '#009246',
  italyRed: '#ce2b37',
  netherlandsRed: '#ae1c28',
  netherlandsBlue: '#21468b',
} as const;

function UnitedStates() {
  return (
    <>
      <rect width={WIDTH} height={HEIGHT} fill={COLORS.white} />
      {Array.from({ length: Math.ceil(UNITED_STATES_STRIPES / 2) }, (_, index) => (
        <rect
          key={index}
          y={index * 2 * UNITED_STATES_STRIPE}
          width={WIDTH}
          height={UNITED_STATES_STRIPE}
          fill={COLORS.unitedStatesRed}
        />
      ))}
      <rect
        width={UNITED_STATES_CANTON.width}
        height={UNITED_STATES_CANTON.height}
        fill={COLORS.unitedStatesBlue}
      />
      {UNITED_STATES_STARS.map(([x, y]) => (
        <circle
          key={`${String(x)}-${String(y)}`}
          cx={x}
          cy={y}
          r={STAR_RADIUS}
          fill={COLORS.white}
        />
      ))}
    </>
  );
}

function Brazil() {
  return (
    <>
      <rect width={WIDTH} height={HEIGHT} fill={COLORS.brazilGreen} />
      <polygon points={BRAZIL_DIAMOND} fill={COLORS.brazilYellow} />
      <circle cx={WIDTH / 2} cy={HEIGHT / 2} r={BRAZIL_GLOBE_RADIUS} fill={COLORS.brazilBlue} />
      <path d={BRAZIL_BAND} fill="none" stroke={COLORS.white} strokeWidth={BRAZIL_BAND_WIDTH} />
    </>
  );
}

function Spain() {
  return (
    <>
      <rect width={WIDTH} height={HEIGHT} fill={COLORS.spainRed} />
      <rect y={SPAIN_BAND.top} width={WIDTH} height={SPAIN_BAND.height} fill={COLORS.spainYellow} />
    </>
  );
}

function HorizontalTricolor({ colors }: { readonly colors: readonly [string, string, string] }) {
  return (
    <>
      {colors.map((color, index) => (
        <rect
          key={color}
          y={index * THIRD_OF_HEIGHT}
          width={WIDTH}
          height={THIRD_OF_HEIGHT}
          fill={color}
        />
      ))}
    </>
  );
}

function VerticalTricolor({ colors }: { readonly colors: readonly [string, string, string] }) {
  return (
    <>
      {colors.map((color, index) => (
        <rect
          key={color}
          x={index * THIRD_OF_WIDTH}
          width={THIRD_OF_WIDTH}
          height={HEIGHT}
          fill={color}
        />
      ))}
    </>
  );
}

function Germany() {
  return (
    <HorizontalTricolor colors={[COLORS.germanyBlack, COLORS.germanyRed, COLORS.germanyGold]} />
  );
}

function France() {
  return <VerticalTricolor colors={[COLORS.franceBlue, COLORS.white, COLORS.franceRed]} />;
}

function Italy() {
  return <VerticalTricolor colors={[COLORS.italyGreen, COLORS.white, COLORS.italyRed]} />;
}

function Netherlands() {
  return (
    <HorizontalTricolor colors={[COLORS.netherlandsRed, COLORS.white, COLORS.netherlandsBlue]} />
  );
}

const FLAGS: Readonly<Record<Locale, () => JSX.Element>> = {
  en: UnitedStates,
  'pt-BR': Brazil,
  es: Spain,
  de: Germany,
  fr: France,
  it: Italy,
  nl: Netherlands,
};

export interface LocaleFlagProps {
  readonly locale: Locale;
}

export function LocaleFlag({ locale }: LocaleFlagProps) {
  const Flag = FLAGS[locale];
  return (
    <svg
      width={SHOWN_WIDTH}
      height={SHOWN_HEIGHT}
      viewBox={VIEW_BOX}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-flag={locale}
      className="shrink-0 overflow-hidden rounded-[3px] ring-1 ring-line"
    >
      <Flag />
    </svg>
  );
}
