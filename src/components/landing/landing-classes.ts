import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';

export const LANDING_WIDTH = 'mx-auto w-full max-w-6xl px-5 lg:px-12';
export const REVEAL = 'landing-reveal';

const LINK_CONTROL = `${FOCUS_RING} ${CONTROL_TRANSITION}`;
const LINK_BUTTON = `inline-flex min-h-12 items-center gap-2 rounded-card px-4.5 text-callout font-semibold ${LINK_CONTROL}`;

export const LINK_PRIMARY = `${LINK_BUTTON} bg-accent text-accent-ink hover:bg-accent-hover active:bg-accent-pressed`;
export const LINK_SECONDARY = `${LINK_BUTTON} border border-line-strong bg-card text-ink hover:border-muted hover:bg-soft active:bg-line`;
export const LINK_SMALL = `inline-flex h-11 items-center rounded-input border border-line bg-card px-3 text-sm font-medium text-ink hover:border-muted hover:bg-soft active:bg-line ${LINK_CONTROL}`;
export const LINK_QUIET = `rounded-control text-muted underline-offset-4 hover:text-ink hover:underline active:text-ink ${LINK_CONTROL}`;
export const LINK_MENU = `flex min-h-11 w-full items-center rounded-control px-2.5 text-sm text-ink hover:bg-soft active:bg-line ${LINK_CONTROL}`;
export const LINK_LIST = `rounded-control text-ink underline-offset-4 hover:underline active:text-muted ${LINK_CONTROL}`;
