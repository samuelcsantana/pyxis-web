export const FOCUS_RING = 'outline-focus focus-visible:outline-2 focus-visible:outline-offset-2';
export const FIELD_FOCUS_RING =
  'outline-focus focus-visible:outline-2 focus-visible:-outline-offset-1';
export const FIELD_FOCUS_WITHIN_RING =
  'outline-focus focus-within:outline-2 focus-within:-outline-offset-1';
export const NAV_FOCUS_RING =
  'outline-accent focus-visible:outline-2 focus-visible:outline-offset-2';
export const CONTROL_TRANSITION = 'transition-colors duration-150 motion-reduce:transition-none';
export const NAV_CONTROL = `${NAV_FOCUS_RING} ${CONTROL_TRANSITION}`;
export const NAV_ITEM_IDLE = 'text-nav-text hover:bg-nav-hover active:bg-nav-active';
export const NAV_ITEM_CURRENT = 'bg-nav-active font-semibold text-nav-strong';
export const CONTROL_DISABLED = 'disabled:cursor-not-allowed disabled:opacity-50';
export const CONTROL_BUSY = 'aria-busy:cursor-wait';
export const PENDING_HOST = 'relative';
const CONTENT_CONTROL = `${FOCUS_RING} ${CONTROL_TRANSITION}`;
export const BUTTON_PRIMARY = `bg-accent font-semibold text-accent-ink enabled:hover:bg-accent-hover enabled:active:bg-accent-pressed ${CONTENT_CONTROL}`;
export const BUTTON_STRONG = `bg-ink font-semibold text-card enabled:hover:bg-ink-hover enabled:active:bg-ink-pressed ${CONTENT_CONTROL}`;
export const BUTTON_SECONDARY = `border border-line bg-card text-ink enabled:hover:border-muted enabled:hover:bg-soft enabled:active:border-muted enabled:active:bg-line ${CONTENT_CONTROL}`;
export const BUTTON_ICON = `flex items-center justify-center ${BUTTON_SECONDARY}`;
export const SLIDING_INDICATOR =
  'pointer-events-none absolute top-0 left-0 transition-[translate,width,height] duration-200 ease-out motion-reduce:transition-none';
export const SEGMENTED_GROUP =
  'group/segmented relative flex gap-0.5 rounded-input border border-line bg-soft p-[3px]';
export const SEGMENTED_OPTION = `relative z-[1] flex items-center rounded-control text-caption font-medium ${CONTENT_CONTROL}`;
export const SEGMENTED_SELECTED = 'bg-ink text-card group-data-sliding/segmented:bg-transparent';
export const SEGMENTED_THUMB = `rounded-control bg-ink ${SLIDING_INDICATOR}`;
export const SEGMENTED_IDLE = 'text-muted hover:text-ink active:bg-card active:text-ink';
export const TAB = `flex items-center border-b-2 text-sm font-semibold ${CONTENT_CONTROL}`;
export const TAB_LIST = 'group/tabs relative flex flex-wrap gap-1 border-b border-line';
export const TAB_SELECTED = 'border-ink text-ink group-data-sliding/tabs:border-transparent';
export const TAB_BAR = `h-0.5 bg-ink ${SLIDING_INDICATOR}`;
export const TAB_IDLE =
  'border-transparent text-muted hover:text-ink active:border-muted active:text-ink';
export const PILL = `flex items-center rounded-pill border text-caption font-medium ${CONTENT_CONTROL}`;
export const PILL_SELECTED = 'border-ink bg-ink text-card';
export const PILL_IDLE =
  'border-line bg-card text-ink hover:border-muted hover:bg-soft active:border-muted active:bg-line';
export const FIELD = `border border-field bg-card text-ink aria-invalid:border-bad ${FIELD_FOCUS_RING} ${CONTROL_TRANSITION}`;
export const TEXT_LINK = `text-sky-ink underline underline-offset-2 hover:text-ink hover:decoration-2 active:text-ink active:decoration-2 ${CONTENT_CONTROL}`;
