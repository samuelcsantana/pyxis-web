import { CONTROL_TRANSITION, FOCUS_RING } from './control-classes';
export const PANEL =
  'flex min-w-0 flex-col gap-3 rounded-card border border-line bg-card p-3.5 text-ink sm:px-5.5 sm:py-5';
export const PANEL_TITLE = 'text-sm font-semibold sm:text-base';
export const HEADER_CELL = 'border-b border-line px-2.5 py-2 font-medium text-muted';
export const BODY_CELL = 'border-b border-line px-2.5 py-2.5';
export const TABLE_SCROLL = 'relative -m-1 overflow-x-auto p-1';
export const BAR_TRACK = 'block h-1.5 rounded-pill bg-soft';
export const BAR_FILL = 'block h-1.5 rounded-pill';
const ROW_LINK_TEXT = 'text-ink underline decoration-muted underline-offset-4';
export const ROW_LINK = `-my-1 inline-block min-h-6 min-w-6 py-1 ${ROW_LINK_TEXT} hover:text-sky-ink hover:decoration-2 active:text-sky-ink active:decoration-2 ${FOCUS_RING} ${CONTROL_TRANSITION}`;
export const ROW_BUTTON_TEXT = `${ROW_LINK_TEXT} group-hover:text-sky-ink group-hover:decoration-2 group-active:text-sky-ink group-active:decoration-2`;
export const SECTION_STACK = 'flex flex-col gap-3.5 sm:gap-5';
