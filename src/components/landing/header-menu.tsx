import type { ReactNode } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { MenuDisclosure } from './menu-disclosure';

export interface HeaderMenuProps {
  readonly label: string;
  readonly className: string;
  readonly children: ReactNode;
}

const MENU_ICON = 'M4 7h16 M4 12h16 M4 17h16';
const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';

function MenuIcon({ path, className }: { readonly path: string; readonly className: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function HeaderMenu({ label, className, children }: HeaderMenuProps) {
  return (
    <MenuDisclosure className={`group/menu relative ${className}`}>
      <summary
        className={`flex size-11 cursor-pointer list-none items-center justify-center rounded-input border border-line bg-card text-ink hover:border-muted hover:bg-soft active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION} [&::-webkit-details-marker]:hidden`}
      >
        <span className="sr-only">{label}</span>
        <MenuIcon path={MENU_ICON} className="group-open/menu:hidden" />
        <MenuIcon path={CLOSE_ICON} className="hidden group-open/menu:block" />
      </summary>
      <div className="absolute top-full right-0 z-30 mt-2 w-56 rounded-input border border-line bg-card p-1.5 shadow-raised">
        {children}
      </div>
    </MenuDisclosure>
  );
}
