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
