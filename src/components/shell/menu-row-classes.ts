import { NAV_CONTROL, NAV_ITEM_CURRENT, NAV_ITEM_IDLE } from '@/components/ui/control-classes';

export function menuRowClasses(current = false): string {
  return `flex min-h-11 items-center rounded-input px-2.5 text-caption ${current ? NAV_ITEM_CURRENT : NAV_ITEM_IDLE} ${NAV_CONTROL}`;
}
