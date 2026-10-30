import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  PENDING_HOST,
} from '@/components/ui/control-classes';

const ITEM = `flex min-h-11 items-center gap-3 rounded-input px-3 text-sm lg:min-h-9 ${PENDING_HOST} ${NAV_CONTROL}`;

export function navItemClasses(current: boolean): string {
  return `${ITEM} ${current ? NAV_ITEM_CURRENT : `font-medium ${NAV_ITEM_IDLE}`}`;
}

export interface NavItemIconProps {
  readonly path: string;
  readonly current: boolean;
}

export function NavItemIcon({ path, current }: NavItemIconProps) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={current ? 'text-accent' : 'text-nav-muted'}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
