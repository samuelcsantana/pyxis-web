export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
export const FOCUS_WITHIN_RING =
  'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus';
export const NAV_FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
export const CONTROL_TRANSITION = 'transition-colors duration-150 motion-reduce:transition-none';
export const NAV_CONTROL = `${NAV_FOCUS_RING} ${CONTROL_TRANSITION}`;
export const NAV_ITEM_IDLE = 'text-nav-text hover:bg-nav-hover active:bg-nav-active';
export const NAV_ITEM_CURRENT = 'bg-nav-active font-semibold text-nav-strong';
export const CONTROL_DISABLED = 'disabled:cursor-not-allowed disabled:opacity-50';
export const CONTROL_BUSY = 'aria-busy:cursor-wait';
const CONTENT_CONTROL = `${FOCUS_RING} ${CONTROL_TRANSITION}`;
export const BUTTON_PRIMARY = `bg-accent font-semibold text-accent-ink enabled:hover:bg-accent-hover enabled:active:bg-accent-pressed ${CONTENT_CONTROL}`;
export const BUTTON_STRONG = `bg-ink font-semibold text-card enabled:hover:bg-ink-hover enabled:active:bg-ink-pressed ${CONTENT_CONTROL}`;
export const BUTTON_SECONDARY = `border border-line bg-card text-ink enabled:hover:border-muted enabled:hover:bg-soft enabled:active:border-muted enabled:active:bg-line ${CONTENT_CONTROL}`;
export const BUTTON_ICON = `flex items-center justify-center ${BUTTON_SECONDARY}`;
