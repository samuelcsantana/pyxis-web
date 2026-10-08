'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type KeyboardEvent, type MouseEvent, type ReactNode, useRef, useState } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_CONTROL, NAV_FOCUS_RING } from '@/components/ui/control-classes';

export interface MobileMenuProps {
  readonly children: ReactNode;
}

const MENU_ID = 'main-navigation';
const OPEN_ICON = 'M4 7h16 M4 12h16 M4 17h16';
const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';

function useLocationKey(): string {
  return `${usePathname()}?${useSearchParams().toString()}`;
}

export function MobileMenu({ children }: MobileMenuProps) {
  const location = useLocationKey();
  const [openAt, setOpenAt] = useState<string>();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const open = openAt === location;

  const closeAfterNavigation = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('a') !== null) {
      setOpenAt(undefined);
    }
  };

  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (open && event.key === 'Escape') {
      setOpenAt(undefined);
      toggleRef.current?.focus();
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      onKeyDown={closeOnEscape}
      className="sticky top-0 z-30 max-h-dvh scroll-pt-14 overflow-y-auto overscroll-contain lg:h-dvh lg:scroll-pt-0"
    >
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-nav px-4 text-nav-strong lg:hidden">
        <Link href="/" className={`flex items-center gap-2 ${NAV_FOCUS_RING}`}>
          <LogoMark size={24} />
          <span className="text-lg font-bold tracking-tight">Pyxis</span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => {
            setOpenAt(open ? undefined : location);
          }}
          className={`flex size-11 items-center justify-center rounded-input border border-nav-border text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL}`}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={open ? CLOSE_ICON : OPEN_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div
        id={MENU_ID}
        onClick={closeAfterNavigation}
        className={`${open ? 'block' : 'hidden'} lg:flex lg:min-h-full lg:flex-col`}
      >
        {children}
      </div>
    </nav>
  );
}
