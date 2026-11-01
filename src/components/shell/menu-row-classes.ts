import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';

export type MenuRowLayout = 'inline' | 'stacked';

const MENU_ROW_LOOK = `min-h-11 rounded-control px-2.5 py-1.5 text-sm text-ink ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const MENU_ROW_IDLE = 'group/row hover:bg-line-strong active:bg-line-strong';
const MENU_ROW_CURRENT = 'bg-soft font-semibold';
const MENU_ROW_LAYOUT: Readonly<Record<MenuRowLayout, string>> = {
  inline: 'flex items-center gap-2.5',
  stacked: 'flex flex-col items-start justify-center gap-0.5',
};

export const MENU_ROW_NOTE = 'text-muted group-hover/row:text-ink group-active/row:text-ink';

export const MENU_PANEL =
  'absolute top-full z-20 mt-1.5 flex flex-col gap-1 rounded-input border border-line bg-card p-1.5 text-ink shadow-lg lg:max-h-[calc(100dvh-100%-3rem)] lg:scroll-py-1 lg:overflow-y-auto lg:overscroll-contain';

export function menuRowClasses(current = false, layout: MenuRowLayout = 'inline'): string {
  return `${MENU_ROW_LAYOUT[layout]} ${MENU_ROW_LOOK} ${current ? MENU_ROW_CURRENT : MENU_ROW_IDLE}`;
}
